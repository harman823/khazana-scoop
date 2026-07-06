import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { Resend } from 'resend';
import { env } from '../config/env';
import { prisma } from '../lib/prisma';
import { sendEmail } from './notification.service';

type OrderItem = {
  name?: string;
  title?: string;
  sku?: string;
  quantity?: number;
  weightGrams?: number;
};

type OrderPayload = {
  orderId?: string;
  id?: string;
  customer?: {
    name?: string;
    email?: string;
  };
  customerName?: string;
  customerEmail?: string;
  email?: string;
  items?: OrderItem[];
  total?: number;
  currency?: string;
};

type AutomationEmail = {
  to: string;
  subject: string;
  html: string;
};

type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  totalWeightGrams: number;
  reservedGrams: number;
  lowStockThreshold: number;
  alertEmail?: string | null;
  alertWebhookUrl?: string | null;
};

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const getCustomerEmail = (order: OrderPayload) =>
  order.customer?.email || order.customerEmail || order.email || '';

const getCustomerName = (order: OrderPayload) =>
  order.customer?.name || order.customerName || 'there';

const normalizeItems = (items: unknown): OrderItem[] => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => (typeof item === 'object' && item ? item as OrderItem : {}));
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const fallbackThankYou = (order: OrderPayload, items: OrderItem[]) => {
  const name = escapeHtml(getCustomerName(order));
  const itemText = items
    .map((item) => escapeHtml(item.name || item.title || item.sku || 'your selected item'))
    .join(', ');

  return `Hi ${name},<br/><br/>Thank you for your order${itemText ? ` featuring ${itemText}` : ''}. We are preparing everything with care and will keep you updated as it moves forward.<br/><br/>Warmly,<br/>Kosmic Align`;
};

const generateWithOllama = async (order: OrderPayload, items: OrderItem[]) => {
  if (!env.OLLAMA_BASE_URL) {
    return fallbackThankYou(order, items);
  }

  const itemLines = items.map((item, index) => {
    const label = item.name || item.title || item.sku || `Item ${index + 1}`;
    const qty = item.quantity ? ` x ${item.quantity}` : '';
    return `- ${label}${qty}`;
  }).join('\n');

  const prompt = [
    'Write a concise, warm, personalized thank-you email body for a customer order.',
    'Use HTML paragraph tags only. Do not include a subject line.',
    `Customer name: ${getCustomerName(order)}`,
    `Order ID: ${order.orderId || order.id || 'unknown'}`,
    `Items:\n${itemLines || '- order items were not provided'}`,
  ].join('\n\n');

  const response = await fetch(`${env.OLLAMA_BASE_URL.replace(/\/$/, '')}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: env.OLLAMA_MODEL,
      prompt,
      stream: false,
      options: { temperature: 0.6 },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed with ${response.status}`);
  }

  const data = await response.json() as { response?: string };
  return data.response?.trim() || fallbackThankYou(order, items);
};

const sendAutomationEmail = async ({ to, subject, html }: AutomationEmail) => {
  if (resend && env.EMAIL_FROM) {
    const result = await resend.emails.send({ from: env.EMAIL_FROM, to, subject, html });
    if (result.error) throw new Error(result.error.message);
    return true;
  }

  if (env.SENDGRID_API_KEY && env.EMAIL_FROM) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: env.EMAIL_FROM },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    });

    if (!response.ok) throw new Error(`SendGrid request failed with ${response.status}`);
    return true;
  }

  return sendEmail({ to, subject, html });
};

const OrderEmailState = Annotation.Root({
  order: Annotation<OrderPayload>,
  items: Annotation<OrderItem[]>,
  email: Annotation<string>,
  html: Annotation<string>,
  subject: Annotation<string>,
  sent: Annotation<boolean>,
});

const normalizeOrderNode = async (state: typeof OrderEmailState.State) => {
  const items = normalizeItems(state.order.items);
  const email = getCustomerEmail(state.order);
  const orderId = state.order.orderId || state.order.id || 'unknown';

  if (!email) {
    throw new Error('Order payload is missing customer email');
  }

  return {
    items,
    email,
    subject: `Thank you for your order${orderId ? ` ${orderId}` : ''}`,
  };
};

const generateMessageNode = async (state: typeof OrderEmailState.State) => {
  try {
    return { html: await generateWithOllama(state.order, state.items) };
  } catch (error) {
    console.error('[LANGGRAPH] Ollama generation failed, using fallback:', error);
    return { html: fallbackThankYou(state.order, state.items) };
  }
};

const sendEmailNode = async (state: typeof OrderEmailState.State) => {
  await sendAutomationEmail({ to: state.email, subject: state.subject, html: state.html });
  return { sent: true };
};

const orderThankYouGraph = new StateGraph(OrderEmailState)
  .addNode('normalize_order', normalizeOrderNode)
  .addNode('generate_message', generateMessageNode)
  .addNode('send_email', sendEmailNode)
  .addEdge(START, 'normalize_order')
  .addEdge('normalize_order', 'generate_message')
  .addEdge('generate_message', 'send_email')
  .addEdge('send_email', END)
  .compile();

const InventoryPollState = Annotation.Root({
  inventory: Annotation<InventoryItem[]>,
  lowStockItems: Annotation<InventoryItem[]>,
  alertEmail: Annotation<string | undefined>,
  alertHtml: Annotation<string>,
  alertSent: Annotation<boolean>,
});

const loadInventoryNode = async () => {
  const inventory = await (prisma as any).bulkInventory.findMany({
    where: { totalWeightGrams: { gt: 0 } },
    orderBy: { updatedAt: 'desc' },
  });

  return { inventory };
};

const detectLowStockNode = async (state: typeof InventoryPollState.State) => {
  const lowStockItems = state.inventory.filter((item) =>
    item.totalWeightGrams - item.reservedGrams < item.lowStockThreshold
  );
  const alertEmail = env.ADMIN_ALERT_EMAIL || lowStockItems.find((item) => item.alertEmail)?.alertEmail || undefined;
  const rows = lowStockItems.map((item) => {
    const available = item.totalWeightGrams - item.reservedGrams;
    return `<li><strong>${escapeHtml(item.name)}</strong> (${escapeHtml(item.sku)}): ${available}g available, threshold ${item.lowStockThreshold}g</li>`;
  }).join('');

  return {
    lowStockItems,
    alertEmail,
    alertHtml: lowStockItems.length > 0
      ? `<p>The following bulk inventory items are below threshold:</p><ul>${rows}</ul>`
      : '',
  };
};

const sendLowStockAlertNode = async (state: typeof InventoryPollState.State) => {
  if (state.lowStockItems.length === 0) {
    return { alertSent: false };
  }

  if (state.alertEmail) {
    await sendAutomationEmail({ to: state.alertEmail, subject: 'Low inventory alert', html: state.alertHtml });
  }

  if (env.ADMIN_ALERT_WEBHOOK_URL) {
    await fetch(env.ADMIN_ALERT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'LOW_STOCK', lowStockItems: state.lowStockItems }),
    }).catch((error) => console.error('[LANGGRAPH] Alert webhook failed:', error));
  }

  return { alertSent: Boolean(state.alertEmail || env.ADMIN_ALERT_WEBHOOK_URL) };
};

const updateInventoryAlertStateNode = async (state: typeof InventoryPollState.State) => {
  if (state.lowStockItems.length === 0) {
    return {};
  }

  await Promise.all(state.lowStockItems.map((item) =>
    (prisma as any).bulkInventory.update({ where: { id: item.id }, data: { lastAlertedAt: new Date() } })
  ));

  return {};
};

const inventoryPollGraph = new StateGraph(InventoryPollState)
  .addNode('load_inventory', loadInventoryNode)
  .addNode('detect_low_stock', detectLowStockNode)
  .addNode('send_low_stock_alert', sendLowStockAlertNode)
  .addNode('update_inventory_alert_state', updateInventoryAlertStateNode)
  .addEdge(START, 'load_inventory')
  .addEdge('load_inventory', 'detect_low_stock')
  .addEdge('detect_low_stock', 'send_low_stock_alert')
  .addEdge('send_low_stock_alert', 'update_inventory_alert_state')
  .addEdge('update_inventory_alert_state', END)
  .compile();

export const processOrderThankYouWebhook = async (payload: unknown) => {
  const order = (payload && typeof payload === 'object' ? payload : {}) as OrderPayload;
  const orderId = order.orderId || order.id || `langgraph-${Date.now()}`;

  await (prisma as any).webhookEvent.upsert({
    where: { eventId: orderId },
    update: { payload: order as any },
    create: {
      eventId: orderId,
      provider: 'LANGGRAPH_ORDER',
      payload: order as any,
    },
  });

  const graphResult = await orderThankYouGraph.invoke({ order });

  await (prisma as any).automationRun.create({
    data: {
      type: 'ORDER_THANK_YOU',
      status: 'SUCCESS',
      source: 'langgraph-webhook',
      recipient: graphResult.email,
      subject: graphResult.subject,
      payload: { order, itemCount: graphResult.items.length } as any,
    },
  });

  await (prisma as any).webhookEvent.update({
    where: { eventId: orderId },
    data: { processed: true },
  });

  return { orderId, recipient: graphResult.email, itemCount: graphResult.items.length };
};

export const pollLowInventory = async () => {
  const graphResult = await inventoryPollGraph.invoke({});
  const lowStockItems = graphResult.lowStockItems;

  await (prisma as any).automationRun.create({
    data: {
      type: lowStockItems.length > 0 ? 'INVENTORY_LOW_STOCK' : 'INVENTORY_POLL',
      status: 'SUCCESS',
      source: 'langgraph-cron',
      recipient: graphResult.alertEmail,
      subject: lowStockItems.length > 0 ? 'Low inventory alert' : undefined,
      payload: { lowStockItems } as any,
    },
  });

  return { lowStockItems };
};

export const getAutomationStatus = async () => {
  const [recentRuns, inventory] = await Promise.all([
    (prisma as any).automationRun.findMany({ orderBy: { createdAt: 'desc' }, take: 12 }),
    (prisma as any).bulkInventory.findMany({ orderBy: { updatedAt: 'desc' }, take: 20 }),
  ]);

  return {
    config: {
      orderWebhookUrl: env.ORDER_WEBHOOK_URL || null,
      ollamaBaseUrl: env.OLLAMA_BASE_URL || null,
      ollamaModel: env.OLLAMA_MODEL,
      emailProvider: env.RESEND_API_KEY ? 'resend' : env.SENDGRID_API_KEY ? 'sendgrid' : env.SMTP_USER ? 'smtp' : 'mock',
      backendOrderWebhookPath: '/api/v1/automations/orders/thank-you',
      inventoryPollPath: '/api/v1/automations/inventory/poll',
      orchestration: 'langgraph',
    },
    recentRuns,
    inventory: inventory.map((item: any) => ({
      ...item,
      availableGrams: item.totalWeightGrams - item.reservedGrams,
      isLowStock: item.totalWeightGrams - item.reservedGrams < item.lowStockThreshold,
    })),
  };
};

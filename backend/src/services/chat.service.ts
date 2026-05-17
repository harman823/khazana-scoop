import dayjs from 'dayjs';
import { env } from '../config/env';
import { chatbotSourceOfTruth } from '../data/chatbot-source';
import { defaultServices } from '../data/default-services';
import { getAllServices } from './service.service';
import { getAvailableSlotsForDay } from './calendar.service';

type ChatRequest = {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
};

type ChatSlot = {
  date: string;
  day: string;
  slots: Array<{ label: string; start: string; booked: boolean }>;
};

type ChatServiceCard = {
  title: string;
  description: string;
  price: number;
  durationMin: number;
  slug: string;
};

type ChatAnswer = {
  message: string;
  services: ChatServiceCard[];
  availability: ChatSlot[];
  actions: Array<{ label: string; href: string; kind: 'booking' | 'whatsapp' | 'instagram' | 'email' }>;
  source: 'openai' | 'fallback';
};

const CONTACT_ACTIONS: ChatAnswer['actions'] = [
  { label: 'Book a session', href: '/booking', kind: 'booking' },
  { label: 'WhatsApp admin', href: 'https://wa.me/919876543210', kind: 'whatsapp' },
  {
    label: 'Instagram DM',
    href: 'https://www.instagram.com/kosmicalign?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    kind: 'instagram',
  },
  { label: 'Email us', href: 'mailto:hello@kosmicalign.com', kind: 'email' },
];

const normalizeText = (value: string) => value.toLowerCase().trim();

const wantsAvailability = (message: string) => {
  const text = normalizeText(message);
  return ['slot', 'time', 'available', 'availability', 'free', 'when', 'schedule', 'appointment'].some((term) =>
    text.includes(term)
  );
};

const wantsServices = (message: string) => {
  const text = normalizeText(message);
  return ['service', 'therapy', 'counselling', 'counseling', 'price', 'cost', 'offer'].some((term) =>
    text.includes(term)
  );
};

const formatDay = (date: string) =>
  dayjs(date).toDate().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Kolkata',
  });

const getServiceCards = async (): Promise<ChatServiceCard[]> => {
  const services = await getAllServices();

  return services.map((service: any) => ({
    title: service.title,
    description: service.description,
    price: Number(service.price),
    durationMin: Number(service.durationMin || 90),
    slug: service.slug || service.id,
  }));
};

const getStaticServiceCards = (): ChatServiceCard[] =>
  defaultServices.map((service) => ({
    title: service.title,
    description: service.description,
    price: Number(service.price),
    durationMin: Number(service.durationMin || 90),
    slug: service.slug || service.title,
  }));

const getUpcomingAvailability = async (serviceSlug?: string): Promise<ChatSlot[]> => {
  const groups: ChatSlot[] = [];
  let cursor = dayjs();

  for (let i = 0; i < 14 && groups.length < 5; i += 1) {
    cursor = cursor.add(i === 0 ? 0 : 1, 'day');
    const date = cursor.format('YYYY-MM-DD');
    const slots = await getAvailableSlotsForDay(date, serviceSlug);
    const openSlots = slots
      .filter((slot) => !slot.booked)
      .slice(0, 4)
      .map((slot) => ({
        label: slot.label,
        start: slot.start,
        booked: slot.booked,
      }));

    if (openSlots.length > 0) {
      groups.push({
        date,
        day: formatDay(date),
        slots: openSlots,
      });
    }
  }

  return groups;
};

const withTimeout = async <T>(promise: Promise<T>, fallback: T, timeoutMs = 4500): Promise<T> => {
  let timeout: NodeJS.Timeout | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timeout = setTimeout(() => resolve(fallback), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
};

const buildFallbackMessage = (request: ChatRequest, services: ChatServiceCard[], availability: ChatSlot[]) => {
  if (wantsAvailability(request.message)) {
    if (availability.length === 0) {
      return 'I checked the upcoming weekday window, but I could not find open slots right now. You can still use the booking page or message admin for help finding the next opening.';
    }

    return 'I found a few upcoming weekday openings. Please choose the final slot on the booking page, because availability can change while people are booking.';
  }

  if (wantsServices(request.message)) {
    return 'Here are the main ways KosmicAlign can support you. You can choose the service that feels closest to what you are moving through, and the booking page will show live weekday slots.';
  }

  return 'I can help with services, weekday availability, booking steps, pricing, and admin contact. Tell me what you are looking for and I will keep it simple.';
};

const callOpenAI = async (request: ChatRequest, services: ChatServiceCard[], availability: ChatSlot[]) => {
  if (!env.OPENAI_API_KEY) {
    return null;
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      input: [
        {
          role: 'developer',
          content: [
            {
              type: 'input_text',
              text: `${chatbotSourceOfTruth}

Return only JSON with this shape:
{"message":"friendly answer under 120 words"}

Use the live database/service/availability context below. Do not invent slots, prices, or contact details.`,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: JSON.stringify({
                visitorMessage: request.message,
                recentHistory: (request.history || []).slice(-6),
                services,
                availability,
              }),
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json() as any;
  const outputText = data.output_text || data.output?.flatMap((item: any) => item.content || [])
    .map((content: any) => content.text)
    .filter(Boolean)
    .join('\n');

  if (!outputText) {
    return null;
  }

  try {
    const parsed = JSON.parse(outputText);
    return typeof parsed.message === 'string' ? parsed.message : null;
  } catch {
    return outputText;
  }
};

export const answerChat = async (request: ChatRequest): Promise<ChatAnswer> => {
  const services = await withTimeout(getServiceCards(), getStaticServiceCards(), 4500);
  const preferredService = services.find((service) =>
    normalizeText(request.message).includes(normalizeText(service.title)) ||
    normalizeText(request.message).includes(normalizeText(service.slug))
  );
  const availability = wantsAvailability(request.message)
    ? await withTimeout(getUpcomingAvailability(preferredService?.slug || services[0]?.slug), [], 4500)
    : [];
  const visibleServices = wantsServices(request.message) ? services : services.slice(0, 3);

  const modelMessage = await callOpenAI(request, services, availability);

  return {
    message: modelMessage || buildFallbackMessage(request, visibleServices, availability),
    services: wantsServices(request.message) ? visibleServices : [],
    availability,
    actions: CONTACT_ACTIONS,
    source: modelMessage ? 'openai' : 'fallback',
  };
};

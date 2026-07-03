import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jsonError } from "@/lib/api-utils";
import { getStripe } from "@/lib/clients";
import {
  SESSION_COOKIE_NAME,
  ServiceError,
  calculateDatabaseCart,
  createOrder,
  createPaymentForOrder,
  requireUserFromSession,
} from "@/lib/production-store";
import { cartSchema } from "@/lib/validation";

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = cartSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }
  try {
    const stripe = getStripe();
    if (!stripe) {
      throw new ServiceError("Stripe is not configured. Set STRIPE_SECRET_KEY before accepting checkout.", 503);
    }

    const cookieStore = await cookies();
    const user = await requireUserFromSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
    const cart = await calculateDatabaseCart(parsed.data);
    const order = await createOrder(user.id, parsed.data);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      cancel_url: `${appUrl}/checkout`,
      line_items: cart.lines.map((line) => ({
        price_data: {
          currency: "usd",
          product_data: { name: line.label },
          unit_amount: line.priceCents,
        },
        quantity: line.quantity,
      })),
      metadata: {
        orderId: order.id,
        userId: user.id,
      },
      mode: "payment",
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Standard shipping",
            fixed_amount: { amount: cart.shippingCents, currency: "usd" },
            type: "fixed_amount",
          },
        },
      ],
      success_url: `${appUrl}/orders/${order.id}`,
    });

    if (!session.url) {
      throw new ServiceError("Stripe did not return a checkout URL.", 502);
    }

    await createPaymentForOrder(order.id, session.id, cart.totalCents);
    return NextResponse.json({ mode: "stripe", checkoutUrl: session.url, cart, order });
  } catch (error) {
    return jsonError(error);
  }
}

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { jsonError } from "@/lib/api-utils";
import { getStripe } from "@/lib/clients";
import { ServiceError, markStripeCheckoutPaid } from "@/lib/production-store";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripe || !webhookSecret) {
      throw new ServiceError("Stripe webhook is not configured.", 503);
    }

    const payload = await request.text();
    const signature = request.headers.get("stripe-signature");
    if (!payload || !signature) {
      return NextResponse.json({ error: "Missing webhook payload or signature" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (!orderId) {
        return NextResponse.json({ error: "Missing order metadata" }, { status: 400 });
      }
      await markStripeCheckoutPaid(orderId, session.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return jsonError(error);
  }
}

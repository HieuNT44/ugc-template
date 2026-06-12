import { NextResponse } from "next/server";
import Stripe from "stripe";

import {
  getStripeServer,
  getStripeWebhookSecret,
} from "@/features/payment/stripe";
import { fulfillPostPurchaseFromStripeSession } from "@/features/reading/lib/fulfill-post-purchase";

export async function POST(request: Request) {
  const stripe = getStripeServer();
  const webhookSecret = getStripeWebhookSecret();

  if (!stripe || !webhookSecret) {
    console.error("Stripe or STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  let payload: string;
  try {
    payload = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const sessionId =
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
      ? (event.data.object as Stripe.Checkout.Session).id
      : null;

  if (sessionId) {
    try {
      await fulfillPostPurchaseFromStripeSession({ sessionId });
    } catch (err) {
      console.error(
        "Post purchase fulfillment error for session",
        sessionId,
        err
      );
      return NextResponse.json(
        { error: "Fulfillment failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

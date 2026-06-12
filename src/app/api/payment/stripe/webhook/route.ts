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
      { error: "Webhookが設定されていません" },
      { status: 500 }
    );
  }

  let payload: string;
  try {
    payload = await request.text();
  } catch {
    return NextResponse.json(
      { error: "本文が正しくありません" },
      { status: 400 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "stripe-signatureヘッダーがありません" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "不明なエラー";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: "署名が無効です" }, { status: 400 });
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
        { error: "購入処理に失敗しました" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

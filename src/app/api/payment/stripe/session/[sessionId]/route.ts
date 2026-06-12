import { NextResponse } from "next/server";

import { getStripeServer } from "@/features/payment/stripe";

/** Returns safe Checkout Session fields for success handling. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  if (!sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session_id" }, { status: 400 });
  }

  const stripe = getStripeServer();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email ?? null,
      amount_total: session.amount_total,
      currency: session.currency,
      client_reference_id: session.client_reference_id ?? null,
      metadata: session.metadata ?? {},
    });
  } catch (err) {
    console.error("Stripe retrieve session error:", err);
    return NextResponse.json(
      { error: "Session not found or expired" },
      { status: 404 }
    );
  }
}

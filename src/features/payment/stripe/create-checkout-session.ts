import type Stripe from "stripe";

import type { CreateStripeCheckoutParams } from "./types";
import { getStripeServer } from "./config";

/**
 * Creates a Stripe Checkout Session for one-time payment.
 * @see https://docs.stripe.com/checkout/quickstart
 */
export async function createStripeCheckoutSession(
  params: CreateStripeCheckoutParams,
  options: { successUrl: string; cancelUrl: string }
): Promise<{ url: string } | { error: string }> {
  const stripe = getStripeServer();
  if (!stripe) {
    return { error: "Stripe is not configured" };
  }

  const {
    amount,
    currency = "usd",
    productName = "Order",
    customerEmail,
    clientReferenceId,
    metadata,
  } = params;

  if (amount < 1) {
    return { error: "Amount must be at least 1" };
  }

  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: amount,
            product_data: {
              name: productName,
            },
          },
        },
      ],
      success_url: options.successUrl,
      cancel_url: options.cancelUrl,
      ...(customerEmail && { customer_email: customerEmail }),
      ...(clientReferenceId && { client_reference_id: clientReferenceId }),
      ...(metadata && { metadata }),
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      return { error: "Failed to create checkout session" };
    }

    return { url: session.url };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe createCheckoutSession error:", err);
    return { error: message };
  }
}

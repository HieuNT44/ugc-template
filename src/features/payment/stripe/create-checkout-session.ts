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
    return { error: "Stripeが設定されていません" };
  }

  const {
    amount,
    currency = "usd",
    productName = "注文",
    customerEmail,
    clientReferenceId,
    metadata,
  } = params;

  if (amount < 1) {
    return { error: "金額は1以上である必要があります" };
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
      return { error: "チェックアウトセッションを作成できませんでした" };
    }

    return { url: session.url };
  } catch (err) {
    const message = err instanceof Error ? err.message : "不明なエラー";
    console.error("Stripe createCheckoutSession error:", err);
    return { error: message };
  }
}

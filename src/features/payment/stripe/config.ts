import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey && typeof window === "undefined") {
  console.warn(
    "STRIPE_SECRET_KEY is not set. Stripe payment APIs will not work."
  );
}

/** Server-side Stripe instance. Never expose the secret key to the client. */
export function getStripeServer(): Stripe | null {
  if (!secretKey) {
    return null;
  }

  return new Stripe(secretKey, {
    typescript: true,
  });
}

export function getStripeWebhookSecret(): string | null {
  return process.env.STRIPE_WEBHOOK_SECRET ?? null;
}

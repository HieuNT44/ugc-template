import { getStripeServer } from "@/features/payment/stripe";
import { toStripeUnitAmount } from "@/features/payment/stripe/amount";

import { fulfillContentPurchaseOnBackend } from "./fulfill-content-purchase-api";
import {
  getPostPurchaseBySessionId,
  hasUserPurchasedPost,
  recordPostPurchase,
} from "./post-purchase-repository";

type FulfillPostPurchaseInput = {
  sessionId: string;
  expectedUserId?: string;
  expectedPostId?: string;
  useBackend?: boolean;
};

function parseClientReferenceId(
  clientReferenceId: string | null | undefined
): { userId: string; postId: string } | null {
  if (!clientReferenceId) {
    return null;
  }

  const separatorIndex = clientReferenceId.indexOf(":");
  if (separatorIndex <= 0) {
    return null;
  }

  const userId = clientReferenceId.slice(0, separatorIndex);
  const postId = clientReferenceId.slice(separatorIndex + 1);

  if (!userId || !postId) {
    return null;
  }

  return { userId, postId };
}

function resolveContentId(
  metadata: Record<string, string | undefined>
): string | null {
  return metadata.contentId ?? metadata.postId ?? null;
}

/** Fulfill a paid post unlock from a Stripe Checkout Session. Idempotent. */
export async function fulfillPostPurchaseFromStripeSession(
  input: FulfillPostPurchaseInput
): Promise<boolean> {
  const {
    sessionId,
    expectedUserId,
    expectedPostId,
    useBackend = true,
  } = input;

  if (!sessionId.startsWith("cs_")) {
    return false;
  }

  const stripe = getStripeServer();
  if (!stripe) {
    return false;
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return false;
  }

  const metadata = session.metadata ?? {};
  const metadataUserId = metadata.userId;
  const metadataContentId = resolveContentId(metadata);
  const parsedReference = parseClientReferenceId(session.client_reference_id);

  const userId = metadataUserId ?? parsedReference?.userId;
  const contentId = metadataContentId ?? parsedReference?.postId;

  if (!userId || !contentId) {
    return false;
  }

  if (expectedUserId && userId !== expectedUserId) {
    return false;
  }

  if (expectedPostId && contentId !== expectedPostId) {
    return false;
  }

  if (useBackend) {
    const currency = (session.currency ?? "jpy").toUpperCase();
    const amount = session.amount_total ?? 0;

    return fulfillContentPurchaseOnBackend({
      stripeSessionId: sessionId,
      buyerId: userId,
      contentId,
      amount,
      currency,
    });
  }

  const existing = await getPostPurchaseBySessionId(sessionId);
  if (existing) {
    if (expectedUserId && existing.userId !== expectedUserId) {
      return false;
    }
    if (expectedPostId && existing.postId !== expectedPostId) {
      return false;
    }
    return true;
  }

  if (await hasUserPurchasedPost(userId, contentId)) {
    return true;
  }

  await recordPostPurchase({
    userId,
    postId: contentId,
    stripeSessionId: sessionId,
    amountCents: session.amount_total ?? 0,
    currency: (session.currency ?? "usd").toUpperCase(),
  });

  return true;
}

export function resolveStripeListedAmount(
  unitAmount: number,
  currency: string
): number {
  return toStripeUnitAmount(unitAmount, currency);
}

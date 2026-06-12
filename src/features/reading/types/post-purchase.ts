export type PostPurchaseRecord = {
  userId: string;
  postId: string;
  stripeSessionId: string;
  amountCents: number;
  currency: string;
  purchasedAt: string;
};

export const POST_PURCHASES_COLLECTION = "postPurchases";

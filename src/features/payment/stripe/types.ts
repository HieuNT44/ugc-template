/** Input to create a one-time payment Checkout Session. Amount in smallest currency unit. */
export interface CreateStripeCheckoutParams {
  amount: number;
  currency?: string;
  productName?: string;
  customerEmail?: string;
  /** Store order reference for fulfillment, e.g. `{userId}:{postId}` */
  clientReferenceId?: string;
  metadata?: Record<string, string>;
}

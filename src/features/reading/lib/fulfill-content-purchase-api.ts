type FulfillContentPurchaseInput = {
  stripeSessionId: string;
  buyerId: string;
  contentId: string;
  amount: number;
  currency: string;
};

type FulfillContentPurchaseResponse = {
  data: {
    id: number;
    buyer_id: string;
    content_id: string;
    stripe_session_id: string | null;
    amount: number | null;
    currency: string;
    purchased_at: string;
  };
};

export async function fulfillContentPurchaseOnBackend(
  input: FulfillContentPurchaseInput
): Promise<boolean> {
  const apiKey = process.env.INTERNAL_API_KEY?.trim();
  const baseUrl = process.env.API_BASE_URL?.trim();

  if (!apiKey || !baseUrl) {
    console.error("INTERNAL_API_KEY or API_BASE_URL is not configured");
    return false;
  }

  const url = `${baseUrl.replace(/\/$/, "")}/internal/content-purchases/stripe/fulfill`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Internal-Api-Key": apiKey,
      },
      body: JSON.stringify({
        stripe_session_id: input.stripeSessionId,
        buyer_id: input.buyerId,
        content_id: input.contentId,
        amount: input.amount,
        currency: input.currency.toUpperCase(),
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("Content purchase fulfill failed:", response.status, body);
      return false;
    }

    const payload = (await response.json()) as FulfillContentPurchaseResponse;

    return Boolean(payload.data?.content_id);
  } catch (error) {
    console.error("Content purchase fulfill request error:", error);
    return false;
  }
}

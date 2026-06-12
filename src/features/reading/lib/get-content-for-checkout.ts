import { apiRequest } from "@/core/api/server";

type ApiContentShow = {
  id: string;
  title: string | null;
  is_paid: boolean;
  price: number | null;
};

type ApiContentRead = {
  id: string;
  is_paid: boolean;
  access: "full" | "preview";
};

export type CheckoutContent = {
  id: string;
  title: string;
  price: number;
  currency: "JPY";
  alreadyPurchased: boolean;
};

export async function getContentForCheckout(
  contentId: string,
  token: string
): Promise<CheckoutContent | null> {
  const [showResult, readResult] = await Promise.all([
    apiRequest<ApiContentShow>({
      path: `/contents/${contentId}`,
      method: "GET",
      token,
    }),
    apiRequest<ApiContentRead>({
      path: `/contents/${contentId}/read`,
      method: "GET",
      token,
    }),
  ]);

  if (!showResult.ok) {
    return null;
  }

  const show = showResult.data;

  if (!show.is_paid || show.price == null || show.price <= 0) {
    return null;
  }

  const alreadyPurchased =
    readResult.ok &&
    readResult.data.is_paid &&
    readResult.data.access === "full";

  return {
    id: show.id,
    title: show.title?.trim() || "無題",
    price: show.price,
    currency: "JPY",
    alreadyPurchased,
  };
}

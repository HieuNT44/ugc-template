const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

/** Converts a listed content price to Stripe `unit_amount`. */
export function toStripeUnitAmount(
  listedPrice: number,
  currency = "JPY"
): number {
  const normalized = currency.toUpperCase();

  if (ZERO_DECIMAL_CURRENCIES.has(normalized)) {
    return listedPrice;
  }

  return listedPrice;
}

/** Formats a listed content price for display in paywall/labels. */
export function formatListedContentPrice(
  listedPrice: number,
  currency = "JPY"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(listedPrice);
}

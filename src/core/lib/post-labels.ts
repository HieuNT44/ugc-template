import type { PostLabel, PostLabelType } from "../types/post-label";

/** Tailwind classes backed by CSS variables in globals.css */
export const POST_LABEL_CLASS: Record<PostLabelType, string> = {
  paid: "border border-post-label-paid-border bg-post-label-paid-bg text-post-label-paid-text",
  purchased:
    "border border-post-label-purchased-border bg-post-label-purchased-bg text-post-label-purchased-text",
  expert:
    "border border-post-label-expert-border bg-post-label-expert-bg text-post-label-expert-text",
  human_written:
    "border border-post-label-human-border bg-post-label-human-bg text-post-label-human-text",
};

export const POST_LABEL_DISPLAY: Record<
  Exclude<PostLabelType, "paid">,
  string
> = {
  purchased: "購入済み",
  expert: "エキスパート",
  human_written: "人間が執筆",
};

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

export function formatPaidLabel(amountCents: number, currency = "USD"): string {
  const normalizedCurrency = (currency ?? "USD").toUpperCase();
  const amount = ZERO_DECIMAL_CURRENCIES.has(normalizedCurrency)
    ? amountCents
    : amountCents / 100;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: normalizedCurrency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
  return `Paid · ${formatted}`;
}

export function getPostLabelText(label: PostLabel): string {
  if (label.type === "paid") {
    return formatPaidLabel(label.amountCents, label.currency ?? "USD");
  }
  return POST_LABEL_DISPLAY[label.type];
}

/** Display order: purchased → paid → expert → human_written */
export function sortPostLabels(labels: PostLabel[]): PostLabel[] {
  const order: PostLabelType[] = [
    "purchased",
    "paid",
    "expert",
    "human_written",
  ];
  return [...labels].sort(
    (a, b) => order.indexOf(a.type) - order.indexOf(b.type)
  );
}

export function getPaidLabel(
  labels: PostLabel[]
): Extract<PostLabel, { type: "paid" }> | null {
  const label = labels.find((item) => item.type === "paid");
  return label?.type === "paid" ? label : null;
}

export function isPaidPost(labels: PostLabel[]): boolean {
  return getPaidLabel(labels) !== null;
}

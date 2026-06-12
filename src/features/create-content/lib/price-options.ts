import type { ContentType } from "../types/content-type";

export const BLOG_PRICE_OPTIONS = [100, 200, 300, 400, 500] as const;

export const REPORT_PRICE_OPTIONS = [
  1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000,
] as const;

export const BOOK_PRICE_OPTIONS = [500, 1000, 1500, 2000, 2500, 3000] as const;

export function getPriceOptionsForType(type: ContentType): readonly number[] {
  switch (type) {
    case "blog":
      return BLOG_PRICE_OPTIONS;
    case "report":
      return REPORT_PRICE_OPTIONS;
    case "book":
      return BOOK_PRICE_OPTIONS;
  }
}

export function formatYenPrice(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

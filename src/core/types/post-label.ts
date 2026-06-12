export type PostLabelType = "paid" | "purchased" | "expert" | "human_written";

export type PostLabel =
  | { type: "paid"; amountCents: number; currency?: string }
  | { type: "purchased" }
  | { type: "expert" }
  | { type: "human_written" };

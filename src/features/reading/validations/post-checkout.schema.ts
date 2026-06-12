import { z } from "zod";

export const postCheckoutSchema = z.object({
  postId: z.string().min(1),
  postSlug: z.string().min(1),
});

export type PostCheckoutInput = z.infer<typeof postCheckoutSchema>;

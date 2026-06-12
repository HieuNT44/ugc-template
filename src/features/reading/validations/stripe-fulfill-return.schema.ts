import { z } from "zod";

export const stripeFulfillReturnSchema = z.object({
  sessionId: z.string().startsWith("cs_"),
  postId: z.string().uuid(),
});

export type StripeFulfillReturnInput = z.infer<
  typeof stripeFulfillReturnSchema
>;

import { z } from "zod";

import { fullNameSchema } from "@/core/auth/validations/full-name-field";
import { usernameSchema } from "@/core/auth/validations/username-field";

export const readerOnboardingSchema = z.object({
  full_name: fullNameSchema,
  username: usernameSchema,
  bio: z
    .string()
    .max(5000, "自己紹介は5000文字以内で入力してください")
    .optional(),
  location: z
    .string()
    .max(255, "所在地は255文字以内で入力してください")
    .optional(),
});

export type ReaderOnboardingFormData = z.infer<typeof readerOnboardingSchema>;

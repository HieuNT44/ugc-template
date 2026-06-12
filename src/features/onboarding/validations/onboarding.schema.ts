import { z } from "zod";

import { fullNameSchema } from "@/core/auth/validations/full-name-field";
import { usernameSchema } from "@/core/auth/validations/username-field";

export const readerOnboardingSchema = z.object({
  full_name: fullNameSchema,
  username: usernameSchema,
  bio: z.string().max(5000, "Bio must be at most 5000 characters").optional(),
  location: z
    .string()
    .max(255, "Location must be at most 255 characters")
    .optional(),
});

export type ReaderOnboardingFormData = z.infer<typeof readerOnboardingSchema>;

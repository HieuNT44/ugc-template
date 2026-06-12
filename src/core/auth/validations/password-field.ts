import { z } from "zod";

import { authConfig } from "../config/auth.config";

export const apiPasswordSchema = z
  .string()
  .min(
    authConfig.passwordMinLength,
    `Password must be at least ${authConfig.passwordMinLength} characters`
  )
  .max(
    authConfig.passwordMaxLength,
    `Password must be at most ${authConfig.passwordMaxLength} characters`
  );

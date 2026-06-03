export const authConfig = {
  sessionTimeout: 7 * 24 * 60 * 60,
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60,
  passwordMinLength: 8,
  requireEmailVerification: true,
} as const;

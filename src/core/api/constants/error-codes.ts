/** Known API error codes from BE handoff (classify by code, not message). */
export const API_ERROR_CODES = {
  INVALID_CREDENTIALS: "invalid_credentials",
  UNAUTHORIZED: "unauthorized",
  TOKEN_EXPIRED: "token_expired",
  TOKEN_INVALID: "token_invalid",
  ACCOUNT_BANNED: "account_banned",
  VALIDATION_ERROR: "validation_error",
  EMAIL_ALREADY_EXISTS: "email_already_exists",
  RATE_LIMIT_EXCEEDED: "rate_limit_exceeded",
  FORBIDDEN: "forbidden",
  NOT_FOUND: "not_found",
  USERNAME_TAKEN: "profile.username_already_taken",
  /** Client-side / transport errors */
  NETWORK_ERROR: "network_error",
  INVALID_RESPONSE: "invalid_response",
} as const;

export type ApiErrorCode =
  (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

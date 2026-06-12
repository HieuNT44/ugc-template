import { API_ERROR_CODES } from "@/core/api/constants/error-codes";
import type { ApiClientError } from "@/core/api/lib/api-result";
import { isValidationError } from "@/core/api/lib/parse-api-error";
import { mapValidationErrorsToFields } from "@/core/api/lib/map-validation-errors";

export function getApiAuthErrorMessage(error: ApiClientError): string {
  if (error.message) {
    return error.message;
  }

  switch (error.code) {
    case API_ERROR_CODES.INVALID_CREDENTIALS:
      return "Email or password is incorrect.";
    case API_ERROR_CODES.ACCOUNT_BANNED:
      return "Your account has been suspended.";
    case API_ERROR_CODES.EMAIL_ALREADY_EXISTS:
      return "An account with this email already exists.";
    case API_ERROR_CODES.RATE_LIMIT_EXCEEDED:
      return "Too many attempts. Please try again later.";
    case API_ERROR_CODES.UNAUTHORIZED:
      return "Session expired. Please sign in again.";
    case API_ERROR_CODES.NETWORK_ERROR:
      return "Unable to reach the server. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function mapApiAuthFailure(error: ApiClientError): {
  error: string;
  fieldErrors?: Record<string, string[]>;
} {
  if (isValidationError(error)) {
    return {
      error: error.message,
      fieldErrors: mapValidationErrorsToFields(error.details),
    };
  }

  return { error: getApiAuthErrorMessage(error) };
}

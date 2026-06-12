import { API_ERROR_CODES } from "../constants/error-codes";

/** True when the API indicates the user must sign in again. */
export function isUnauthorizedResponse(status: number, code?: string): boolean {
  if (code === API_ERROR_CODES.INVALID_CREDENTIALS) {
    return false;
  }

  return (
    status === 401 ||
    code === API_ERROR_CODES.UNAUTHORIZED ||
    code === API_ERROR_CODES.TOKEN_EXPIRED ||
    code === API_ERROR_CODES.TOKEN_INVALID
  );
}

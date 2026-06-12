import { API_ERROR_CODES } from "../constants/error-codes";
import type { ApiErrorResponse } from "../types/envelope";
import type { ApiClientError } from "./api-result";
import { isUnauthorizedResponse } from "./is-unauthorized-response";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!isRecord(value) || !isRecord(value.error)) {
    return false;
  }

  const { error } = value;
  return typeof error.code === "string" && typeof error.message === "string";
}

export function parseApiError(
  status: number,
  body: unknown,
  fallbackMessage = "リクエストに失敗しました"
): ApiClientError {
  if (isApiErrorResponse(body)) {
    return {
      status,
      code: body.error.code,
      message: body.error.message,
      details: body.error.details,
    };
  }

  if (isRecord(body) && typeof body.message === "string") {
    return {
      status,
      code: API_ERROR_CODES.INVALID_RESPONSE,
      message: body.message,
    };
  }

  return {
    status,
    code: API_ERROR_CODES.INVALID_RESPONSE,
    message: fallbackMessage,
  };
}

export function createNetworkError(
  message = "ネットワークリクエストに失敗しました"
): ApiClientError {
  return {
    status: 0,
    code: API_ERROR_CODES.NETWORK_ERROR,
    message,
  };
}

export function isValidationError(error: ApiClientError): boolean {
  return error.code === API_ERROR_CODES.VALIDATION_ERROR;
}

export function isUnauthorizedError(error: ApiClientError): boolean {
  return (
    isUnauthorizedResponse(error.status, error.code) ||
    error.code === API_ERROR_CODES.INVALID_CREDENTIALS
  );
}

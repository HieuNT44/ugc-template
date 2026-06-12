import type { ValidationErrorDetail } from "../types/envelope";

export interface ApiClientError {
  status: number;
  code: string;
  message: string;
  details?: ValidationErrorDetail[];
}

export type ApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: ApiClientError };

export type ApiMessageResult =
  | { ok: true; message: string; status: number }
  | { ok: false; error: ApiClientError };

export function apiSuccess<T>(data: T, status: number): ApiResult<T> {
  return { ok: true, data, status };
}

export function apiFailure(error: ApiClientError): ApiResult<never> {
  return { ok: false, error };
}

export function apiMessageSuccess(
  message: string,
  status: number
): ApiMessageResult {
  return { ok: true, message, status };
}

export function apiMessageFailure(error: ApiClientError): ApiMessageResult {
  return { ok: false, error };
}

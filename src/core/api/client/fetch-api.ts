"use client";

import axios, { isAxiosError } from "axios";

import { getDefaultApiHeaders } from "../config/api.config";
import { getClientDeviceName } from "../lib/client-metadata";
import { API_ERROR_CODES } from "../constants/error-codes";
import type {
  ApiDataResponse,
  ApiErrorResponse,
  ApiMessageResponse,
  ValidationErrorDetail,
} from "../types/envelope";
import type { AppLanguage } from "../types/enums";

import { apiAxios, normalizeApiPath } from "./axios-instance";
import {
  handleClientUnauthorized,
  shouldRedirectOnUnauthorized,
} from "./handle-client-unauthorized";

export type ClientApiError = {
  status: number;
  code: string;
  message: string;
  details?: ValidationErrorDetail[];
};

export type ClientApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: ClientApiError };

export type ClientApiMessageResult =
  | { ok: true; message: string; status: number }
  | { ok: false; error: ClientApiError };

type ClientRequestOptions = {
  path: string;
  token?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  language?: AppLanguage;
  signal?: AbortSignal;
  /** When false, 401 does not redirect (e.g. login/register forms). */
  redirectOnUnauthorized?: boolean;
};

function parseErrorBody(status: number, body: unknown): ClientApiError {
  if (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof (body as ApiErrorResponse).error?.message === "string"
  ) {
    const { error } = body as ApiErrorResponse;
    return {
      status,
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  return {
    status,
    code: "request_failed",
    message: `Request failed (${status})`,
  };
}

function buildHeaders(
  language: AppLanguage | undefined,
  token?: string
): Record<string, string> {
  const headers: Record<string, string> = {
    ...(getDefaultApiHeaders(language) as Record<string, string>),
    "X-Device-Name": getClientDeviceName(),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function maybeRedirectUnauthorized(
  error: ClientApiError,
  redirectOnUnauthorized: boolean
): void {
  if (
    redirectOnUnauthorized &&
    shouldRedirectOnUnauthorized(error.status, error.code)
  ) {
    void handleClientUnauthorized();
  }
}

function toNetworkError(error: unknown): ClientApiError {
  if (axios.isCancel(error)) {
    return {
      status: 0,
      code: API_ERROR_CODES.NETWORK_ERROR,
      message: "Request cancelled",
    };
  }

  return {
    status: 0,
    code: API_ERROR_CODES.NETWORK_ERROR,
    message: error instanceof Error ? error.message : "Network request failed",
  };
}

/**
 * Browser-only JSON API client (axios → Laravel, no BFF).
 */
export async function clientApiRequest<T>(
  options: ClientRequestOptions
): Promise<ClientApiResult<T>> {
  const method = options.method ?? "GET";
  const redirectOnUnauthorized = options.redirectOnUnauthorized ?? true;

  try {
    const response = await apiAxios.request<ApiDataResponse<T>>({
      url: normalizeApiPath(options.path),
      method,
      headers: buildHeaders(options.language, options.token),
      data: method === "GET" ? undefined : options.body,
      signal: options.signal,
    });

    const body = response.data;

    if (
      typeof body === "object" &&
      body !== null &&
      "data" in body &&
      body.data !== undefined
    ) {
      return { ok: true, data: body.data, status: response.status };
    }

    return {
      ok: false,
      error: {
        status: response.status,
        code: API_ERROR_CODES.INVALID_RESPONSE,
        message: "Invalid API response shape",
      },
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const apiError = parseErrorBody(
        error.response.status,
        error.response.data
      );
      maybeRedirectUnauthorized(apiError, redirectOnUnauthorized);
      return { ok: false, error: apiError };
    }

    return { ok: false, error: toNetworkError(error) };
  }
}

/** For endpoints that return `{ message: string }` instead of `{ data: ... }`. */
export async function clientApiMessageRequest(
  options: ClientRequestOptions
): Promise<ClientApiMessageResult> {
  const method = options.method ?? "POST";
  const redirectOnUnauthorized = options.redirectOnUnauthorized ?? true;

  try {
    const response = await apiAxios.request<ApiMessageResponse>({
      url: normalizeApiPath(options.path),
      method,
      headers: buildHeaders(options.language, options.token),
      data: method === "GET" ? undefined : options.body,
      signal: options.signal,
    });

    const body = response.data;

    if (
      typeof body === "object" &&
      body !== null &&
      typeof body.message === "string"
    ) {
      return { ok: true, message: body.message, status: response.status };
    }

    return {
      ok: false,
      error: {
        status: response.status,
        code: API_ERROR_CODES.INVALID_RESPONSE,
        message: "Invalid API response shape",
      },
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const apiError = parseErrorBody(
        error.response.status,
        error.response.data
      );
      maybeRedirectUnauthorized(apiError, redirectOnUnauthorized);
      return { ok: false, error: apiError };
    }

    return { ok: false, error: toNetworkError(error) };
  }
}

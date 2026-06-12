import { getApiBaseUrl, getDefaultApiHeaders } from "../config/api.config";
import { withClientMetadata } from "./client-metadata";
import type { ApiDataResponse, ApiMessageResponse } from "../types/envelope";
import type { AppLanguage } from "../types/enums";
import {
  apiFailure,
  apiMessageFailure,
  apiMessageSuccess,
  apiSuccess,
  type ApiMessageResult,
  type ApiResult,
} from "./api-result";
import { createNetworkError, parseApiError } from "./parse-api-error";

export type ApiRequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions {
  path: string;
  method?: ApiRequestMethod;
  body?: unknown;
  token?: string | null;
  searchParams?: Record<string, string | number | boolean | undefined | null>;
  language?: AppLanguage;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

function buildApiUrl(
  path: string,
  searchParams?: ApiRequestOptions["searchParams"]
): string {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${baseUrl}${normalizedPath}`);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function buildRequestHeaders(
  options: ApiRequestOptions
): Record<string, string> {
  const defaults = getDefaultApiHeaders(options.language);
  const merged: Record<string, string> = {};

  for (const [key, value] of Object.entries(defaults)) {
    if (typeof value === "string") {
      merged[key] = value;
    }
  }

  if (options.headers) {
    const extra = new Headers(options.headers);
    extra.forEach((value, key) => {
      merged[key] = value;
    });
  }

  if (options.token) {
    merged.Authorization = `Bearer ${options.token}`;
  }

  return merged;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    return text.length > 0 ? { message: text } : null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Server-side HTTP client for Laravel API (BFF).
 * Import from `@/core/api/server` in Server Actions and Route Handlers only.
 */
export async function apiRequest<T>(
  options: ApiRequestOptions
): Promise<ApiResult<T>> {
  const method = options.method ?? "GET";
  const hasBody = options.body !== undefined && method !== "GET";

  try {
    const response = await fetch(
      buildApiUrl(options.path, options.searchParams),
      {
        method,
        headers: buildRequestHeaders(options),
        body: hasBody ? JSON.stringify(options.body) : undefined,
        signal: options.signal,
        cache: "no-store",
      }
    );

    const body = await parseResponseBody(response);

    if (!response.ok) {
      return apiFailure(parseApiError(response.status, body));
    }

    if (isDataResponse<T>(body)) {
      return apiSuccess(body.data, response.status);
    }

    return apiFailure(
      parseApiError(response.status, body, "Invalid API response shape")
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Network request failed";
    return apiFailure(createNetworkError(message));
  }
}

/**
 * For endpoints that return `{ message: string }` instead of `{ data: ... }`.
 */
export async function apiMessageRequest(
  options: ApiRequestOptions
): Promise<ApiMessageResult> {
  const method = options.method ?? "POST";
  const hasBody = options.body !== undefined && method !== "GET";

  try {
    const response = await fetch(
      buildApiUrl(options.path, options.searchParams),
      {
        method,
        headers: buildRequestHeaders(options),
        body: hasBody ? JSON.stringify(options.body) : undefined,
        signal: options.signal,
        cache: "no-store",
      }
    );

    const body = await parseResponseBody(response);

    if (!response.ok) {
      return apiMessageFailure(parseApiError(response.status, body));
    }

    if (isMessageResponse(body)) {
      return apiMessageSuccess(body.message, response.status);
    }

    return apiMessageFailure(
      parseApiError(response.status, body, "Invalid API response shape")
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Network request failed";
    return apiMessageFailure(createNetworkError(message));
  }
}

export { withClientMetadata };

function isDataResponse<T>(value: unknown): value is ApiDataResponse<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    (value as ApiDataResponse<T>).data !== undefined
  );
}

function isMessageResponse(value: unknown): value is ApiMessageResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as ApiMessageResponse).message === "string"
  );
}

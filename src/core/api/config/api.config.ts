import type { AppLanguage, ClientType } from "../types/enums";

const DEFAULT_API_BASE_URL = "http://localhost:8000/api/v1";

export const apiConfig = {
  defaultClientType: "web" satisfies ClientType,
  defaultDeviceName: "web",
  defaultLanguage: "en" satisfies AppLanguage,
} as const;

/** Resolves Laravel API base URL (no trailing slash). */
export function getApiBaseUrl(): string {
  const url =
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    DEFAULT_API_BASE_URL;

  return url.replace(/\/$/, "");
}

export function getDefaultApiHeaders(language?: AppLanguage): HeadersInit {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Accept-Language": language ?? apiConfig.defaultLanguage,
    "X-Client-Type": apiConfig.defaultClientType,
    "X-Device-Name": apiConfig.defaultDeviceName,
  };
}

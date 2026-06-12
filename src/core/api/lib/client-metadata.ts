import { apiConfig } from "../config/api.config";

const DEVICE_ID_STORAGE_KEY = "rr_device_id";

function resolveDeviceName(): string {
  if (typeof window === "undefined") {
    return apiConfig.defaultDeviceName;
  }

  const existing = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY)?.trim();
  if (existing) {
    return existing.slice(0, 255);
  }

  const deviceId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `web-${Date.now()}`;

  window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);

  return deviceId.slice(0, 255);
}

/** Merges default client metadata into auth request bodies. */
export function withClientMetadata<T extends object>(
  payload: T
): T & {
  client_type: typeof apiConfig.defaultClientType;
  device_name: string;
} {
  return {
    ...payload,
    client_type: apiConfig.defaultClientType,
    device_name: resolveDeviceName(),
  };
}

/** Resolves the stable device name for auth headers. */
export function getClientDeviceName(): string {
  return resolveDeviceName();
}

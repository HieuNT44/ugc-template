"use client";

import axios from "axios";

import { getApiBaseUrl, getDefaultApiHeaders } from "../config/api.config";

/** Shared axios instance for browser → Laravel API calls. */
export const apiAxios = axios.create({
  baseURL: getApiBaseUrl(),
  headers: getDefaultApiHeaders() as Record<string, string>,
  timeout: 30_000,
});

export function normalizeApiPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

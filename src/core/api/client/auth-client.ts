"use client";

import { withClientMetadata } from "../lib/client-metadata";
import type {
  AuthToken,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  GoogleLoginPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "../types";
import type { ApiUserRole } from "../types/enums";

import {
  clientApiMessageRequest,
  clientApiRequest,
  type ClientApiMessageResult,
  type ClientApiResult,
} from "./fetch-api";

const PUBLIC_AUTH_OPTIONS = { redirectOnUnauthorized: false } as const;

export async function clientLogin(
  payload: Omit<LoginPayload, "client_type" | "device_name">
): Promise<ClientApiResult<AuthToken>> {
  return clientApiRequest<AuthToken>({
    path: "/auth/login",
    method: "POST",
    body: withClientMetadata(payload),
    ...PUBLIC_AUTH_OPTIONS,
  });
}

export async function clientRegisterReader(
  payload: Omit<RegisterPayload, "client_type" | "device_name">
): Promise<ClientApiResult<AuthToken>> {
  return clientApiRequest<AuthToken>({
    path: "/auth/register",
    method: "POST",
    body: withClientMetadata(payload),
    ...PUBLIC_AUTH_OPTIONS,
  });
}

export async function clientRegisterCreator(
  payload: Omit<RegisterPayload, "client_type" | "device_name">
): Promise<ClientApiResult<AuthToken>> {
  return clientApiRequest<AuthToken>({
    path: "/auth/register/creator",
    method: "POST",
    body: withClientMetadata(payload),
    ...PUBLIC_AUTH_OPTIONS,
  });
}

export async function clientLoginWithGoogle(
  payload: Omit<GoogleLoginPayload, "client_type" | "device_name">,
  role?: ApiUserRole
): Promise<ClientApiResult<AuthToken>> {
  return clientApiRequest<AuthToken>({
    path: "/auth/social/google",
    method: "POST",
    body: withClientMetadata({
      ...payload,
      ...(role ? { role } : {}),
    }),
    ...PUBLIC_AUTH_OPTIONS,
  });
}

export async function clientForgotPassword(
  payload: ForgotPasswordPayload
): Promise<ClientApiMessageResult> {
  return clientApiMessageRequest({
    path: "/auth/forgot-password",
    method: "POST",
    body: payload,
    ...PUBLIC_AUTH_OPTIONS,
  });
}

export async function clientResetPassword(
  payload: ResetPasswordPayload
): Promise<ClientApiMessageResult> {
  return clientApiMessageRequest({
    path: "/auth/reset-password",
    method: "POST",
    body: payload,
    ...PUBLIC_AUTH_OPTIONS,
  });
}

export async function clientLogout(
  token: string
): Promise<ClientApiMessageResult> {
  return clientApiMessageRequest({
    path: "/auth/logout",
    method: "POST",
    token,
    redirectOnUnauthorized: false,
  });
}

export async function clientChangePassword(
  token: string,
  payload: ChangePasswordPayload
): Promise<ClientApiMessageResult> {
  return clientApiMessageRequest({
    path: "/auth/change-password",
    method: "POST",
    token,
    body: payload,
  });
}

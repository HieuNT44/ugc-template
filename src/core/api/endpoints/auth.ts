import { withClientMetadata } from "../lib/api-client";
import type { ApiMessageResult, ApiResult } from "../lib/api-result";
import { apiMessageRequest, apiRequest } from "../server";
import type {
  ApiUser,
  AuthToken,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  GoogleLoginPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "../types";
import type { ApiUserRole } from "../types/enums";

export async function registerReader(
  payload: Omit<RegisterPayload, "client_type" | "device_name">
): Promise<ApiResult<AuthToken>> {
  return apiRequest<AuthToken>({
    path: "/auth/register",
    method: "POST",
    body: withClientMetadata(payload),
  });
}

export async function registerCreator(
  payload: Omit<RegisterPayload, "client_type" | "device_name">
): Promise<ApiResult<AuthToken>> {
  return apiRequest<AuthToken>({
    path: "/auth/register/creator",
    method: "POST",
    body: withClientMetadata(payload),
  });
}

export async function login(
  payload: Omit<LoginPayload, "client_type" | "device_name">
): Promise<ApiResult<AuthToken>> {
  return apiRequest<AuthToken>({
    path: "/auth/login",
    method: "POST",
    body: withClientMetadata(payload),
  });
}

export async function loginWithGoogle(
  payload: Omit<GoogleLoginPayload, "client_type" | "device_name">
): Promise<ApiResult<AuthToken>> {
  return apiRequest<AuthToken>({
    path: "/auth/social/google",
    method: "POST",
    body: withClientMetadata(payload),
  });
}

export async function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<ApiMessageResult> {
  return apiMessageRequest({
    path: "/auth/forgot-password",
    method: "POST",
    body: payload,
  });
}

export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<ApiMessageResult> {
  return apiMessageRequest({
    path: "/auth/reset-password",
    method: "POST",
    body: payload,
  });
}

export async function getMe(token: string): Promise<ApiResult<ApiUser>> {
  return apiRequest<ApiUser>({
    path: "/auth/me",
    method: "GET",
    token,
  });
}

export async function refreshToken(
  token: string
): Promise<ApiResult<AuthToken>> {
  return apiRequest<AuthToken>({
    path: "/auth/refresh",
    method: "POST",
    token,
  });
}

export async function logout(token: string): Promise<ApiMessageResult> {
  return apiMessageRequest({
    path: "/auth/logout",
    method: "POST",
    token,
  });
}

export async function changePassword(
  token: string,
  payload: ChangePasswordPayload
): Promise<ApiMessageResult> {
  return apiMessageRequest({
    path: "/auth/change-password",
    method: "POST",
    token,
    body: payload,
  });
}

export type { ApiUserRole };

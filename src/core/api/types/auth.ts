import type {
  ApiUserRole,
  ApiUserStatus,
  ClientType,
  ExpertStatus,
} from "./enums";

export interface ApiUser {
  id: string;
  email: string;
  role: ApiUserRole;
  status: ApiUserStatus;
  expert_status: ExpertStatus;
  email_verified_at: string | null;
}

export interface AuthToken {
  access_token: string;
  expires_at: string | null;
  client_type: ClientType;
  user: ApiUser;
}

export interface LoginPayload {
  email: string;
  password: string;
  client_type?: ClientType;
  device_name?: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  full_name: string;
  password: string;
  password_confirmation: string;
  client_type?: ClientType;
  device_name?: string;
}

export interface GoogleLoginPayload {
  id_token: string;
  role?: ApiUserRole;
  client_type?: ClientType;
  device_name?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

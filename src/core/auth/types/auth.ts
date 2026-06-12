export type AuthProvider = "credentials" | "google" | "line" | "github";

export type AuthSessionSuccess = {
  success: true;
  redirectTo: string;
  accessToken: string;
  expiresAt: string | null;
};

export type AuthSessionFailure = {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
};

export type AuthSessionResponse = AuthSessionSuccess | AuthSessionFailure;

export type LoginResponse = AuthSessionResponse;
export type RegisterResponse = AuthSessionResponse;
export type GoogleLoginResponse = AuthSessionResponse;

export type ActionSuccess = { success: true; message?: string };
export type ActionFailure = {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
};
export type ActionResponse = ActionSuccess | ActionFailure;

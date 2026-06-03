export type AuthProvider = "credentials" | "google" | "line" | "github";

export type LoginSuccess = { success: true; redirectTo: string };
export type LoginFailure = { success: false; error: string };
export type LoginResponse = LoginSuccess | LoginFailure;

export type RegisterSuccess = { success: true; userId: string };
export type RegisterFailure = { success: false; error: string };
export type RegisterResponse = RegisterSuccess | RegisterFailure;

export type ActionSuccess = { success: true };
export type ActionFailure = { success: false; error: string };
export type ActionResponse = ActionSuccess | ActionFailure;

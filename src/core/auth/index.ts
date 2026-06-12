export { LoginForm } from "./components/LoginForm";
export { RegisterForm } from "./components/RegisterForm";
export { ForgotPasswordForm } from "./components/ForgotPasswordForm";
export { ResetPasswordForm } from "./components/ResetPasswordForm";
export { OTPVerificationForm } from "./components/OTPVerificationForm";
export { SocialLoginSection } from "./components/SocialLoginSection";
export { AuthPageHeader } from "./components/AuthPageHeader";
export { AuthFormCard } from "./components/AuthFormCard";
export { RoleGuard } from "./components/RoleGuard";
export { AuthSessionProvider } from "./components/session-provider";
export { AuthGuard } from "./components/AuthGuard";
export { GuestGuard } from "./components/GuestGuard";
export { LoginPageClient } from "./components/LoginPageClient";

export { authOptions } from "./lib/auth-options";
export { requireSession } from "./lib/require-session";
export { getServerJwt } from "./lib/get-server-jwt";
export { isAuthenticatedJwt } from "./lib/jwt-auth";
export {
  isProtectedRoute,
  PROTECTED_ROUTE_PREFIXES,
} from "./config/route-guards";

export { useAuth } from "./hooks/useAuth";
export { useSession } from "./hooks/useSession";
export { useLogin } from "./hooks/useLogin";
export { useRegister } from "./hooks/useRegister";
export { useForgotPassword } from "./hooks/useForgotPassword";

export { loginAction } from "./actions/loginAction";
export { registerAction } from "./actions/registerAction";
export { googleLoginAction } from "./actions/googleLoginAction";
export { logoutAction } from "./actions/logoutAction";
export { changePasswordAction } from "./actions/changePasswordAction";

export type { User, AuthProvider, UserRole, Role } from "./types";
export type { AppSession } from "./types/session";

export {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./validations";

export { authConfig, roleConfig } from "./config";

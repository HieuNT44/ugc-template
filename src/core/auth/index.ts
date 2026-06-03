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

export { authOptions } from "./lib/auth-options";

export { useAuth } from "./hooks/useAuth";
export { useSession } from "./hooks/useSession";
export { useLogin } from "./hooks/useLogin";
export { useRegister } from "./hooks/useRegister";
export { useForgotPassword } from "./hooks/useForgotPassword";

export { loginAction } from "./actions/loginAction";
export { registerAction } from "./actions/registerAction";
export { logoutAction } from "./actions/logoutAction";

export type { User, AuthProvider, UserRole, Role } from "./types";
export type { AppSession } from "./types/session";

export {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./validations";

export { authConfig, roleConfig } from "./config";

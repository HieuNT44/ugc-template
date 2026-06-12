import { authConfig } from "../config/auth.config";

export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < authConfig.passwordMinLength) {
    errors.push(
      `Password must be at least ${authConfig.passwordMinLength} characters`
    );
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("パスワードには大文字を1文字以上含めてください");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("パスワードには小文字を1文字以上含めてください");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("パスワードには数字を1文字以上含めてください");
  }

  return { valid: errors.length === 0, errors };
}

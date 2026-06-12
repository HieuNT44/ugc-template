import { API_ERROR_CODES } from "@/core/api/constants/error-codes";
import type { ApiClientError } from "@/core/api/lib/api-result";
import { isValidationError } from "@/core/api/lib/parse-api-error";
import { mapValidationErrorsToFields } from "@/core/api/lib/map-validation-errors";

export function getApiAuthErrorMessage(error: ApiClientError): string {
  if (error.message) {
    return error.message;
  }

  switch (error.code) {
    case API_ERROR_CODES.INVALID_CREDENTIALS:
      return "メールアドレスまたはパスワードが正しくありません。";
    case API_ERROR_CODES.ACCOUNT_BANNED:
      return "アカウントは停止されています。";
    case API_ERROR_CODES.EMAIL_ALREADY_EXISTS:
      return "このメールアドレスのアカウントはすでに存在します。";
    case API_ERROR_CODES.RATE_LIMIT_EXCEEDED:
      return "試行回数が多すぎます。時間をおいて再度お試しください。";
    case API_ERROR_CODES.UNAUTHORIZED:
      return "セッションの有効期限が切れました。再度ログインしてください。";
    case API_ERROR_CODES.NETWORK_ERROR:
      return "サーバーに接続できません。接続状況を確認して再度お試しください。";
    default:
      return "問題が発生しました。もう一度お試しください。";
  }
}

export function mapApiAuthFailure(error: ApiClientError): {
  error: string;
  fieldErrors?: Record<string, string[]>;
} {
  if (isValidationError(error)) {
    return {
      error: error.message,
      fieldErrors: mapValidationErrorsToFields(error.details),
    };
  }

  return { error: getApiAuthErrorMessage(error) };
}

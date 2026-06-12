import { getUploadMessage } from "./upload-messages";
import type { AppLanguage } from "../types/enums";

export type UploadStep = "validate" | "initiate" | "s3" | "complete";

export class UploadServiceError extends Error {
  readonly code?: string;
  readonly step: UploadStep;

  constructor(message: string, step: UploadStep, code?: string) {
    super(message);
    this.name = "UploadServiceError";
    this.step = step;
    this.code = code;
  }
}

export function getUploadErrorMessage(
  error: UploadServiceError,
  language: AppLanguage = "en"
): string {
  if (error.code === "upload.expired") {
    return getUploadMessage("upload_expired", language);
  }

  if (error.code === "upload.storage_access_denied") {
    return getUploadMessage("storage_access_denied", language);
  }

  if (error.step === "s3" || error.code === "s3_network_error") {
    return getUploadMessage("s3_failed", language);
  }

  switch (error.code) {
    case "not_image":
      return getUploadMessage("not_image", language);
    case "empty":
      return getUploadMessage("empty", language);
    case "too_large":
      return getUploadMessage("too_large", language);
    default:
      return error.message || getUploadMessage("generic", language);
  }
}

export function toUploadUserMessage(
  error: unknown,
  language: AppLanguage = "en"
): string {
  if (error instanceof UploadServiceError) {
    return getUploadErrorMessage(error, language);
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return getUploadMessage("generic", language);
}

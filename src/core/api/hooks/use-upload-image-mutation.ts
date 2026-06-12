"use client";

import { useMutation } from "@tanstack/react-query";

import { toUploadUserMessage } from "../lib/upload-error";
import { getUploadMessage } from "../lib/upload-messages";
import { uploadImage } from "../services/upload.service";
import type { UploadFileCompleted } from "../types";
import type { AppLanguage, UploadType } from "../types/enums";

type UploadImageVariables = {
  file: File;
  token: string;
};

export function useUploadImageMutation(
  uploadType: UploadType,
  language: AppLanguage = "en"
) {
  return useMutation({
    mutationFn: async ({ file, token }: UploadImageVariables) => {
      return uploadImage(file, uploadType, token, language);
    },
    meta: { uploadType, language },
  });
}

export function getUploadMutationErrorMessage(
  error: unknown,
  language: AppLanguage = "en"
): string {
  if (
    error instanceof Error &&
    error.message === getUploadMessage("unauthorized", language)
  ) {
    return error.message;
  }

  return toUploadUserMessage(error, language);
}

export type { UploadFileCompleted };

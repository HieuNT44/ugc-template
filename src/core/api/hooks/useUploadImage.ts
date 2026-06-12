"use client";

import { useCallback } from "react";

import { useSession } from "@/core/auth/hooks/useSession";

import {
  getUploadMutationErrorMessage,
  useUploadImageMutation,
} from "./use-upload-image-mutation";
import { getUploadMessage } from "../lib/upload-messages";
import type { UploadFileCompleted } from "../types";
import type { AppLanguage, UploadType } from "../types/enums";

export function useUploadImage(
  uploadType: UploadType,
  language: AppLanguage = "en"
) {
  const {
    session,
    isLoading: isSessionLoading,
    isAuthenticated,
  } = useSession();
  const mutation = useUploadImageMutation(uploadType, language);

  const upload = useCallback(
    async (file: File): Promise<UploadFileCompleted> => {
      const token = session?.accessToken?.trim();
      if (!token) {
        const message = getUploadMessage("unauthorized", language);
        throw new Error(message);
      }

      try {
        return await mutation.mutateAsync({ file, token });
      } catch (error) {
        const message = getUploadMutationErrorMessage(error, language);
        throw new Error(message, { cause: error });
      }
    },
    [language, mutation, session?.accessToken]
  );

  return {
    upload,
    isUploading: mutation.isPending,
    isSessionLoading,
    isAuthenticated,
    error: mutation.error
      ? getUploadMutationErrorMessage(mutation.error, language)
      : null,
    clearError: mutation.reset,
  };
}

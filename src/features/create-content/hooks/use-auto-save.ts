"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useSession } from "@/core/auth/hooks/useSession";
import type { SaveDraftInput } from "../lib/content-api";
import { isSaveDraftSuccess } from "../lib/action-results";
import {
  getContentMessage,
  getSaveDraftErrorMessage,
} from "../lib/content-messages";
import { saveDraftClient } from "../lib/content-client-api";
import { useCreateContentStore } from "./use-create-content-store";

export type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

const AUTO_SAVE_INTERVAL_MS = 30_000;

type AutoSaveOptions = {
  showToast?: boolean;
};

export function useAutoSave(
  getPayload: () => SaveDraftInput | null,
  enabled = true
) {
  const { session } = useSession();
  const store = useCreateContentStore();
  const [status, setStatus] = useState<AutoSaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const getPayloadRef = useRef(getPayload);

  useEffect(() => {
    getPayloadRef.current = getPayload;
  }, [getPayload]);

  const save = useCallback(
    async (options: AutoSaveOptions = {}) => {
      const payload = getPayloadRef.current();
      if (!payload) {
        return null;
      }

      setStatus("saving");
      const result = await saveDraftClient(payload, session?.accessToken);

      if (isSaveDraftSuccess(result)) {
        store.setDraftId(result.draft.id);
        setStatus("saved");
        setLastSavedAt(new Date());

        if (options.showToast) {
          toast.success(getContentMessage("draft_saved"));
        }

        return result.draft.id;
      }

      setStatus("error");

      if (options.showToast) {
        toast.error(getSaveDraftErrorMessage(result));
      }

      return null;
    },
    [session?.accessToken, store]
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const interval = window.setInterval(() => {
      void save();
    }, AUTO_SAVE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [enabled, save]);

  return { status, lastSavedAt, save };
}

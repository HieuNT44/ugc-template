"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type StripePurchaseReturnSyncProps = {
  stripe?: string;
  sessionId?: string;
  contentId: string;
};

function buildCleanPath(): string {
  const url = new URL(window.location.href);
  url.searchParams.delete("session_id");
  url.searchParams.delete("stripe");

  return `${url.pathname}${url.search}`;
}

export function StripePurchaseReturnSync({
  stripe,
  sessionId,
  contentId,
}: StripePurchaseReturnSyncProps) {
  const router = useRouter();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) {
      return;
    }

    if (stripe !== "success" || !sessionId?.startsWith("cs_")) {
      return;
    }

    handledRef.current = true;

    const storageKey = `stripe-return:${sessionId}`;

    void (async () => {
      if (!sessionStorage.getItem(storageKey)) {
        try {
          await fetch("/api/payment/stripe/fulfill-return", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId,
              postId: contentId,
            }),
          });
          sessionStorage.setItem(storageKey, "1");
        } catch (error) {
          console.error("Stripe purchase return sync failed:", error);
        }
      }

      router.replace(buildCleanPath(), { scroll: false });
      router.refresh();
    })();
  }, [stripe, sessionId, contentId, router]);

  return null;
}

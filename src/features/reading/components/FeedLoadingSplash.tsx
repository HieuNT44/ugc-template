"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";

import { TypingEffect } from "@/core/components/text";

const SPLASH_TEXT = "RealRead";

const HOLD_AFTER_TYPING_MS = 400;
const FADE_OUT_DURATION_S = 0.35;

interface FeedLoadingSplashProps {
  onDismiss: () => void;
}

export function FeedLoadingSplash({ onDismiss }: FeedLoadingSplashProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleTypingComplete = useCallback(() => {
    window.setTimeout(() => setIsVisible(false), HOLD_AFTER_TYPING_MS);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDismiss}>
      {isVisible ? (
        <motion.div
          key='feed-loading-splash'
          className='FeedLoadingSplash fixed inset-0 z-[100] flex items-center justify-center bg-white'
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_OUT_DURATION_S, ease: "easeOut" }}
          aria-busy='true'
          aria-live='polite'
          role='status'
        >
          <TypingEffect
            text={SPLASH_TEXT}
            immediate
            className='font-logo text-foreground text-4xl font-normal tracking-tight md:text-5xl'
            onComplete={handleTypingComplete}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

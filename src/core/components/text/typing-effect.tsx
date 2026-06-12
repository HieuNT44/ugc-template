"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const DEFAULT_LETTER_DELAY = 0.1;
const LETTER_DURATION = 0.2;

interface TypingEffectProps {
  text: string;
  className?: string;
  letterDelay?: number;
  /** Start animation immediately instead of waiting for scroll into view */
  immediate?: boolean;
  onComplete?: () => void;
}

export function TypingEffect({
  text,
  className,
  letterDelay = DEFAULT_LETTER_DELAY,
  immediate = false,
  onComplete,
}: TypingEffectProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true });
  const shouldAnimate = immediate || isInView;

  useEffect(() => {
    if (!shouldAnimate || !onComplete) {
      return;
    }

    const totalDelayMs =
      (text.length - 1) * letterDelay * 1000 + LETTER_DURATION * 1000;
    const timer = window.setTimeout(onComplete, totalDelayMs);

    return () => window.clearTimeout(timer);
  }, [shouldAnimate, letterDelay, onComplete, text.length]);

  return (
    <h2
      ref={ref}
      className={cn(
        "text-center text-4xl font-bold tracking-tighter md:text-6xl md:leading-[4rem]",
        className
      )}
      aria-label={text}
    >
      {text.split("").map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          initial={{ opacity: 0 }}
          animate={shouldAnimate ? { opacity: 1 } : {}}
          transition={{ duration: LETTER_DURATION, delay: index * letterDelay }}
          aria-hidden
        >
          {letter}
        </motion.span>
      ))}
    </h2>
  );
}

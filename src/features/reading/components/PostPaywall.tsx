"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/core/auth/hooks/useSession";
import { formatPaidLabel, getPaidLabel } from "@/core/lib/post-labels";
import type { PostLabel } from "@/core/types/post-label";

const PAYWALL_BENEFITS = [
  "Read the full story and every paid article on RealRead",
  "Support independent writers you follow",
  "Fair previews — know what you unlock before you pay",
  "Keep your library and purchases across devices",
] as const;

interface PostPaywallProps {
  postId: string;
  postSlug: string;
  postTitle: string;
  labels: PostLabel[];
  className?: string;
}

export function PostPaywall({
  postId,
  postSlug,
  postTitle,
  labels,
  className,
}: PostPaywallProps) {
  const { isAuthenticated } = useSession();
  const paidLabel = getPaidLabel(labels);
  const priceText = paidLabel
    ? formatPaidLabel(
        paidLabel.amountCents,
        paidLabel.currency ?? "USD"
      ).replace("Paid · ", "")
    : null;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/payment/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          postSlug,
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Checkout failed");
      }

      if (!data.url) {
        throw new Error("No redirect URL returned");
      }

      window.location.href = data.url;
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Unable to start checkout"
      );
      setLoading(false);
    }
  };

  return (
    <div
      className={`PostPaywall mx-auto w-full max-w-xl text-center ${className ?? ""}`}
    >
      {errorMessage ? (
        <Alert variant='destructive' className='mb-6 text-left'>
          <AlertTitle>Checkout unavailable</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <h2 className='text-foreground font-serif text-[clamp(1.75rem,4vw,2.25rem)] leading-tight font-bold tracking-tight'>
        Continue reading this story on RealRead
      </h2>

      <p className='text-muted-foreground mx-auto mt-4 max-w-md text-base leading-relaxed'>
        The author put &ldquo;{postTitle}&rdquo; behind a paid story. Unlock
        once to read the full article anytime.
      </p>

      <ul className='mx-auto mt-8 max-w-sm space-y-4 text-left'>
        {PAYWALL_BENEFITS.map((benefit) => (
          <li key={benefit} className='flex gap-3 text-sm leading-relaxed'>
            <Sparkles
              className='mt-0.5 size-4 shrink-0 fill-amber-400 text-amber-400'
              aria-hidden
            />
            <span className='text-foreground/90'>{benefit}</span>
          </li>
        ))}
      </ul>

      <Button
        type='button'
        size='lg'
        disabled={loading}
        onClick={handleCheckout}
        className='mt-10 h-12 rounded-full bg-[#1A8917] px-10 text-base font-medium text-white hover:bg-[#156D12]'
      >
        {loading
          ? "Redirecting…"
          : priceText
            ? `Pay to read · ${priceText}`
            : "Pay to read"}
      </Button>

      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className='PostPaywallLoginDialog sm:max-w-[420px]'>
          <DialogHeader>
            <DialogTitle>Login required</DialogTitle>
            <DialogDescription>
              You need to sign in before purchasing this story.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setLoginDialogOpen(false)}
            >
              Later
            </Button>
            <Button asChild>
              <Link href='/login'>Login</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { LockKeyhole } from "lucide-react";
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

interface BookPaywallProps {
  bookId: string;
  bookPath: string;
  bookTitle: string;
  labels: PostLabel[];
  previewPercent?: number | null;
}

export function BookPaywall({
  bookId,
  bookPath,
  bookTitle,
  labels,
  previewPercent,
}: BookPaywallProps) {
  const { isAuthenticated } = useSession();
  const paidLabel = getPaidLabel(labels);
  const priceText = paidLabel
    ? formatPaidLabel(
        paidLabel.amountCents,
        paidLabel.currency ?? "JPY"
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
          postId: bookId,
          postSlug: bookPath.replace(/^\//, ""),
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
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to start checkout"
      );
      setLoading(false);
    }
  };

  return (
    <section className='BookPaywall rounded-3xl border border-[#2A2A2A]/15 bg-[#F8F3E7]/95 p-6 text-[#2A2A2A] shadow-sm'>
      {errorMessage ? (
        <Alert variant='destructive' className='mb-5 text-left'>
          <AlertTitle>Checkout unavailable</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className='flex items-start gap-4'>
        <div className='flex size-11 shrink-0 items-center justify-center rounded-full bg-[#2A2A2A] text-[#F8F3E7]'>
          <LockKeyhole className='size-5' aria-hidden />
        </div>
        <div className='min-w-0'>
          <h2 className='font-serif text-2xl leading-tight font-bold'>
            Unlock the full book
          </h2>
          <p className='mt-3 text-sm leading-relaxed text-[#2A2A2A]/75'>
            You are reading the preview of &ldquo;{bookTitle}&rdquo;
            {previewPercent ? ` (${previewPercent}% preview)` : ""}. Purchase
            once to access every chapter.
          </p>
          <Button
            type='button'
            size='lg'
            disabled={loading}
            onClick={handleCheckout}
            className='mt-6 rounded-full bg-[#2A2A2A] px-8 text-[#F8F3E7] hover:bg-[#111111]'
          >
            {loading
              ? "Redirecting..."
              : priceText
                ? `Unlock book · ${priceText}`
                : "Unlock book"}
          </Button>
        </div>
      </div>

      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className='BookPaywallLoginDialog sm:max-w-[420px]'>
          <DialogHeader>
            <DialogTitle>Login required</DialogTitle>
            <DialogDescription>
              You need to sign in before purchasing this book.
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
    </section>
  );
}

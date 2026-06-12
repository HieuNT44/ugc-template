"use client";

import { CheckCircle, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export type PublishModalPhase = "processing" | "published" | "pending_review";

interface PublishStatusModalProps {
  open: boolean;
  phase: PublishModalPhase;
  humanScore?: number;
  onOpenChange: (open: boolean) => void;
}

export function PublishStatusModal({
  open,
  phase,
  humanScore,
  onOpenChange,
}: PublishStatusModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (!open || phase === "processing") {
      return;
    }

    router.push("/studio");
  }, [open, phase, router]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='PublishStatusModal sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {phase === "processing"
              ? "AI検出を実行中"
              : phase === "published"
                ? "公開しました"
                : "審査に提出しました"}
          </DialogTitle>
          <DialogDescription>
            {phase === "processing"
              ? "コンテンツが人間による執筆基準を満たしているか確認しています。"
              : phase === "published"
                ? "コンテンツが人間が執筆バッジ付きで公開されました。"
                : "コンテンツは審査キューに入っています。"}
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-center gap-3 py-4 text-center'>
          {phase === "processing" ? (
            <Loader2 className='text-primary size-12 animate-spin' />
          ) : phase === "published" ? (
            <CheckCircle className='size-12 text-emerald-600' />
          ) : (
            <Clock className='size-12 text-amber-600' />
          )}

          {phase !== "processing" && humanScore != null ? (
            <div className='flex items-center gap-2'>
              <span className='text-sm'>Human score: {humanScore}%</span>
              {phase === "published" ? (
                <Badge variant='success'>Human-Written</Badge>
              ) : (
                <Badge variant='warning'>審査待ち</Badge>
              )}
            </div>
          ) : null}
        </div>

        {phase !== "processing" ? (
          <DialogFooter>
            <Button className='w-full rounded-full' asChild>
              <Link href='/studio'>Back to Studio</Link>
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthGuard } from "@/core/auth/components/AuthGuard";

import type { ContentDocument } from "../types/content-document";
import { StudioKanbanBoard } from "./StudioKanbanBoard";

interface StudioContentProps {
  contents: ContentDocument[];
}

function StudioContent({ contents }: StudioContentProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Skeleton className='h-64 w-full' />;
  }

  if (session?.user?.role !== "creator") {
    return (
      <div className='Studio mx-auto w-full max-w-7xl px-6 py-10 text-center'>
        <h1 className='text-2xl font-semibold'>Creator studio</h1>
        <p className='text-muted-foreground mt-2'>
          Access denied. Creator role required.
        </p>
        <Button className='mt-4 rounded-full' asChild>
          <Link href='/profile/become-creator'>Become a Creator</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='Studio mx-auto w-full max-w-7xl px-6 py-10'>
      <StudioKanbanBoard contents={contents} />
    </div>
  );
}

interface StudioPageClientProps {
  contents: ContentDocument[];
}

export function StudioPageClient({ contents }: StudioPageClientProps) {
  return (
    <AuthGuard callbackPath='/studio'>
      <StudioContent contents={contents} />
    </AuthGuard>
  );
}

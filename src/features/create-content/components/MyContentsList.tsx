"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { ContentDocument } from "../types/content-document";
import { POST_STATUS_LABELS } from "../types/post-status";

function statusVariant(
  status: ContentDocument["status"]
): "secondary" | "success" | "warning" | "destructive" {
  switch (status) {
    case "published":
      return "success";
    case "pending_review":
      return "warning";
    case "rejected":
      return "destructive";
    default:
      return "secondary";
  }
}

interface MyContentsListProps {
  contents: ContentDocument[];
}

export function MyContentsList({ contents }: MyContentsListProps) {
  if (contents.length === 0) {
    return (
      <Card className='MyContentsList'>
        <CardContent className='py-10 text-center'>
          <p className='text-muted-foreground text-sm'>
            No content yet. Start creating in Studio.
          </p>
          <Button className='mt-4 rounded-full' asChild>
            <Link href='/studio/create'>コンテンツを作成</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='MyContentsList flex flex-col gap-3'>
      {contents.map((item) => (
        <Card key={item.id}>
          <CardHeader className='flex flex-row items-start justify-between gap-4'>
            <div className='min-w-0'>
              <CardTitle className='truncate text-base'>
                {item.title || "無題"}
              </CardTitle>
              <p className='text-muted-foreground mt-1 text-xs capitalize'>
                {item.type} · Updated{" "}
                {new Date(item.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={statusVariant(item.status)}>
              {POST_STATUS_LABELS[item.status]}
            </Badge>
          </CardHeader>
          {item.status === "rejected" && item.rejectionReason ? (
            <CardContent className='text-destructive text-sm'>
              {item.rejectionReason}
            </CardContent>
          ) : null}
        </Card>
      ))}
    </div>
  );
}

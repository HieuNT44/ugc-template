"use client";

import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { deleteAccountAction } from "../actions";

export function DeleteAccountSection() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await deleteAccountAction();
      if (result.error) {
        setError(result.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='DeleteAccountSection border-destructive/30'>
      <CardHeader>
        <CardTitle className='text-destructive'>アカウント削除</CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {error && (
          <Alert variant='destructive'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          type='button'
          variant='destructive'
          disabled={isLoading}
          onClick={handleDelete}
        >
          {isLoading ? "処理中..." : "アカウントを削除"}
        </Button>
      </CardContent>
    </Card>
  );
}

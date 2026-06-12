"use client";

import { useRef, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { getAvatarInitials } from "@/core/lib/avatar-initials";

const MAX_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ChangeAvatarSectionProps {
  currentImageUrl?: string;
  displayName?: string | null;
}

export function ChangeAvatarSection({
  currentImageUrl,
  displayName,
}: ChangeAvatarSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const displayUrl = previewUrl ?? currentImageUrl;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    setSavedMessage(null);
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setValidationError("Please upload a JPEG, PNG, or WebP image");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setValidationError(`Image must be smaller than ${MAX_SIZE_MB}MB`);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSave = () => {
    if (!previewUrl) return;
    setSavedMessage("Avatar preview saved locally. Upload API coming soon.");
  };

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSavedMessage(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Card className='ChangeAvatarSection'>
      <CardHeader>
        <CardTitle>Change avatar</CardTitle>
        <CardDescription>
          Upload a profile photo. Recommended size 256×256 or larger.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col items-start gap-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
          <Avatar className='border-border h-24 w-24 shrink-0 overflow-hidden rounded-full border-2'>
            {displayUrl ? (
              <AvatarImage src={displayUrl} alt='Profile avatar' />
            ) : null}
            <AvatarFallback className='bg-muted text-2xl font-semibold uppercase'>
              {getAvatarInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <p className='text-sm font-medium'>Profile photo</p>
            <p className='text-muted-foreground text-xs'>
              JPEG, PNG or WebP up to {MAX_SIZE_MB}MB
            </p>
          </div>
        </div>

        {validationError && (
          <Alert variant='destructive'>
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}
        {savedMessage && (
          <Alert>
            <CheckCircle className='size-4' />
            <AlertDescription>{savedMessage}</AlertDescription>
          </Alert>
        )}

        <input
          ref={inputRef}
          type='file'
          accept={ALLOWED_TYPES.join(",")}
          className='hidden'
          onChange={handleFileChange}
        />

        <div className='flex flex-wrap gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => inputRef.current?.click()}
          >
            Choose image
          </Button>
          {previewUrl && (
            <>
              <Button type='button' onClick={handleSave}>
                Save avatar
              </Button>
              <Button type='button' variant='ghost' onClick={handleRemove}>
                Remove
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

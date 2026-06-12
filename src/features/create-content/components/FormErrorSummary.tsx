"use client";

import { CircleAlert } from "lucide-react";
import { useFormState, type FieldValues } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DEFAULT_FIELD_LABELS: Record<string, string> = {
  title: "タイトル",
  shortDescription: "短い説明",
  field: "分野",
  tags: "タグ",
  content: "本文",
  editorMode: "エディター",
  coverImageUrl: "カバー画像",
  templateId: "テンプレート",
  pricingType: "価格設定",
  priceYen: "価格",
  description: "説明",
  pdfUrl: "PDF",
  previewPages: "プレビューページ",
};

interface FormErrorSummaryProps {
  fieldLabels?: Record<string, string>;
  title?: string;
  className?: string;
}

export function FormErrorSummary<T extends FieldValues>({
  fieldLabels = DEFAULT_FIELD_LABELS,
  title = "以下を修正してください",
  className,
}: FormErrorSummaryProps) {
  const { errors } = useFormState<T>();

  const messages = Object.entries(errors).flatMap(([field, error]) => {
    if (!error?.message) {
      return [];
    }

    const label = fieldLabels[field] ?? field;
    return [{ field, label, message: String(error.message) }];
  });

  if (messages.length === 0) {
    return null;
  }

  return (
    <Alert variant='destructive' className={className}>
      <CircleAlert aria-hidden />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <ul className='list-disc space-y-1 pl-4'>
          {messages.map(({ field, label, message }) => (
            <li key={field}>
              <span className='font-medium'>{label}:</span> {message}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

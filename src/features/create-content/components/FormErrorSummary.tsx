"use client";

import { CircleAlert } from "lucide-react";
import { useFormState, type FieldValues } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DEFAULT_FIELD_LABELS: Record<string, string> = {
  title: "Title",
  shortDescription: "Short description",
  field: "Field",
  tags: "Tags",
  content: "Content",
  editorMode: "Editor",
  coverImageUrl: "Cover image",
  templateId: "Template",
  pricingType: "Pricing",
  priceYen: "Price",
  description: "Description",
  pdfUrl: "PDF",
  previewPages: "Preview pages",
};

interface FormErrorSummaryProps {
  fieldLabels?: Record<string, string>;
  title?: string;
  className?: string;
}

export function FormErrorSummary<T extends FieldValues>({
  fieldLabels = DEFAULT_FIELD_LABELS,
  title = "Please fix the following",
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

import { z } from "zod";

import { CONTENT_FIELD_OPTIONS } from "../lib/field-options";

export const titleSchema = z
  .string()
  .transform((s) => s.trim())
  .pipe(
    z
      .string()
      .min(1, "Please enter a title")
      .min(10, "Title must be at least 10 characters")
      .max(150, "Title must not exceed 150 characters")
  );

export const fieldSchema = z
  .string()
  .min(1, "Please select a field")
  .refine(
    (v) =>
      CONTENT_FIELD_OPTIONS.includes(
        v as (typeof CONTENT_FIELD_OPTIONS)[number]
      ),
    "Please select a field"
  );

export const tagsSchema = z
  .array(z.string().trim().min(1).max(30))
  .min(1, "Please add at least one tag")
  .max(5, "Maximum 5 tags allowed")
  .default([]);

export const descriptionSchema = z
  .string()
  .transform((s) => s.trim())
  .pipe(
    z
      .string()
      .min(1, "Please enter a description")
      .min(20, "Description must be at least 20 characters")
      .max(2000, "Description is too long")
  );

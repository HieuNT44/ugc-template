export const CONTENT_FIELD_OPTIONS = [
  "Technology",
  "Business",
  "Science",
  "Health",
  "Education",
  "Culture",
  "Finance",
  "Design",
  "Marketing",
  "Lifestyle",
] as const;

export type ContentField = (typeof CONTENT_FIELD_OPTIONS)[number];

import type { ValidationErrorDetail } from "../types/envelope";

/** Maps BE validation `details[]` to react-hook-form / ActionState field errors. */
export function mapValidationErrorsToFields(
  details: ValidationErrorDetail[] | undefined
): Record<string, string[]> {
  if (!details?.length) {
    return {};
  }

  const errors: Record<string, string[]> = {};

  for (const detail of details) {
    const field = detail.field;
    if (!errors[field]) {
      errors[field] = [];
    }
    errors[field].push(detail.message);
  }

  return errors;
}

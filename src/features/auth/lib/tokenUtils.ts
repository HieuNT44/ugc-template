export function decodeOobCodeFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("oobCode");
  } catch {
    return null;
  }
}

export function isValidOobCode(
  code: string | null | undefined
): code is string {
  return typeof code === "string" && code.length > 0;
}

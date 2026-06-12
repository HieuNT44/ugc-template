/** Strips HTML tags for plain-text word counting. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text: string): number {
  const plain = text.includes("<") ? stripHtml(text) : text;
  if (!plain.trim()) {
    return 0;
  }
  return plain.trim().split(/\s+/).filter(Boolean).length;
}

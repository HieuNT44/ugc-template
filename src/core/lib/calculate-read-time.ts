export function calculateReadTime(text: string): number {
  const wordsCount = text.trim().split(/\s+/).length;
  const wordsPerMinute = 200;

  return Math.ceil(wordsCount / wordsPerMinute);
}

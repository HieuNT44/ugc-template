import type { ArticleBlock, ArticleTocItem } from "../types/article-block";

export function slugifyHeading(text: string, fallbackIndex: number): string {
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized.length > 0 ? normalized : `section-${fallbackIndex}`;
}

export function extractTocItems(blocks: ArticleBlock[]): ArticleTocItem[] {
  return blocks
    .filter((block): block is Extract<ArticleBlock, { type: "heading" }> => {
      return block.type === "heading";
    })
    .map((block) => ({
      id: block.id,
      text: block.text,
      level: block.level,
    }));
}

export function getBlockPlainText(block: ArticleBlock): string {
  switch (block.type) {
    case "paragraph":
    case "callout":
      return block.text;
    case "heading":
      return block.text;
    case "image":
      return block.alt ?? "";
    case "list":
      return block.items.join(" ");
    case "code":
      return block.code;
    case "richtext":
      return block.html.replace(/<[^>]+>/g, " ");
    default:
      return "";
  }
}

export function paragraphsToBlocks(paragraphs: string[]): ArticleBlock[] {
  return paragraphs.map((text) => ({ type: "paragraph", text }));
}

export function createHeading(
  level: 2 | 3 | 4,
  text: string,
  index: number
): Extract<ArticleBlock, { type: "heading" }> {
  return {
    type: "heading",
    level,
    text,
    id: slugifyHeading(text, index),
  };
}

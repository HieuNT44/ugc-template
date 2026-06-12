import { createHeading } from "./article-block-utils";
import type { ArticleBlock, ArticleHeadingLevel } from "../types/article-block";

function isBlockStart(line: string): boolean {
  return (
    line.startsWith("#") ||
    line.startsWith("```") ||
    line.startsWith("> ") ||
    /^-\s+/.test(line) ||
    /^\d+\.\s+/.test(line)
  );
}

function parseHeadingLevel(marker: string): ArticleHeadingLevel | null {
  const length = marker.length;
  if (length === 2 || length === 3 || length === 4) {
    return length;
  }
  return null;
}

/** Converts a subset of Markdown into article blocks for rendering and TOC. */
export function markdownToBlocks(markdown: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let index = 0;
  let headingIndex = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";

    if (line.startsWith("```")) {
      const language = line.slice(3).trim() || "text";
      index += 1;
      const codeLines: string[] = [];

      while (index < lines.length && !(lines[index] ?? "").startsWith("```")) {
        codeLines.push(lines[index] ?? "");
        index += 1;
      }

      blocks.push({
        type: "code",
        language,
        code: codeLines.join("\n"),
      });
      index += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{2,4})\s+(.+)$/);
    if (headingMatch?.[1] && headingMatch[2]) {
      const level = parseHeadingLevel(headingMatch[1]);
      if (level) {
        headingIndex += 1;
        blocks.push(createHeading(level, headingMatch[2].trim(), headingIndex));
      }
      index += 1;
      continue;
    }

    // Skip H1 — article title is rendered in the page header.
    if (/^#\s+/.test(line) && !line.startsWith("##")) {
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (index < lines.length && (lines[index] ?? "").startsWith("> ")) {
        quoteLines.push((lines[index] ?? "").slice(2));
        index += 1;
      }
      blocks.push({ type: "callout", text: quoteLines.join(" ") });
      continue;
    }

    if (/^-\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^-\s+/.test(lines[index] ?? "")) {
        items.push((lines[index] ?? "").replace(/^-\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index] ?? "")) {
        items.push((lines[index] ?? "").replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "list", items, ordered: true });
      continue;
    }

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      (lines[index] ?? "").trim() !== "" &&
      !isBlockStart(lines[index] ?? "")
    ) {
      paragraphLines.push(lines[index] ?? "");
      index += 1;
    }

    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return blocks;
}

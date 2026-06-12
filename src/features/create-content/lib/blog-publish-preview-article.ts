import { calculateReadTime } from "@/core/lib/calculate-read-time";
import { buildPostSlug } from "@/core/lib/post-slug";
import type { ApiProfile } from "@/core/api/types";
import type { PostLabel } from "@/core/types/post-label";
import {
  createHeading,
  getBlockPlainText,
} from "@/features/reading/lib/article-block-utils";
import { markdownToBlocks } from "@/features/reading/lib/parse-markdown-to-blocks";
import type {
  ArticleBlock,
  ArticleHeadingLevel,
} from "@/features/reading/types/article-block";
import type { PostArticle } from "@/features/reading/types/post-article";

import { stripHtml } from "./word-count";

export type BlogDraftPreviewInput = {
  title: string;
  shortDescription?: string;
  content: string;
  editorMode: "wysiwyg" | "markdown";
  coverPreviewUrl?: string | null;
  draftId?: string | null;
  showHumanWrittenBadge?: boolean;
  pricingType?: "free" | "paid";
  priceYen?: number | null;
  authorProfile?: ApiProfile | null;
};

function getPreviewPublishedAt(): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function getProfileUsername(profile: ApiProfile): string {
  const username = profile.username?.trim();
  if (username) {
    return username;
  }

  const fullName = profile.full_name?.trim().replace(/\s+/g, "");
  if (fullName) {
    return fullName;
  }

  return "realread-creator";
}

function htmlToPreviewMarkdown(html: string): string {
  return html
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n\n## $1\n\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n\n## $1\n\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n\n### $1\n\n")
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n\n#### $1\n\n")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1")
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "\n\n> $1\n\n")
    .replace(/<\/(p|div|section|article)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function decodeHtmlText(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtmlTags(value: string): string {
  return decodeHtmlText(value.replace(/<[^>]*>/g, " "));
}

function sanitizeInlineHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\shref=(["'])javascript:[\s\S]*?\1/gi, "")
    .replace(/<(?!\/?(?:strong|b|em|i|u|s|code|a|br)\b)[^>]*>/gi, "")
    .replace(/<a\b([^>]*)>/gi, (match, attributes: string) => {
      const hrefMatch = attributes.match(/\shref=(["'])(.*?)\1/i);
      const href = hrefMatch?.[2] ?? "";

      if (!href || href.toLowerCase().startsWith("javascript:")) {
        return "";
      }

      return `<a href="${href}" target="_blank" rel="noopener noreferrer">`;
    });
}

function parseListItems(innerHtml: string): string[] {
  return Array.from(innerHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
    .map((match) => stripHtmlTags(match[1] ?? ""))
    .filter(Boolean);
}

function getHtmlAttribute(attributes: string, name: string): string | null {
  const match = attributes.match(new RegExp(`\\s${name}=([\"'])(.*?)\\1`, "i"));
  return match?.[2] ?? null;
}

function wysiwygHtmlToBlocks(html: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  let headingIndex = 0;
  const blockMatches = html.matchAll(
    /<(h[1-4]|p|blockquote|pre|ul|ol)[^>]*>([\s\S]*?)<\/\1>|<img\b([^>]*)>/gi
  );

  for (const match of blockMatches) {
    const tag = match[1]?.toLowerCase();
    const innerHtml = match[2] ?? "";

    if (!tag) {
      const attributes = match[3] ?? "";
      const src = getHtmlAttribute(attributes, "src");
      if (src) {
        blocks.push({
          type: "image",
          src,
          alt: getHtmlAttribute(attributes, "alt") ?? "",
        });
      }

      continue;
    }

    if (tag.startsWith("h")) {
      const rawLevel = Number(tag.replace("h", ""));
      const level = Math.min(Math.max(rawLevel, 2), 4) as ArticleHeadingLevel;
      const text = stripHtmlTags(innerHtml);
      if (text) {
        headingIndex += 1;
        blocks.push(createHeading(level, text, headingIndex));
      }
      continue;
    }

    if (tag === "p") {
      const text = stripHtmlTags(innerHtml);
      if (text) {
        blocks.push({
          type: "paragraph",
          text,
          html: sanitizeInlineHtml(innerHtml),
        });
      }
      continue;
    }

    if (tag === "blockquote") {
      const text = stripHtmlTags(innerHtml);
      if (text) {
        blocks.push({ type: "callout", text });
      }
      continue;
    }

    if (tag === "pre") {
      const code = stripHtmlTags(innerHtml);
      if (code) {
        blocks.push({ type: "code", language: "text", code });
      }
      continue;
    }

    if (tag === "ul" || tag === "ol") {
      const items = parseListItems(innerHtml);
      if (items.length > 0) {
        blocks.push({ type: "list", items, ordered: tag === "ol" });
      }
    }
  }

  return blocks;
}

function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`~[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildBlogPublishPreviewLabels(options: {
  showHumanWrittenBadge: boolean;
  pricingType: "free" | "paid";
  priceYen?: number | null;
}): PostLabel[] {
  const labels: PostLabel[] = [];

  if (options.pricingType === "paid" && options.priceYen) {
    labels.push({
      type: "paid",
      amountCents: options.priceYen * 100,
      currency: "JPY",
    });
  }

  if (options.showHumanWrittenBadge) {
    labels.push({ type: "human_written" });
  }

  return labels;
}

export function buildBlogPublishPreviewArticle(
  input: BlogDraftPreviewInput
): PostArticle {
  const markdown =
    input.editorMode === "wysiwyg"
      ? htmlToPreviewMarkdown(input.content)
      : input.content.trim();
  const blocks =
    input.editorMode === "wysiwyg"
      ? wysiwygHtmlToBlocks(input.content)
      : markdownToBlocks(markdown);
  const plainText =
    blocks.length > 0
      ? blocks.map(getBlockPlainText).join(" ")
      : input.editorMode === "wysiwyg"
        ? stripHtml(input.content)
        : markdownToPlainText(input.content);
  const trimmedPlainText = plainText.trim();
  const resolvedTitle = input.title.trim() || "Untitled draft";
  const resolvedShortDescription = input.shortDescription?.trim();
  const snippet = resolvedShortDescription ?? "";
  const previewId = input.draftId ?? "blog-preview";
  const profile = input.authorProfile;
  const profileUsername = profile ? getProfileUsername(profile) : null;
  const profileDisplayName =
    profile?.full_name?.trim() || profileUsername || "RealReadクリエイター";
  const hasProfileAuthor = Boolean(profile);

  return {
    id: previewId,
    slug: buildPostSlug(resolvedTitle, previewId),
    markdown,
    blocks,
    author: {
      username: profileUsername ?? "realread-creator",
      avatarUrl: profile?.avatar_url ?? "",
    },
    authorDisplayName: profileDisplayName,
    authorSubtitle: hasProfileAuthor ? null : "Draft preview",
    publishedAt: getPreviewPublishedAt(),
    title: resolvedTitle,
    snippet,
    coverImageUrl: input.coverPreviewUrl,
    likeCount: 154,
    commentCount: 118,
    repostCount: 12,
    labels: buildBlogPublishPreviewLabels({
      showHumanWrittenBadge: input.showHumanWrittenBadge ?? false,
      pricingType: input.pricingType ?? "free",
      priceYen: input.priceYen,
    }),
    readTimeMinutes: calculateReadTime(trimmedPlainText),
  };
}

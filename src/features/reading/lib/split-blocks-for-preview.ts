import { PAID_PREVIEW_RATIO } from "../types/post-article";
import type { ArticleBlock } from "../types/article-block";
import { getBlockPlainText } from "./article-block-utils";

export function splitBlocksForPreview(
  blocks: ArticleBlock[],
  previewRatio = PAID_PREVIEW_RATIO
): { visible: ArticleBlock[]; hidden: ArticleBlock[] } {
  if (blocks.length === 0) {
    return { visible: [], hidden: [] };
  }

  const totalChars = blocks.reduce(
    (sum, block) => sum + getBlockPlainText(block).length,
    0
  );
  const targetChars = Math.max(1, Math.floor(totalChars * previewRatio));

  if (blocks.length === 1) {
    const [only] = blocks;
    if (!only) {
      return { visible: [], hidden: [] };
    }

    const plain = getBlockPlainText(only);
    const splitAt = Math.min(
      plain.length,
      Math.max(targetChars, Math.floor(plain.length * previewRatio))
    );

    if (only.type === "paragraph" && plain.length > splitAt) {
      return {
        visible: [{ type: "paragraph", text: plain.slice(0, splitAt) }],
        hidden: [{ type: "paragraph", text: plain.slice(splitAt) }],
      };
    }

    return { visible: [only], hidden: [] };
  }

  let accumulated = 0;
  let splitIndex = 1;

  for (let i = 0; i < blocks.length; i++) {
    accumulated += getBlockPlainText(blocks[i]!).length;
    if (accumulated >= targetChars) {
      splitIndex = i + 1;
      break;
    }
    splitIndex = i + 1;
  }

  const visibleCount = Math.min(Math.max(1, splitIndex), blocks.length - 1);

  return {
    visible: blocks.slice(0, visibleCount),
    hidden: blocks.slice(visibleCount),
  };
}

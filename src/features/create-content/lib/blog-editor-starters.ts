import type { EditorMode } from "../types/content-type";

export const BLOG_MARKDOWN_STARTER = `Welcome to your article draft. Replace this outline with your own story.

## Why this topic matters

Explain the problem your readers face and why they should care.

## Key takeaways

- One clear insight readers can apply today
- A second practical tip
- A short recap of what you will cover

## Main section

Write your main argument here. Use **bold** for emphasis and \`code\` for technical terms.

> A short quote or callout can highlight an important idea.

\`\`\`javascript
const draft = "ready to publish";
console.log(draft);
\`\`\`

## Next steps

Wrap up with a concise summary and invite readers to try your suggestions.
`;

export const BLOG_WYSIWYG_STARTER = `<p>Welcome to your article draft. Replace this outline with your own story.</p><h2>Why this topic matters</h2><p>Explain the problem your readers face and why they should care.</p><h2>Key takeaways</h2><ul><li><p>One clear insight readers can apply today</p></li><li><p>A second practical tip</p></li><li><p>A short recap of what you will cover</p></li></ul><h2>Main section</h2><p>Write your main argument here. Use <strong>bold</strong> for emphasis and <code>code</code> for technical terms.</p><blockquote><p>A short quote or callout can highlight an important idea.</p></blockquote><pre><code>const draft = "ready to publish";
console.log(draft);</code></pre><h2>Next steps</h2><p>Wrap up with a concise summary and invite readers to try your suggestions.</p>`;

const STARTERS: Record<EditorMode, string> = {
  markdown: BLOG_MARKDOWN_STARTER,
  wysiwyg: BLOG_WYSIWYG_STARTER,
};

export function getBlogStarterContent(mode: EditorMode): string {
  return STARTERS[mode];
}

export function isBlogContentEmpty(content: string): boolean {
  return !content.trim();
}

export function shouldApplyBlogStarter(
  content: string,
  previousMode: EditorMode
): boolean {
  if (isBlogContentEmpty(content)) {
    return true;
  }

  return content === getBlogStarterContent(previousMode);
}

export function resolveBlogEditorContent(
  content: string,
  mode: EditorMode
): string {
  return isBlogContentEmpty(content) ? getBlogStarterContent(mode) : content;
}

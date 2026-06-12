import Image from "next/image";

import { cn } from "@/lib/utils";

import type { ArticleBlock } from "../types/article-block";

interface PostArticleContentProps {
  blocks: ArticleBlock[];
  className?: string;
  tone?: "default" | "book";
}

function ArticleCodeBlock({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  return (
    <figure className='PostArticleCode border-border my-6 overflow-hidden rounded-lg border'>
      <figcaption className='bg-muted text-muted-foreground border-border border-b px-4 py-2 text-xs font-medium tracking-wide uppercase'>
        {language}
      </figcaption>
      <pre className='overflow-x-auto bg-[#1E1E1E] p-4 text-sm leading-relaxed'>
        <code className='font-mono text-[#E6E6E6]'>{code}</code>
      </pre>
    </figure>
  );
}

function ArticleBlockItem({
  block,
  tone = "default",
}: {
  block: ArticleBlock;
  tone?: PostArticleContentProps["tone"];
}) {
  const bookTextClass = tone === "book" ? "text-[#2A2A2A]" : null;

  switch (block.type) {
    case "heading": {
      const Tag = block.level === 2 ? "h2" : block.level === 3 ? "h3" : "h4";

      return (
        <Tag
          id={block.id}
          className={cn(
            "text-foreground scroll-mt-24 font-semibold tracking-tight",
            block.level === 2 && "mt-10 mb-4 text-2xl first:mt-0",
            block.level === 3 && "mt-8 mb-3 text-xl",
            block.level === 4 && "mt-6 mb-2 text-lg"
          )}
        >
          {block.text}
        </Tag>
      );
    }
    case "paragraph":
      if (block.html) {
        return (
          <p
            className={cn(
              "text-foreground/90 mb-5 text-base leading-[1.85]",
              bookTextClass
            )}
            dangerouslySetInnerHTML={{ __html: block.html }}
          />
        );
      }

      return (
        <p
          className={cn(
            "text-foreground/90 mb-5 text-base leading-[1.85]",
            bookTextClass
          )}
        >
          {block.text}
        </p>
      );
    case "richtext":
      return (
        <div
          className={cn(
            "PostArticleRichtext text-foreground/90 [&_a]:text-primary [&_blockquote]:border-primary/30 [&_blockquote]:bg-primary/5 mb-5 text-base leading-[1.85] [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:py-3 [&_blockquote]:pl-4 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-[#1E1E1E] [&_pre]:p-4 [&_pre]:text-sm [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6",
            bookTextClass,
            tone === "book" && "[&_p]:text-[#2A2A2A]"
          )}
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );
    case "callout":
      return (
        <p className='border-primary/30 bg-primary/5 text-foreground mb-5 rounded-r-md border-l-4 py-3 pl-4 text-base leading-[1.85]'>
          <span className='font-semibold'>Note: </span>
          {block.text}
        </p>
      );
    case "image":
      return (
        <figure className='PostArticleImage my-6 overflow-hidden rounded-lg'>
          <Image
            src={block.src}
            alt={block.alt ?? ""}
            width={1200}
            height={675}
            className='h-auto w-full rounded-lg object-cover'
          />
        </figure>
      );
    case "list":
      if (block.ordered) {
        return (
          <ol
            className={cn(
              "text-foreground/90 mb-5 ml-6 list-decimal space-y-2 text-base leading-[1.85]",
              bookTextClass
            )}
          >
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        );
      }

      return (
        <ul
          className={cn(
            "text-foreground/90 mb-5 ml-6 list-disc space-y-2 text-base leading-[1.85]",
            bookTextClass
          )}
        >
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "code":
      return <ArticleCodeBlock language={block.language} code={block.code} />;
    default:
      return null;
  }
}

function getBlockKey(block: ArticleBlock, index: number): string {
  if (block.type === "heading") {
    return block.id;
  }
  if (block.type === "code") {
    return `${index}-${block.code.slice(0, 24)}`;
  }
  if (block.type === "image") {
    return `${index}-${block.src}`;
  }
  if (block.type === "list") {
    return `${index}-${block.items[0] ?? "list"}`;
  }
  if (block.type === "richtext") {
    return `${index}-${block.html.slice(0, 24)}`;
  }
  return `${index}-${block.text.slice(0, 24)}`;
}

export function PostArticleContent({
  blocks,
  className,
  tone = "default",
}: PostArticleContentProps) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className={cn("PostArticleContent", className)}>
      {blocks.map((block, index) => (
        <ArticleBlockItem
          key={getBlockKey(block, index)}
          block={block}
          tone={tone}
        />
      ))}
    </div>
  );
}

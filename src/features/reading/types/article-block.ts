export type ArticleHeadingLevel = 2 | 3 | 4;

export type ArticleBlock =
  | { type: "paragraph"; text: string; html?: string }
  | { type: "richtext"; html: string }
  | { type: "heading"; level: ArticleHeadingLevel; text: string; id: string }
  | { type: "image"; src: string; alt?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "code"; language: string; code: string }
  | { type: "callout"; text: string };

export type ArticleTocItem = {
  id: string;
  text: string;
  level: ArticleHeadingLevel;
};

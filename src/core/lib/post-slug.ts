/** SEO slug: `{title-slug}-{id}` e.g. `why-clean-architecture-matters-feed-1` */
export function buildPostSlug(title: string, id: string): string {
  const normalized = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const trimmed = normalized.slice(0, 80).replace(/-+$/, "");
  const base = trimmed.length > 0 ? trimmed : "post";

  return `${base}-${id}`;
}

const UUID_SUFFIX_PATTERN =
  /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

export function extractPostIdFromSlug(slug: string): string | null {
  const uuidMatch = slug.match(UUID_SUFFIX_PATTERN);
  if (uuidMatch?.[1]) {
    return uuidMatch[1].toLowerCase();
  }

  const lastHyphen = slug.lastIndexOf("-");
  if (lastHyphen <= 0 || lastHyphen === slug.length - 1) {
    return null;
  }

  return slug.slice(lastHyphen + 1) || null;
}

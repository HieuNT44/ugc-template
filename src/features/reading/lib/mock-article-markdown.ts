/** Mock article bodies as Markdown until Reading API exists. */
export const MOCK_ARTICLE_MARKDOWN_BY_ID: Record<string, string> = {
  "feed-1": `# Why clean architecture matters

When teams adopt the Next.js App Router, the first question is rarely about syntax. It is about where logic lives — on the server, on the client, or in shared modules that both sides can trust.

> Clean architecture here does not mean dozens of folders. It means boundaries that match how data flows without over-engineering your repository layout.

## Server and client boundaries

Start with a simple rule: if a module touches the DOM or browser APIs, it belongs on the client. If it reads secrets, talks to the database, or shapes HTML for SEO, keep it on the server.

- Server components fetch and render static or dynamic HTML.
- Client components handle interaction, animation, and browser state.
- Shared modules hold pure logic both sides can import safely.

## Feature folders that scale

Feature folders help when they group UI, hooks, and server actions for one user-facing capability. Avoid splitting the same feature across root-level folders without a clear owner.

### Validate at the boundary

Server Actions are powerful, but they are not a replacement for a domain layer. Validate inputs with Zod at the boundary, then call small functions that encode business rules you can test without React.

\`\`\`typescript
export const createPostSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1),
});

export async function createPostAction(input: unknown) {
  const data = createPostSchema.parse(input);
  return postRepository.create(data);
}
\`\`\`

### Cache with intent

Caching is part of architecture. Tag your fetches, document invalidation paths, and prefer explicit revalidation over hoping \`cache: 'no-store'\` everywhere will scale.

## Testing and observability

Testing follows the same seams. Unit-test pure functions and schema validation. Integration-test server actions with mocked repositories.

Observability matters early. Log structured errors at action boundaries, surface user-safe messages in the UI, and keep developer details in server logs only.

## Conclusion

The goal is not perfection on day one. It is a structure that lets you add paid posts, profiles, and admin tools without rewiring every import.`,
  "feed-2": `# Monetizing long-form content in 2026

Independent writers entered 2026 with more distribution options than ever — and more pressure to convert attention into revenue without feeling salesy.

## Why previews matter

Paid posts work when the preview earns trust. Readers accept a paywall after they have seen your voice, your rigor, and a fair sample of the argument.

## Product formats

Bundles reward depth. A three-part series priced below the sum of singles nudges loyal readers toward commitment while keeping single-story purchases available.

Memberships shift the relationship from transaction to habit. The best programs combine early access, community touchpoints, and occasional free stories that remain discoverable in the open feed.

### Pricing anchors

Pricing psychology still favors simple anchors: $3, $5, $9. Fractions of a cent in display erode trust. Show the currency clearly and avoid surprise fees at checkout.

### Platform transparency

Platform fees are part of the story. Creators who explain net earnings build long-term trust, especially when comparing RealRead to ad-supported models with volatile RPMs.

## Discovery vs monetization

Discovery and monetization pull in opposite directions unless you design for both. Keep SEO-friendly URLs, readable previews, and structured metadata even when content is partially gated.

## Analytics that convert

Analytics should answer one question first: which previews convert. Time-on-preview-page beats vanity metrics when you are tuning length and blur placement.

## Conclusion

The writers who sustain revenue in 2026 treat each paid story as a product: positioned, previewed, priced, and measured — not as a blog post with a lock icon pasted on.`,
  "feed-3": `# Performance tuning for React Server Components

React Server Components change performance work from bundle-size whack-a-mole to data-flow design. The checklist starts where the request enters your app.

## Eliminate waterfalls

Eliminate request waterfalls on the server. Parallelize independent fetches with \`Promise.all\` in layouts and pages instead of chaining awaits through nested components.

## Client boundaries

Audit \`'use client'\` boundaries weekly during active development. Every boundary is a potential bundle split — justify it with interactivity that cannot run on the server.

Prefer composition over prop drilling for shared server data. Pass serializable props to client leaves rather than fetching again on the client unless you need live updates.

### Assets budget

Images and fonts deserve explicit budgets. Use \`next/image\` sizes that match layout, subset fonts, and avoid loading entire icon packs for three glyphs.

### Cache with intent

Cache with intent. Static segments, tagged revalidation, and short-lived dynamic sections should be documented in the README so the next contributor does not cargo-cult \`force-dynamic\`.

## Measure real pages

Measure Core Web Vitals on real pages — home feed, article detail, and checkout — not only marketing landers. LCP on long-form reading pages often traces to hero images or web fonts.

## Ship checklist

Before ship, run this list aloud in standup. If any item gets a shrug, fix it or ticket it. Performance regressions compound silently in content apps.`,
  "feed-4": `# The comeback of thoughtful reading

Feeds optimized for speed trained us to skim. The backlash is not nostalgia — it is fatigue with content that ends before it begins to think.

## Completion over clicks

Thoughtful reading returns when platforms reward completion, not just clicks. Time spent after the halfway point is a healthier signal than rage-scroll depth.

## Typography and pace

Typography matters again. Comfortable measure, generous line-height, and readable body copy cue the brain to slow down.

Authors benefit from slower consumption when the work is dense. A five-minute essay that earns twelve minutes of attention outperforms a hot take forgotten in thirty seconds.

## Social discovery

Discovery can still be social without being frantic. Following graphs and curated topics beat algorithmic outrage if the default view respects chronological trust.

## Honest paywalls

Paywalls fail when previews lie — when the locked section is fluff. Honest partial views, like the first third of an argument, convert better and reduce refunds.

## Conclusion

The comeback of thoughtful reading is not anti-technology. It is pro-intent — tools that protect focus long enough for an idea to finish its sentence.`,
  "feed-5": `# Firebase Auth patterns in production

Production apps rarely use Firebase Auth alone. They combine identity providers, Firestore profiles, and often NextAuth sessions for middleware-friendly route protection.

## Single source of truth

Pick a single source of truth for the signed-in user record. Duplicating display names in JWT claims and Firestore without a sync strategy guarantees drift.

Custom tokens bridge Firebase client SDK and server sessions when you need both. Document the exchange path and expire tokens aggressively.

### Security rules in repo

Security rules belong in code review, not only in the Firebase console. Export rules to the repo and test them against representative reads and writes.

### Idempotent profiles

Profile creation should be idempotent on first login. Use a transaction or batched write so two parallel sign-ups do not split one user across two documents.

## Role upgrades

NextAuth callbacks are the seam for role upgrades — reader to creator, creator to staff. Keep role mutation in server actions audited and validated.

Never trust client-side role flags for authorization. Middleware and server components must re-fetch role from Firestore or a signed session updated on the server.

## Conclusion

When Firebase and NextAuth coexist, draw a diagram before adding features. Future you will thank present you during the first 2 a.m. lockout incident.`,
  "feed-6": `# Designing paywalls readers trust

Readers do not hate paywalls. They hate feeling tricked — hidden prices, abrupt cuts, or previews that summarize the whole story.

## Transparency first

Transparency starts above the fold: label paid stories clearly, show price in context, and explain what unlocks before the reader invests attention.

## Preview depth

Preview length should follow content shape. A narrative essay might show the setup; a tutorial might show the problem statement and outline but lock the steps.

Visual blur is a cue, not a barrier. Pair blur with a calm gradient and a single primary action. Multiple competing CTAs reduce conversion on mobile.

### Social proof

Social proof helps when it is specific. "この記事を購入した240人の読者に加わりましょう" beats generic subscriber counts if the number is truthful and updated.

### Accessibility

Accessibility applies to paywalls too. Blurred content should be aria-hidden; unlock buttons need clear labels; do not trap keyboard focus in modals.

## Conclusion

Trust compounds. Readers who once unlocked a fairly previewed story return with lower friction the next time — that is the UX moat independent platforms can win.`,
};

export const DEFAULT_ARTICLE_MARKDOWN = `# Story coming soon

This story is not available yet. Check back soon for the full article.`;

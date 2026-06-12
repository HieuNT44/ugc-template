export type BlogTemplatePreviewSection = {
  title: string;
  lineCount?: number;
};

export type BlogTemplate = {
  id: string;
  name: string;
  description: string;
  content: string;
  previewSections: BlogTemplatePreviewSection[];
};

export const TEMPLATE_PAGE_SIZE = 8;

function sectionsToMarkdown(sections: BlogTemplatePreviewSection[]): string {
  return sections
    .map(
      (section) =>
        `## ${section.title}\n\nWrite your ${section.title.toLowerCase()} here.`
    )
    .join("\n\n");
}

export const BLOG_TEMPLATES: BlogTemplate[] = [
  {
    id: "blank",
    name: "Blank",
    description: "Start from scratch with an empty editor.",
    content: "",
    previewSections: [
      { title: "Title", lineCount: 1 },
      { title: "Body", lineCount: 3 },
    ],
  },
  {
    id: "how-to",
    name: "How-to guide",
    description: "Step-by-step tutorial structure.",
    content:
      "## Introduction\n\nExplain what readers will learn.\n\n## Step 1\n\nDescribe the first step.\n\n## Step 2\n\nDescribe the second step.\n\n## Conclusion\n\nSummarize key takeaways.",
    previewSections: [
      { title: "Introduction", lineCount: 2 },
      { title: "Step 1", lineCount: 2 },
      { title: "Step 2", lineCount: 2 },
      { title: "Conclusion", lineCount: 1 },
    ],
  },
  {
    id: "opinion",
    name: "Opinion piece",
    description: "Share your perspective on a topic.",
    content:
      "## Hook\n\nOpen with a compelling statement.\n\n## Context\n\nProvide background.\n\n## Argument\n\nMake your case with evidence.\n\n## Closing\n\nEnd with a call to action or reflection.",
    previewSections: [
      { title: "Hook", lineCount: 2 },
      { title: "Context", lineCount: 2 },
      { title: "Argument", lineCount: 2 },
      { title: "Closing", lineCount: 1 },
    ],
  },
  {
    id: "case-study",
    name: "Case study",
    description: "Problem, approach, and results.",
    content:
      "## Overview\n\nBrief summary of the project.\n\n## Challenge\n\nWhat problem needed solving?\n\n## Solution\n\nHow did you approach it?\n\n## Results\n\nWhat outcomes did you achieve?",
    previewSections: [
      { title: "Overview", lineCount: 2 },
      { title: "Challenge", lineCount: 2 },
      { title: "Solution", lineCount: 2 },
      { title: "Results", lineCount: 1 },
    ],
  },
  {
    id: "listicle",
    name: "Listicle",
    description: "Numbered tips, tools, or ideas.",
    previewSections: [
      { title: "Introduction", lineCount: 2 },
      { title: "Item 1", lineCount: 2 },
      { title: "Item 2", lineCount: 2 },
      { title: "Wrap-up", lineCount: 1 },
    ],
    content: "",
  },
  {
    id: "interview",
    name: "Interview",
    description: "Q&A format with a subject matter expert.",
    previewSections: [
      { title: "Guest intro", lineCount: 2 },
      { title: "Question 1", lineCount: 2 },
      { title: "Question 2", lineCount: 2 },
      { title: "Takeaways", lineCount: 1 },
    ],
    content: "",
  },
  {
    id: "product-review",
    name: "Product review",
    description: "Hands-on review with pros and cons.",
    previewSections: [
      { title: "First impressions", lineCount: 2 },
      { title: "Pros", lineCount: 2 },
      { title: "Cons", lineCount: 2 },
      { title: "Verdict", lineCount: 1 },
    ],
    content: "",
  },
  {
    id: "travel-diary",
    name: "Travel diary",
    description: "Capture a trip with scenes and reflections.",
    previewSections: [
      { title: "Destination", lineCount: 2 },
      { title: "Highlights", lineCount: 2 },
      { title: "Local tips", lineCount: 2 },
      { title: "Final thoughts", lineCount: 1 },
    ],
    content: "",
  },
  {
    id: "research-summary",
    name: "Research summary",
    description: "Distill findings for a general audience.",
    previewSections: [
      { title: "Abstract", lineCount: 2 },
      { title: "Key findings", lineCount: 2 },
      { title: "Implications", lineCount: 2 },
      { title: "References", lineCount: 1 },
    ],
    content: "",
  },
  {
    id: "newsletter",
    name: "Newsletter",
    description: "Curated updates with links and commentary.",
    previewSections: [
      { title: "Opening note", lineCount: 2 },
      { title: "Story 1", lineCount: 2 },
      { title: "Story 2", lineCount: 2 },
      { title: "Sign-off", lineCount: 1 },
    ],
    content: "",
  },
  {
    id: "personal-essay",
    name: "Personal essay",
    description: "Reflective narrative with a clear arc.",
    previewSections: [
      { title: "Opening scene", lineCount: 2 },
      { title: "Turning point", lineCount: 2 },
      { title: "Reflection", lineCount: 2 },
      { title: "Closing", lineCount: 1 },
    ],
    content: "",
  },
  {
    id: "technical-deep-dive",
    name: "Technical deep dive",
    description: "Architecture, trade-offs, and implementation notes.",
    previewSections: [
      { title: "Problem statement", lineCount: 2 },
      { title: "Approach", lineCount: 2 },
      { title: "Trade-offs", lineCount: 2 },
      { title: "Conclusion", lineCount: 1 },
    ],
    content: "",
  },
  {
    id: "faq-article",
    name: "FAQ article",
    description: "Answer common questions in a scannable format.",
    previewSections: [
      { title: "Overview", lineCount: 2 },
      { title: "FAQ 1", lineCount: 2 },
      { title: "FAQ 2", lineCount: 2 },
      { title: "FAQ 3", lineCount: 1 },
    ],
    content: "",
  },
  {
    id: "comparison-guide",
    name: "Comparison guide",
    description: "Compare options side by side.",
    previewSections: [
      { title: "Criteria", lineCount: 2 },
      { title: "Option A", lineCount: 2 },
      { title: "Option B", lineCount: 2 },
      { title: "Recommendation", lineCount: 1 },
    ],
    content: "",
  },
  {
    id: "year-in-review",
    name: "Year in review",
    description: "Recap milestones, lessons, and goals ahead.",
    previewSections: [
      { title: "Highlights", lineCount: 2 },
      { title: "Lessons learned", lineCount: 2 },
      { title: "Challenges", lineCount: 2 },
      { title: "Looking ahead", lineCount: 1 },
    ],
    content: "",
  },
  {
    id: "book-notes",
    name: "Book notes",
    description: "Summarize key ideas from a book you read.",
    previewSections: [
      { title: "Why I read it", lineCount: 2 },
      { title: "Big ideas", lineCount: 2 },
      { title: "Favorite quotes", lineCount: 2 },
      { title: "Apply it", lineCount: 1 },
    ],
    content: "",
  },
  {
    id: "startup-story",
    name: "Startup story",
    description: "Share the journey behind building a product.",
    previewSections: [
      { title: "Origin", lineCount: 2 },
      { title: "Early days", lineCount: 2 },
      { title: "Growth", lineCount: 2 },
      { title: "What's next", lineCount: 1 },
    ],
    content: "",
  },
  {
    id: "event-recap",
    name: "Event recap",
    description: "Summarize talks, demos, and networking highlights.",
    previewSections: [
      { title: "Event overview", lineCount: 2 },
      { title: "Key sessions", lineCount: 2 },
      { title: "Demos", lineCount: 2 },
      { title: "Follow-ups", lineCount: 1 },
    ],
    content: "",
  },
  {
    id: "career-advice",
    name: "Career advice",
    description: "Actionable guidance for professional growth.",
    previewSections: [
      { title: "Context", lineCount: 2 },
      { title: "Advice 1", lineCount: 2 },
      { title: "Advice 2", lineCount: 2 },
      { title: "Action plan", lineCount: 1 },
    ],
    content: "",
  },
  {
    id: "industry-trends",
    name: "Industry trends",
    description: "Analyze emerging patterns in your field.",
    previewSections: [
      { title: "Market snapshot", lineCount: 2 },
      { title: "Trend 1", lineCount: 2 },
      { title: "Trend 2", lineCount: 2 },
      { title: "Outlook", lineCount: 1 },
    ],
    content: "",
  },
].map((template) => ({
  ...template,
  content:
    template.id === "blank"
      ? ""
      : template.content || sectionsToMarkdown(template.previewSections),
}));

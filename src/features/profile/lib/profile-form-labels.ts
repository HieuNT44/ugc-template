import type { AppLanguage } from "@/core/api/types/enums";

const LABELS = {
  en: {
    name: "Name",
    username: "Username",
    headline: "Headline",
    bio: "Bio",
    industry: "Industry / experience level",
    location: "Location",
    website: "Website URL",
    skills: "Skills",
    skillsHint: (max: number) => `Up to ${max} skills`,
    addSkill: "Add skill",
    removeSkill: "Remove skill",
    socialLinks: "Social links",
    linkedinUrl: "LinkedIn URL",
    githubUrl: "GitHub URL",
    xUrl: "X (Twitter) URL",
    facebookUrl: "Facebook URL",
    lineUrl: "LINE URL",
    youtubeUrl: "YouTube URL",
  },
  ja: {
    name: "名前",
    username: "ユーザー名",
    headline: "ヘッドライン",
    bio: "自己紹介",
    industry: "業界・経験レベル",
    location: "所在地",
    website: "ウェブサイト URL",
    skills: "スキル",
    skillsHint: (max: number) => `最大 ${max} 件まで`,
    addSkill: "スキルを追加",
    removeSkill: "スキルを削除",
    socialLinks: "ソーシャルリンク",
    linkedinUrl: "LinkedIn URL",
    githubUrl: "GitHub URL",
    xUrl: "X (Twitter) URL",
    facebookUrl: "Facebook URL",
    lineUrl: "LINE URL",
    youtubeUrl: "YouTube URL",
  },
} as const;

const PLACEHOLDERS = {
  en: {
    name: "e.g. Nguyen Van A",
    username: "e.g. hieunguyen",
    headline: "e.g. Senior Frontend Engineer at Acme",
    bio: "e.g. I write about React, design systems, and building products.",
    industry: "e.g. Software Engineering · Senior",
    location: "e.g. Tokyo, Japan",
    website: "e.g. https://example.com",
    skill: "e.g. TypeScript",
    linkedinUrl: "e.g. https://linkedin.com/in/username",
    githubUrl: "e.g. https://github.com/username",
    xUrl: "e.g. https://x.com/username",
    facebookUrl: "e.g. https://facebook.com/username",
    lineUrl: "e.g. https://line.me/ti/p/username",
    youtubeUrl: "e.g. https://youtube.com/@channel",
  },
  ja: {
    name: "例：山田 太郎",
    username: "例：tanaka_taro",
    headline: "例：シニアフロントエンドエンジニア",
    bio: "例：React やデザインシステム、プロダクト開発について書いています。",
    industry: "例：ソフトウェア開発 · シニア",
    location: "例：東京都",
    website: "例：https://example.com",
    skill: "例：TypeScript",
    linkedinUrl: "例：https://linkedin.com/in/username",
    githubUrl: "例：https://github.com/username",
    xUrl: "例：https://x.com/username",
    facebookUrl: "例：https://facebook.com/username",
    lineUrl: "例：https://line.me/ti/p/username",
    youtubeUrl: "例：https://youtube.com/@channel",
  },
} as const;

export type ProfileFormLabelKey = keyof Omit<
  (typeof LABELS)["en"],
  "skillsHint"
>;

export type ProfileFormPlaceholderKey = keyof (typeof PLACEHOLDERS)["en"];

export function getProfileFormLabel(
  key: ProfileFormLabelKey,
  language: AppLanguage = "en"
): string {
  return LABELS[language][key] ?? LABELS.en[key];
}

export function getProfileFormSkillsHint(
  max: number,
  language: AppLanguage = "en"
): string {
  return LABELS[language].skillsHint(max);
}

export function getProfileFormPlaceholder(
  key: ProfileFormPlaceholderKey,
  language: AppLanguage = "en"
): string {
  return PLACEHOLDERS[language][key] ?? PLACEHOLDERS.en[key];
}

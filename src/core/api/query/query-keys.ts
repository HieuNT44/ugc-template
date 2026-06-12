export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  profile: {
    detail: () => ["profile", "detail"] as const,
    overview: () => ["profile", "overview"] as const,
    settings: () => ["profile", "settings"] as const,
    experiences: () => ["profile", "experiences"] as const,
    educations: () => ["profile", "educations"] as const,
    certifications: () => ["profile", "certifications"] as const,
    accomplishments: () => ["profile", "accomplishments"] as const,
  },
} as const;

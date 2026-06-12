/** Field constraints from BE api-db-mapping.md — use in Zod schemas when wiring endpoints. */
export const API_VALIDATION_LIMITS = {
  emailMaxLength: 255,
  passwordMinLength: 8,
  passwordMaxLength: 24,
  fullNameMaxLength: 100,
  usernameMaxLength: 50,
  headlineMaxLength: 120,
  bioMaxLength: 5000,
  /** UI limit for settings profile bio field */
  settingsProfileBioMaxLength: 600,
  industryMaxLength: 100,
  skillsMaxCount: 20,
  skillItemMaxLength: 50,
  urlMaxLength: 255,
} as const;

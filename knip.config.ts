import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // Entry files
  entry: ["src/app/**/*.{ts,tsx}"],

  // Project files to analyze
  project: ["src/**/*.{ts,tsx}"],

  // Ignore patterns
  ignore: [
    "src/components/ui/**", // ShadcnUI components (auto-generated)
    "**/*.d.ts",
    "**/*.test.{ts,tsx}",
    "**/*.spec.{ts,tsx}",
  ],

  // Ignore dependencies
  ignoreDependencies: [
    // Peer dependencies
    "react",
    "react-dom",
    // PostCSS plugins loaded by config
    "@tailwindcss/postcss",
    // Prettier plugins
    "prettier-plugin-tailwindcss",
    // Testing utilities
    "jsdom",
  ],

  // Ignore binaries
  ignoreBinaries: ["lefthook"],

  // Plugin configurations
  next: {
    entry: [
      "next.config.{js,ts,mjs}",
      "src/app/**/page.tsx",
      "src/app/**/layout.tsx",
      "src/app/**/loading.tsx",
      "src/app/**/error.tsx",
      "src/app/**/not-found.tsx",
      "src/app/api/**/route.ts",
    ],
  },

  tailwind: {
    config: ["tailwind.config.{js,ts}"],
  },

  eslint: {
    config: [".eslintrc.json", "eslint.config.{js,mjs}"],
  },

  typescript: {
    config: ["tsconfig.json"],
  },

  vitest: {
    config: ["vitest.config.ts"],
    entry: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
  },

  commitlint: {
    config: ["commitlint.config.ts"],
  },
};

export default config;

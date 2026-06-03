export default {
  // TypeScript/JavaScript files in source
  "src/**/*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],

  // JSON, Markdown, YAML
  "*.{json,md,yml,yaml}": ["prettier --write"],

  // CSS
  "*.css": ["prettier --write"],
};

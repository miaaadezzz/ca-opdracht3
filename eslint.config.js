import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig({
  files: ["**/*.{js,mjs,cjs}"],
  languageOptions: {
    globals: globals.browser,
  },
  plugins: {
    js,
  },
  extends: ["js/recommended"],
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off", // Console statements zijn nu toegestaan
  },
});

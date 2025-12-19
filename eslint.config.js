import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx,js}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierConfig,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      prettier: prettierPlugin,
      "@tanstack/query": pluginQuery,
    },
    rules: {
      "prettier/prettier": "error",
      "@tanstack/query/exhaustive-deps": "error",
      "@tanstack/query/no-rest-destructuring": "warn",
      "@tanstack/query/infinite-query-property-order": "warn",
      "@tanstack/query/no-void-query-fn": "error",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
]);

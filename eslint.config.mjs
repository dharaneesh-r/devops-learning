import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },

    plugins: {
      js,
    },

    extends: ["js/recommended"],

    rules: {
      /* Disallow console.log */
      "no-console": ["error", { allow: ["warn", "error"] }],

      /* Best practices */
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],
    },
  },
]);

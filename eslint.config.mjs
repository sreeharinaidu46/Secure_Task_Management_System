import nx from "@nx/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],

  {
    ignores: ["**/dist", "**/node_modules"],
  },

  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.base.json'],   // 👈 This points ESLint to your root tsconfig
        tsconfigRootDir: new URL('.', import.meta.url).pathname,  // 👈 Resolves the absolute root
      },
    },
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: ["^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"],
          depConstraints: [
            {
              sourceTag: "*",
              onlyDependOnLibsWithTags: ["*"],
            },
          ],
        },
      ],
    },
  },

  {
    files: [
      "**/*.ts",
      "**/*.tsx",
      "**/*.cts",
      "**/*.mts",
      "**/*.js",
      "**/*.jsx",
      "**/*.cjs",
      "**/*.mjs",
    ],
    rules: {},
  },
];

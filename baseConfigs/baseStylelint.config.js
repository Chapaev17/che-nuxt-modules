/* eslint-disable unicorn/no-null */

const atRuleNoUnknown = [
  true,
  {
    ignoreAtRules: [
      "each",
      "mixin",
      "use",
      "function",
      "debug",
      "include",
      "tailwind",
    ],
  },
]
// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  extends: ["stylelint-config-standard"], // "stylelint-config-prettier"],
  plugins: ["stylelint-order"],
  rules: {
    "unit-no-unknown": null,
    "order/properties-alphabetical-order": null,
    "at-rule-no-unknown": atRuleNoUnknown,
    // linebreaks: "unix",
  },
  ignoreFiles: [
    ".min.css",
    "dist/",
    "node_modules",
    "src/assets/css/fonts.css",
  ],
  overrides: [
    {
      files: ["*.css", "**/*.css"],
    },
    {
      files: ["*.scss", "**/*.scss"],
      customSyntax: "postcss-scss",
      extends: ["stylelint-config-standard-scss"],
      rules: {
        "at-rule-no-unknown": null,
        "scss/at-rule-no-unknown": atRuleNoUnknown,
      },
    },
    {
      files: ["*.vue", "**/*.vue", "*.tsx", "**/*.tsx"],
      customSyntax: "@stylelint/postcss-css-in-js",
    },
    {
      files: ["*.vue", "**/*.vue"],
      customSyntax: "postcss-html",
      extends: [
        "stylelint-config-standard-scss",
        "stylelint-config-recommended-vue/scss",
      ],
    },
  ],
}
/* eslint-enable unicorn/no-null */

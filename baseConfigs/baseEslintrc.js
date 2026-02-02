// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
    parser: "@typescript-eslint/parser",
  },
  extends: [
    /** More */
    "plugin:regexp/all", // Regulars
    "plugin:optimize-regex/all", // Regulars
    "plugin:lodash/recommended", // Makes you use lodash
    "plugin:promise/recommended", // Promises
    "plugin:import/recommended", // Import
    "plugin:import/typescript", // Typescript import
    "plugin:eslint-comments/recommended", // Eslint comments

    /** Packs */
    "airbnb-base",
    "plugin:sonarjs/recommended",
    "plugin:unicorn/all",
    "google",
    "prettier", // Prettier

    /** Security */
    "plugin:no-unsanitized/DOM",
    // "plugin:security/recommended",
    "plugin:jsonc/base",

    /** Core nuxt */
    "plugin:jsx-a11y/strict", // Jsx
    "plugin:@typescript-eslint/recommended",
    "plugin:nuxt/recommended",
    "plugin:vue/vue3-recommended",
  ],
  plugins: [
    /** Security */
    "no-secrets",
    "xss",
    "react",
    "@typescript-eslint",
  ],
  ignorePatterns: ["static/sw.js", "node_modules", ".nuxt", "dist"],
  settings: {
    "import/resolver": {
      typescript: true,
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", "vue"],
      },
    },
  },
  rules: {
    // # On.
    // ## Standart eslint.
    // Line end format
    "linebreak-style": ["error", "unix"],
    // Comma at the end of the line
    "comma-dangle": ["warn", "always-multiline"],
    "eol-last": "warn",
    quotes: ["error", "double", { avoidEscape: true }],
    "no-duplicate-imports": "error",
    // Acces console debug, coze nuxt delete them in build.
    "no-console": ["warn", { allow: ["debug", "error", "warn"] }],
    camelcase: "warn",
    // ## Security.
    "no-secrets/no-secrets": "error",
    "xss/no-mixed-html": "error",
    "xss/no-location-href-assign": "error",
    // ## Other
    // All old files wrote wrong.
    "unicorn/filename-case": [
      "error",
      {
        cases: {
          kebabCase: true,
          camelCase: true,
          snakeCase: true,
          pascalCase: true,
        },
      },
    ],

    // # Off.
    // Use v-html.
    "vue/no-v-html": "off",
    // Dont use lodash instead of default js function.
    "lodash/prefer-lodash-method": "off",
    // Not write jsdoc comments.
    "require-jsdoc": "off",
    "valid-jsdoc": "off",
    // He get clear text without space and enlines.
    "unicorn/prefer-dom-node-text-content": "off",
    /** Acces get value by dinamic key. Need control, what
    key was't got from user input.
    */
    "security/detect-object-injection": "off",
    // Fix wrong work no-shadow in ts.
    "no-shadow": "off",
    // Need for correct work no-shadow too.
    "@typescript-eslint/no-shadow": "error",
    // Dont use file format in import.
    "import/extensions": "off",
    // Delete leter.
    "vue/multi-word-component-names": "off",
    // Build with no use variables.
    "import/no-extraneous-dependencies": "off",
    "no-restricted-syntax": "off",
    "import/prefer-default-export": "off",
    "no-undef": "off",
    // Conflict with typescript and maybe slow.
    "unicorn/prefer-json-parse-buffer": "off",

    // # Change level.
    "unicorn/consistent-function-scoping": "warn",
    // Order
    "react/jsx-sort-props": "warn",
    // Change error to wart. This most build in dev with this.
    "@typescript-eslint/no-unused-vars": "warn",

    // # For vue template
    // "max-len": [
    //   "warn",
    //   {
    //     code: 79,
    //     ignoreUrls: true,
    //     ignoreStrings: true,
    //   },
    // ],
    "max-len": "off",
    // Acces long strings in template.
    "vue/max-len": "off",
    "vue/html-self-closing": [
      "error",
      {
        html: { normal: "always", void: "always" },
        svg: "always",
        math: "always",
      },
    ],
    // Prettier confilict with this rule in self closed
    // tags.
    // "vue/html-closing-bracket-newline": [
    //   "error",
    //   {
    //     singleline: "never",
    //     multiline: "always",
    //     selfClosingTag: {
    //       singleline: "never",
    //       multiline: "never",
    //     },
    //   },
    // ],
    // Dont need default props if require is true
    "vue/require-default-prop": "off",
    "vue/max-attributes-per-line": [
      2,
      {
        singleline: 20,
        multiline: {
          max: 2,
        },
      },
    ],
    "vue/singleline-html-element-content-newline": "off",
  },
}

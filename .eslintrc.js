module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["airbnb-base", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  rules: {
    quotes: "off",
    "import/prefer-default-export": "off",
    "import/no-unresolved": "off",
    camelcase: "off",
  },
  settings: {
    "import/resolver": {
      // Use <root>/tsconfig.json
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};

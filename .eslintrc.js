module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb-base",
    "react-app",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    quotes: "off",
    "import/prefer-default-export": "off",
    "import/no-unresolved": "off",
    camelcase: "off",
    "import/extensions": "off",
    "no-nested-ternary": "off",
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

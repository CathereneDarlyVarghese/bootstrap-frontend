module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb-base", // Use 'airbnb' if you're using React
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    // Add your custom rules and overrides here
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

const { off } = require('process');

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base',
    'react-app',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    quotes: 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    camelcase: 'off',
    'import/extensions': 'off',
    'no-nested-ternary': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'max-len': 'off',
    'no-trailing-spaces': 'off',
  },
  settings: {
    'import/resolver': {
      // Use <root>/tsconfig.json
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};

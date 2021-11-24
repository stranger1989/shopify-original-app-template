module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:shopify/react',
    'plugin:shopify/polaris',
    'plugin:shopify/jest',
    'plugin:shopify/webpack',
    'plugin:shopify/esnext',
    'plugin:shopify/typescript',
    'plugin:shopify/prettier',
    'prettier',
  ],
  rules: {
    'import/no-unresolved': 0,
    'no-process-env': 0,
    'babel/object-curly-spacing': 0,
    'require-atomic-updates': 0,
    '@typescript-eslint/camelcase': 0,
    'no-console': 1,
    'no-alert': 1,
    '@typescript-eslint/no-explicit-any': 1,
  },
  overrides: [
    {
      files: ['*.test.*'],
      rules: {
        'shopify/jsx-no-hardcoded-content': 'off',
      },
    },
  ],
};

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
    'import/no-unresolved': 'off',
    'no-console': 'warn',
    'no-alert': 'warn',
    'no-process-env': 'off',
    'babel/object-curly-spacing': 'off',
    '@typescript-eslint/camelcase': 'off',
    'require-atomic-updates': 'off',
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

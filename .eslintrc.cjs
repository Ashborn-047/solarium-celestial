module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'max-lines': [
      'error',
      { max: 200, skipBlankLines: false, skipComments: false },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_' },
    ],
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'legacy/',
    'graphify-out/',
    'scripts/',
    'docs/',
    '*.config.*',
    '*.cjs',
  ],
};

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['build/', 'node_modules/'],
  },

  // Enable the recommended ESLint rules for JavaScript
  eslint.configs.recommended,

  // Enable the recommended ESLint rules for TypeScript
  ...tseslint.configs.recommended,

  // Specific configuration for TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error', // Ensure that promises are handled properly to avoid unhandled rejections

      '@typescript-eslint/no-explicit-any': 'error', // Ensure type safety by preventing the use of 'any'

      'no-console': 'warn', // Emit a warning to avoid forgotten console.logs in production
    },
  },

  // Enable Prettier to automatically format code and avoid conflicts with ESLint rules
  eslintConfigPrettier,
);

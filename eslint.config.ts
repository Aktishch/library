import tsPlugin from '@typescript-eslint/eslint-plugin'
import prettierPlugin from 'eslint-plugin-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { Config, defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

module.exports = defineConfig([
  {
    ignores: ['node_modules/'],
  },
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'import/order': 'off',
      '@typescript-eslint/no-explicit-any': ['off'],
      '@typescript-eslint/member-ordering': 0,
      '@typescript-eslint/naming-convention': 0,
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
    },
  },
  eslintPluginPrettierRecommended,
  tseslint.configs.recommended,
]) as Config

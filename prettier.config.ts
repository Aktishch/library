import type { Config } from 'prettier'

export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  printWidth: 120,
  tabWidth: 2,
  endOfLine: 'auto',
  bracketSpacing: true,
  overrides: [
    {
      files: '**/*.json',
      options: {
        parser: 'json'
      }
    }
  ]
} satisfies Config

module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 120,
  tabWidth: 2,
  endOfLine: 'auto',
  bracketSpacing: true,
  overrides: [
    {
      files: '*.scss',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.html',
      options: {
        printWidth: 120,
      },
    },
  ],
}

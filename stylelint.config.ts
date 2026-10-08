import type { Config } from 'stylelint'

export default {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  plugins: ['stylelint-declaration-block-no-ignored-properties', 'stylelint-order', '@stylistic/stylelint-plugin'],
  rules: {
    'custom-property-pattern': null,
    'media-query-no-invalid': null,
    'no-descending-specificity': null,
    'rule-empty-line-before': null,
    'font-family-name-quotes': 'always-unless-keyword',
    'no-invalid-position-at-import-rule': null,
    'value-keyword-case': null,
    'alpha-value-notation': 'number',
    'color-function-notation': 'legacy',
    'media-feature-range-notation': 'prefix',
    'selector-class-pattern': null,
    'declaration-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-declaration', 'after-comment', 'inside-single-line-block']
      }
    ],
    'plugin/declaration-block-no-ignored-properties': true,
    'import-notation': 'string',
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'theme',
          'utility',
          'apply',
          'layer',
          'config',
          'import',
          'source',
          'variant',
          'custom-variant'
        ]
      }
    ],
    'at-rule-prelude-no-invalid': [
      true,
      {
        ignoreAtRules: ['apply']
      }
    ],
    '@stylistic/declaration-colon-space-after': null,
    '@stylistic/declaration-colon-space-before': null
  }
} satisfies Config

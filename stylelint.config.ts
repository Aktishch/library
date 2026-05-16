import type { Config } from 'stylelint'

export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
  plugins: ['stylelint-declaration-block-no-ignored-properties', 'stylelint-order', '@stylistic/stylelint-plugin'],
  rules: {
    'no-descending-specificity': null,
    'rule-empty-line-before': null,
    'font-family-name-quotes': 'always-unless-keyword',
    'no-invalid-position-at-import-rule': null,
    'value-keyword-case': null,
    'alpha-value-notation': 'number',
    'color-function-notation': 'legacy',
    'media-feature-range-notation': 'prefix',
    'declaration-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-declaration', 'after-comment', 'inside-single-line-block']
      }
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['vertical', 'horizontal', 'decrement', 'increment', 'start', 'end', 'theme']
      }
    ],
    'plugin/declaration-block-no-ignored-properties': true,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer', 'config']
      }
    ],
    'scss/at-mixin-argumentless-call-parentheses': 'always',
    'scss/at-rule-conditional-no-parentheses': null,
    'scss/declaration-nested-properties': null,
    '@stylistic/declaration-colon-space-after': null,
    '@stylistic/declaration-colon-space-before': null
  }
} satisfies Config

// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['**/*.ts', '**/*.tsx'],
  rules: {
    'no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error'
  }
})

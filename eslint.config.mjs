// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    }
  },
  {
    files: ['app/components/ui/input/Input.vue'],
    rules: {
      'vue/html-self-closing': 'off'
    }
  }
)

import type { StorybookConfig } from '@storybook-vue/nuxt'

const config: StorybookConfig = {
  stories: [
    '../app/**/*.mdx',
    '../app/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  framework: {
    name: '@storybook-vue/nuxt',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  }
}

export default config

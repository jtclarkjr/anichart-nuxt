# Storybook for Nuxt

This project uses the official `@nuxtjs/storybook` module for component development and documentation.

## Running Storybook

Start the Storybook development server:

```bash
bun run storybook
```

Storybook will be available at `http://localhost:6006`

## Building Storybook

To build a static version of Storybook:

```bash
bun run build-storybook
```

## Story Files

Story files are located alongside your components in the `app/` directory with the `.stories.ts` extension.

### Example Story Files Created:

- `app/components/ui/button/Button.stories.ts`
- `app/components/ui/badge/Badge.stories.ts`
- `app/components/ui/card/Card.stories.ts`
- `app/components/ui/input/Input.stories.ts`

## Writing New Stories

Create a `.stories.ts` file next to your component:

```typescript
import type { Meta, StoryObj } from '@storybook/vue3'
import MyComponent from './MyComponent.vue'

const meta: Meta<typeof MyComponent> = {
  title: 'UI/MyComponent',
  component: MyComponent,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { MyComponent },
    template: '<MyComponent />'
  })
}
```

## Features

- Full Nuxt integration with auto-imports and composables
- Tailwind CSS styling
- Auto-generated documentation
- Hot module replacement
- Dark mode support

## Configuration

The Storybook configuration is in:
- `.storybook/main.ts` - Main configuration
- `.storybook/preview.ts` - Preview settings
- `nuxt.config.ts` - Nuxt-specific Storybook settings

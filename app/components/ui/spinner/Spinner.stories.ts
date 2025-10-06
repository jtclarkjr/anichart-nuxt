import type { Meta, StoryObj } from '@storybook/vue3'
import Spinner from './Spinner.vue'

const meta: Meta<typeof Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Spinner },
    template: '<Spinner />'
  })
}

export const Small: Story = {
  render: () => ({
    components: { Spinner },
    template: '<Spinner class="size-3" />'
  })
}

export const Medium: Story = {
  render: () => ({
    components: { Spinner },
    template: '<Spinner class="size-6" />'
  })
}

export const Large: Story = {
  render: () => ({
    components: { Spinner },
    template: '<Spinner class="size-12" />'
  })
}

export const WithText: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex items-center gap-2">
        <Spinner />
        <span>Loading...</span>
      </div>
    `
  })
}

export const Centered: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex min-h-96 items-center justify-center">
        <Spinner class="size-8" />
      </div>
    `
  })
}

export const InButton: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <button class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        <Spinner class="size-4" />
        Loading...
      </button>
    `
  })
}

export const LoadingStates: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="space-y-6">
        <div>
          <h4 class="mb-2 text-sm font-medium">Inline Loading</h4>
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner class="size-4" />
            <span>Fetching anime data...</span>
          </div>
        </div>
        <div>
          <h4 class="mb-2 text-sm font-medium">Card Loading</h4>
          <div class="w-80 rounded-lg border bg-card p-8">
            <div class="flex flex-col items-center justify-center space-y-4">
              <Spinner class="size-8" />
              <p class="text-sm text-muted-foreground">Loading content...</p>
            </div>
          </div>
        </div>
        <div>
          <h4 class="mb-2 text-sm font-medium">Button Loading States</h4>
          <div class="flex gap-2">
            <button disabled class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-50">
              <Spinner class="size-4" />
              Submitting
            </button>
            <button disabled class="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium opacity-50">
              <Spinner class="size-4" />
              Processing
            </button>
          </div>
        </div>
      </div>
    `
  })
}

export const AllSizes: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <Spinner class="size-3" />
          <span class="text-xs text-muted-foreground">Small</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Spinner class="size-4" />
          <span class="text-xs text-muted-foreground">Default</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Spinner class="size-6" />
          <span class="text-xs text-muted-foreground">Medium</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Spinner class="size-8" />
          <span class="text-xs text-muted-foreground">Large</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Spinner class="size-12" />
          <span class="text-xs text-muted-foreground">XL</span>
        </div>
      </div>
    `
  })
}

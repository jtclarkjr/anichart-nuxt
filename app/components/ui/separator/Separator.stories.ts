import type { Meta, StoryObj } from '@storybook/vue3'
import Separator from './Separator.vue'

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical']
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div class="space-y-4">
        <div>
          <h4 class="text-sm font-medium">Section 1</h4>
          <p class="text-sm text-muted-foreground">Content for the first section</p>
        </div>
        <Separator />
        <div>
          <h4 class="text-sm font-medium">Section 2</h4>
          <p class="text-sm text-muted-foreground">Content for the second section</p>
        </div>
      </div>
    `
  })
}

export const Vertical: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div class="flex h-24 items-center space-x-4">
        <div>
          <h4 class="text-sm font-medium">Item 1</h4>
        </div>
        <Separator orientation="vertical" />
        <div>
          <h4 class="text-sm font-medium">Item 2</h4>
        </div>
        <Separator orientation="vertical" />
        <div>
          <h4 class="text-sm font-medium">Item 3</h4>
        </div>
      </div>
    `
  })
}

export const InCard: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div class="w-96 rounded-lg border bg-card p-6">
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold">Anime Details</h3>
            <p class="text-sm text-muted-foreground">Information about the anime</p>
          </div>
          <Separator />
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-muted-foreground">Status:</span>
              <span class="text-sm font-medium">Ongoing</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-muted-foreground">Episodes:</span>
              <span class="text-sm font-medium">12</span>
            </div>
          </div>
          <Separator />
          <div>
            <p class="text-sm">Additional information goes here</p>
          </div>
        </div>
      </div>
    `
  })
}

export const WithCustomSpacing: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div class="space-y-8">
        <div>
          <h4 class="text-sm font-medium">First Section</h4>
          <p class="text-sm text-muted-foreground">Some content here</p>
        </div>
        <Separator class="my-8" />
        <div>
          <h4 class="text-sm font-medium">Second Section</h4>
          <p class="text-sm text-muted-foreground">More content here</p>
        </div>
      </div>
    `
  })
}

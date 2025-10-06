import type { Meta, StoryObj } from '@storybook/vue3'
import Skeleton from './Skeleton.vue'

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Skeleton },
    template: '<Skeleton class="h-12 w-64" />'
  })
}

export const Circle: Story = {
  render: () => ({
    components: { Skeleton },
    template: '<Skeleton class="size-12 rounded-full" />'
  })
}

export const Card: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="w-80 space-y-3">
        <Skeleton class="h-48 w-full" />
        <div class="space-y-2">
          <Skeleton class="h-4 w-3/4" />
          <Skeleton class="h-4 w-1/2" />
        </div>
      </div>
    `
  })
}

export const AnimeCardSkeleton: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="w-64 space-y-3">
        <Skeleton class="h-96 w-full rounded-lg" />
        <Skeleton class="h-5 w-3/4" />
        <Skeleton class="h-4 w-1/2" />
        <div class="flex items-center gap-2">
          <Skeleton class="h-6 w-16 rounded-full" />
          <Skeleton class="h-6 w-16 rounded-full" />
          <Skeleton class="h-6 w-16 rounded-full" />
        </div>
      </div>
    `
  })
}

export const List: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="w-96 space-y-4">
        <div v-for="i in 5" :key="i" class="flex items-center space-x-4">
          <Skeleton class="size-12 rounded-full" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-3/4" />
          </div>
        </div>
      </div>
    `
  })
}

export const Grid: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="grid grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="space-y-3">
          <Skeleton class="h-32 w-full" />
          <Skeleton class="h-4 w-3/4" />
          <Skeleton class="h-4 w-1/2" />
        </div>
      </div>
    `
  })
}

export const Profile: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="w-96 space-y-6">
        <div class="flex items-center space-x-4">
          <Skeleton class="size-20 rounded-full" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-5 w-32" />
            <Skeleton class="h-4 w-24" />
          </div>
        </div>
        <div class="space-y-2">
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-3/4" />
        </div>
      </div>
    `
  })
}

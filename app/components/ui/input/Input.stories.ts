import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import Input from './Input.vue'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const value = ref('')
      return { value }
    },
    template: '<Input v-model="value" placeholder="Enter text..." />'
  })
}

export const WithDefaultValue: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const value = ref('Default value')
      return { value }
    },
    template: '<Input v-model="value" />'
  })
}

export const Disabled: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const value = ref('Disabled input')
      return { value }
    },
    template: '<Input v-model="value" disabled />'
  })
}

export const WithLabel: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="space-y-2">
        <label for="email" class="text-sm font-medium">Email</label>
        <Input id="email" v-model="value" type="email" placeholder="you@example.com" />
      </div>
    `
  })
}

export const SearchInput: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const search = ref('')
      return { search }
    },
    template: `
      <div class="space-y-2">
        <label for="search" class="text-sm font-medium">Search Anime</label>
        <Input id="search" v-model="search" placeholder="Search for anime..." />
      </div>
    `
  })
}

export const NumberInput: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const number = ref(0)
      return { number }
    },
    template: `
      <div class="space-y-2">
        <label for="episodes" class="text-sm font-medium">Number of Episodes</label>
        <Input id="episodes" v-model="number" type="number" />
      </div>
    `
  })
}

export const InputStates: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const normal = ref('')
      const error = ref('Invalid input')
      const disabled = ref('Disabled')
      return { normal, error, disabled }
    },
    template: `
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Normal</label>
          <Input v-model="normal" placeholder="Normal input" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Error</label>
          <Input v-model="error" aria-invalid="true" />
          <p class="text-sm text-destructive">This field has an error</p>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Disabled</label>
          <Input v-model="disabled" disabled />
        </div>
      </div>
    `
  })
}

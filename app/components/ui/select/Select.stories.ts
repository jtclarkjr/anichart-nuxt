import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import Select from './Select.vue'
import SelectContent from './SelectContent.vue'
import SelectGroup from './SelectGroup.vue'
import SelectItem from './SelectItem.vue'
import SelectLabel from './SelectLabel.vue'
import SelectTrigger from './SelectTrigger.vue'
import SelectValue from './SelectValue.vue'

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <Select v-model="value">
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
          <SelectItem value="mango">Mango</SelectItem>
        </SelectContent>
      </Select>
    `
  })
}

export const WithLabel: Story = {
  render: () => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="space-y-2">
        <label class="text-sm font-medium">Favorite Fruit</label>
        <Select v-model="value">
          <SelectTrigger class="w-64">
            <SelectValue placeholder="Choose your favorite" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
            <SelectItem value="grape">Grape</SelectItem>
          </SelectContent>
        </Select>
      </div>
    `
  })
}

export const WithGroups: Story = {
  render: () => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <Select v-model="value">
        <SelectTrigger class="w-64">
          <SelectValue placeholder="Select a genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Action</SelectLabel>
            <SelectItem value="shounen">Shounen</SelectItem>
            <SelectItem value="seinen">Seinen</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Drama</SelectLabel>
            <SelectItem value="romance">Romance</SelectItem>
            <SelectItem value="slice-of-life">Slice of Life</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Other</SelectLabel>
            <SelectItem value="comedy">Comedy</SelectItem>
            <SelectItem value="horror">Horror</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    `
  })
}

export const AnimeStatusSelect: Story = {
  render: () => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup() {
      const status = ref('watching')
      return { status }
    },
    template: `
      <div class="space-y-2">
        <label class="text-sm font-medium">Anime Status</label>
        <Select v-model="status">
          <SelectTrigger class="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="watching">Watching</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
            <SelectItem value="dropped">Dropped</SelectItem>
            <SelectItem value="plan-to-watch">Plan to Watch</SelectItem>
          </SelectContent>
        </Select>
        <p class="text-xs text-muted-foreground">Current status: {{ status }}</p>
      </div>
    `
  })
}

export const SeasonSelect: Story = {
  render: () => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel },
    setup() {
      const season = ref('')
      return { season }
    },
    template: `
      <Select v-model="season">
        <SelectTrigger class="w-56">
          <SelectValue placeholder="Select season" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>2024</SelectLabel>
            <SelectItem value="winter-2024">Winter 2024</SelectItem>
            <SelectItem value="spring-2024">Spring 2024</SelectItem>
            <SelectItem value="summer-2024">Summer 2024</SelectItem>
            <SelectItem value="fall-2024">Fall 2024</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>2023</SelectLabel>
            <SelectItem value="winter-2023">Winter 2023</SelectItem>
            <SelectItem value="spring-2023">Spring 2023</SelectItem>
            <SelectItem value="summer-2023">Summer 2023</SelectItem>
            <SelectItem value="fall-2023">Fall 2023</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    `
  })
}

export const SmallSize: Story = {
  render: () => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <Select v-model="value">
        <SelectTrigger class="w-40" size="sm">
          <SelectValue placeholder="Small select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
          <SelectItem value="3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    `
  })
}

export const Disabled: Story = {
  render: () => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup() {
      const value = ref('apple')
      return { value }
    },
    template: `
      <Select v-model="value" disabled>
        <SelectTrigger class="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    `
  })
}

export const MultipleSelects: Story = {
  render: () => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup() {
      const genre = ref('')
      const status = ref('')
      const year = ref('')
      return { genre, status, year }
    },
    template: `
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Genre</label>
          <Select v-model="genre">
            <SelectTrigger class="w-64">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="action">Action</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="drama">Drama</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium">Status</label>
          <Select v-model="status">
            <SelectTrigger class="w-64">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium">Year</label>
          <Select v-model="year">
            <SelectTrigger class="w-64">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    `
  })
}

export const InForm: Story = {
  render: () => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup() {
      const format = ref('')
      const genre = ref('')
      return { format, genre }
    },
    template: `
      <div class="w-96 rounded-lg border bg-card p-6">
        <h3 class="mb-4 text-lg font-semibold">Add Anime</h3>
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Format</label>
            <Select v-model="format">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Choose format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tv">TV</SelectItem>
                <SelectItem value="movie">Movie</SelectItem>
                <SelectItem value="ova">OVA</SelectItem>
                <SelectItem value="ona">ONA</SelectItem>
                <SelectItem value="special">Special</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-medium">Genre</label>
            <Select v-model="genre">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Choose genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="romance">Romance</SelectItem>
                <SelectItem value="comedy">Comedy</SelectItem>
                <SelectItem value="drama">Drama</SelectItem>
                <SelectItem value="fantasy">Fantasy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    `
  })
}

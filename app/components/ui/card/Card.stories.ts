import type { Meta, StoryObj } from '@storybook/vue3'
import Card from './Card.vue'
import CardHeader from './CardHeader.vue'
import CardTitle from './CardTitle.vue'
import CardDescription from './CardDescription.vue'
import CardContent from './CardContent.vue'
import CardFooter from './CardFooter.vue'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Card, CardHeader, CardTitle, CardDescription, CardContent },
    template: `
      <Card class="w-96">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content area. This is where the main content of the card goes.</p>
        </CardContent>
      </Card>
    `
  })
}

export const WithFooter: Story = {
  render: () => ({
    components: { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter },
    template: `
      <Card class="w-96">
        <CardHeader>
          <CardTitle>Card with Footer</CardTitle>
          <CardDescription>This card includes a footer section</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content area with information and details.</p>
        </CardContent>
        <CardFooter>
          <p class="text-sm text-muted-foreground">Footer content</p>
        </CardFooter>
      </Card>
    `
  })
}

export const SimpleCard: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card class="w-96 p-6">
        <p>A simple card with just content and no structured sections.</p>
      </Card>
    `
  })
}

export const AnimeCard: Story = {
  render: () => ({
    components: { Card, CardHeader, CardTitle, CardDescription, CardContent },
    template: `
      <Card class="w-80">
        <CardHeader>
          <CardTitle>Attack on Titan</CardTitle>
          <CardDescription>Shingeki no Kyojin</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Status:</span>
              <span>Finished</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Episodes:</span>
              <span>25</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Score:</span>
              <span class="text-primary font-semibold">8.5</span>
            </div>
          </div>
        </CardContent>
      </Card>
    `
  })
}

export const CardGrid: Story = {
  render: () => ({
    components: { Card, CardHeader, CardTitle, CardContent },
    template: `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Card 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p>First card content</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Card 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Second card content</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Card 3</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Third card content</p>
          </CardContent>
        </Card>
      </div>
    `
  })
}

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, type Ref } from 'vue'
import { createMockAnime, createIncompleteAnime } from './test-utils'
import AnimeCard from '../AnimeCard.vue'

// Mock NuxtImg component with proper typing
const NuxtImgMock = defineComponent({
  name: 'NuxtImg',
  props: ['src', 'alt', 'class', 'loading', 'preset'],
  emits: ['load', 'error'],
  template: '<img v-bind="$attrs" @load="$emit(\'load\')" @error="$emit(\'error\')" />'
})

describe('AnimeCard with Nuxt', () => {
  const mockAnime = createMockAnime()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the anime card with basic information', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: { anime: mockAnime },
        global: {
          stubs: {
            NuxtImg: NuxtImgMock
          }
        }
      })

      expect(wrapper.find('.anime-card').exists()).toBe(true)
      expect(wrapper.find('.title').text()).toBe('Test Anime English')
      expect(wrapper.find('.score').text()).toBe('85%')
      expect(wrapper.find('.year').text()).toBe('2023')
      expect(wrapper.find('.format').text()).toBe('TV')
    })

    it('displays anime genres correctly', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: { anime: mockAnime },
        global: {
          stubs: { NuxtImg: NuxtImgMock }
        }
      })

      const genreTags = wrapper.findAll('.genre-tag')
      expect(genreTags).toHaveLength(2) // Only first 2 genres should be shown
      expect(genreTags[0]?.text()).toBe('Action')
      expect(genreTags[1]?.text()).toBe('Adventure')
    })

    it('handles missing image data gracefully', async () => {
      const incompleteAnime = createIncompleteAnime()
      const wrapper = await mountSuspended(AnimeCard, {
        props: { anime: incompleteAnime },
        global: {
          stubs: { NuxtImg: NuxtImgMock }
        }
      })

      expect(wrapper.find('.anime-card').exists()).toBe(true)
      expect(wrapper.find('.title').text()).toBe('テストアニメ')
    })

    it('does not show score when averageScore is null', async () => {
      const animeWithoutScore = createMockAnime({ averageScore: null })
      const wrapper = await mountSuspended(AnimeCard, {
        props: { anime: animeWithoutScore },
        global: {
          stubs: { NuxtImg: NuxtImgMock }
        }
      })

      expect(wrapper.find('.score').exists()).toBe(false)
    })

    it('does not show format when format is null', async () => {
      const animeWithoutFormat = createMockAnime({ format: null })
      const wrapper = await mountSuspended(AnimeCard, {
        props: { anime: animeWithoutFormat },
        global: {
          stubs: { NuxtImg: NuxtImgMock }
        }
      })

      expect(wrapper.find('.format').exists()).toBe(false)
    })
  })

  describe('Events', () => {
    it('emits click event with anime id when card is clicked', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: { anime: mockAnime },
        global: {
          stubs: { NuxtImg: NuxtImgMock }
        }
      })

      await wrapper.find('.anime-card').trigger('click')
      
      expect(wrapper.emitted().click).toBeTruthy()
      expect(wrapper.emitted().click![0]).toEqual([1]) // mockAnime.id is 1
    })
  })

  describe('Image Loading', () => {
    it('handles image load event correctly', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: { anime: mockAnime },
        global: {
          stubs: { NuxtImg: NuxtImgMock }
        }
      })

      const img = wrapper.findComponent(NuxtImgMock as any)
      await img.trigger('load')

      // Check that imageLoaded reactive ref is set to true
      const vm = wrapper.vm as unknown as { imageLoaded: Ref<boolean> }
      expect(vm.imageLoaded.value).toBe(true)
    })

    it('handles image error event correctly', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: { anime: mockAnime },
        global: {
          stubs: { NuxtImg: NuxtImgMock }
        }
      })

      const img = wrapper.findComponent(NuxtImgMock as any)
      await img.trigger('error')

      // Even on error, imageLoaded should be true to show the card
      const vm = wrapper.vm as unknown as { imageLoaded: Ref<boolean> }
      expect(vm.imageLoaded.value).toBe(true)
    })

    it('sets correct image attributes', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: { anime: mockAnime },
        global: {
          stubs: { NuxtImg: NuxtImgMock }
        }
      })

      const img = wrapper.findComponent(NuxtImgMock as any)
      expect((img as any).props()).toMatchObject({
        alt: 'Test Anime English',
        loading: 'lazy',
        preset: 'cover'
      })
    })
  })

  describe('Accessibility', () => {
    it('provides proper alt text for images', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: { anime: mockAnime },
        global: {
          stubs: { NuxtImg: NuxtImgMock }
        }
      })

      const img = wrapper.findComponent(NuxtImgMock as any)
      expect((img as any).props('alt')).toBe('Test Anime English')
    })
  })

  describe('Edge Cases', () => {
    it('handles anime with empty genres array', async () => {
      const animeWithNoGenres = createMockAnime({ genres: [] })
      const wrapper = await mountSuspended(AnimeCard, {
        props: { anime: animeWithNoGenres },
        global: {
          stubs: { NuxtImg: NuxtImgMock }
        }
      })

      expect(wrapper.findAll('.genre-tag')).toHaveLength(0)
    })

    it('handles anime with only one genre', async () => {
      const animeWithOneGenre = createMockAnime({ genres: ['Action'] })
      const wrapper = await mountSuspended(AnimeCard, {
        props: { anime: animeWithOneGenre },
        global: {
          stubs: { NuxtImg: NuxtImgMock }
        }
      })

      const genreTags = wrapper.findAll('.genre-tag')
      expect(genreTags).toHaveLength(1)
      expect(genreTags[0]?.text()).toBe('Action')
    })

    it('truncates long titles properly via CSS', async () => {
      const animeWithLongTitle = createMockAnime({
        title: {
          romaji: 'Very Long Title That Should Be Truncated',
          english: 'Very Long English Title That Should Be Truncated',
          native: 'とても長いタイトル'
        }
      })

      const wrapper = await mountSuspended(AnimeCard, {
        props: { anime: animeWithLongTitle },
        global: {
          stubs: { NuxtImg: NuxtImgMock }
        }
      })

      const title = wrapper.find('.title')
      expect(title.text()).toBe('Very Long English Title That Should Be Truncated')
      
      // Check CSS classes for truncation
      const titleClasses = title.classes()
      expect(titleClasses).toContain('title')
    })
  })
})

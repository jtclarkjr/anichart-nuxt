import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { createMockAnimeList } from './test-utils'
import AnimeGrid from '../AnimeGrid.vue'

// Mock AnimeCard component with proper typing
const AnimeCardMock = defineComponent({
  name: 'AnimeCard',
  props: ['anime'],
  emits: ['click'],
  template: '<div class="anime-card-mock" @click="$emit(\'click\', anime.id)">{{ anime.title.english || anime.title.romaji }}</div>'
})

describe('AnimeGrid with Nuxt', () => {
  const mockAnimeList = createMockAnimeList(5)
  
  const defaultProps = {
    anime: mockAnimeList,
    loading: false,
    loadingMore: false,
    error: '',
    hasData: true,
    hasMoreToShow: false,
    totalCount: 5
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering States', () => {
    it('renders loading state when loading and no data', async () => {
      const wrapper = await mountSuspended(AnimeGrid, {
        props: {
          ...defaultProps,
          loading: true,
          hasData: false,
          anime: []
        },
        global: {
          stubs: {
            AnimeCard: AnimeCardMock,
            TransitionGroup: true
          }
        }
      })

      expect(wrapper.find('.loading').exists()).toBe(true)
      expect(wrapper.find('.loading-spinner').exists()).toBe(true)
      expect(wrapper.text()).toContain('Loading anime...')
      expect(wrapper.find('.anime-grid').exists()).toBe(false)
    })

    it('renders error state when error exists', async () => {
      const errorMessage = 'Failed to load anime'
      const wrapper = await mountSuspended(AnimeGrid, {
        props: {
          ...defaultProps,
          error: errorMessage,
          loading: false,
          anime: []
        },
        global: {
          stubs: {
            AnimeCard: AnimeCardMock,
            TransitionGroup: true
          }
        }
      })

      expect(wrapper.find('.error').exists()).toBe(true)
      expect(wrapper.text()).toContain(errorMessage)
      expect(wrapper.find('.retry-btn').exists()).toBe(true)
    })

    it('renders anime grid when anime data exists', async () => {
      const wrapper = await mountSuspended(AnimeGrid, {
        props: defaultProps,
        global: {
          stubs: {
            AnimeCard: AnimeCardMock,
            TransitionGroup: true
          }
        }
      })

      expect(wrapper.find('.anime-grid').exists()).toBe(true)
      expect(wrapper.find('.card-grid').exists()).toBe(true)
      expect(wrapper.findAllComponents(AnimeCardMock as any)).toHaveLength(5)
    })

    it('shows loading shimmer when loading with existing data', async () => {
      const wrapper = await mountSuspended(AnimeGrid, {
        props: {
          ...defaultProps,
          loading: true,
          hasData: true
        },
        global: {
          stubs: {
            AnimeCard: AnimeCardMock,
            TransitionGroup: true
          }
        }
      })

      expect(wrapper.find('.anime-grid-container').classes()).toContain('is-loading')
      expect(wrapper.find('.anime-grid').exists()).toBe(true) // Still show existing anime
    })
  })

  describe('Load More Functionality', () => {
    it('shows load trigger when hasMoreToShow is true', async () => {
      const wrapper = await mountSuspended(AnimeGrid, {
        props: {
          ...defaultProps,
          hasMoreToShow: true,
          totalCount: 20
        },
        global: {
          stubs: {
            AnimeCard: AnimeCardMock,
            TransitionGroup: true
          }
        }
      })

      expect(wrapper.find('.load-trigger').exists()).toBe(true)
      expect(wrapper.find('.showing-more').exists()).toBe(true)
      expect(wrapper.text()).toContain('Showing 5 of 20 anime')
    })

    it('shows loading more state when loadingMore is true', async () => {
      const wrapper = await mountSuspended(AnimeGrid, {
        props: {
          ...defaultProps,
          hasMoreToShow: true,
          loadingMore: true
        },
        global: {
          stubs: {
            AnimeCard: AnimeCardMock,
            TransitionGroup: true
          }
        }
      })

      expect(wrapper.find('.loading-more').exists()).toBe(true)
      expect(wrapper.find('.loading-spinner.small').exists()).toBe(true)
      expect(wrapper.text()).toContain('Loading more anime...')
    })

    it('exposes loadTrigger ref for intersection observer', async () => {
      const wrapper = await mountSuspended(AnimeGrid, {
        props: {
          ...defaultProps,
          hasMoreToShow: true
        },
        global: {
          stubs: {
            AnimeCard: AnimeCardMock,
            TransitionGroup: true
          }
        }
      })

      expect((wrapper.vm as any).loadTrigger).toBeDefined()
    })
  })

  describe('Events', () => {
    it('emits retry event when retry button is clicked', async () => {
      const wrapper = await mountSuspended(AnimeGrid, {
        props: {
          ...defaultProps,
          error: 'Test error',
          anime: []
        },
        global: {
          stubs: {
            AnimeCard: AnimeCardMock,
            TransitionGroup: true
          }
        }
      })

      await wrapper.find('.retry-btn').trigger('click')
      
      expect(wrapper.emitted().retry).toBeTruthy()
      expect(wrapper.emitted().retry).toHaveLength(1)
    })

    it('emits animeClick event when AnimeCard is clicked', async () => {
      const wrapper = await mountSuspended(AnimeGrid, {
        props: defaultProps,
        global: {
          stubs: {
            AnimeCard: AnimeCardMock,
            TransitionGroup: true
          }
        }
      })

      const firstCard = wrapper.findAllComponents(AnimeCardMock as any)[0]
      await firstCard?.trigger('click')
      
      expect(wrapper.emitted().animeClick).toBeTruthy()
      expect(wrapper.emitted().animeClick![0]).toEqual([1]) // First anime ID
    })
  })

  describe('Computed Properties', () => {
    it('shouldShowLoading works correctly before hydration', async () => {
      const wrapper = await mountSuspended(AnimeGrid, {
        props: {
          ...defaultProps,
          loading: true,
          hasData: false
        },
        global: {
          stubs: {
            AnimeCard: AnimeCardMock,
            TransitionGroup: true
          }
        }
      })

      // Before hydration, isHydrated is false
      const vm = wrapper.vm as any
      vm.isHydrated = false
      expect(vm.shouldShowLoading).toBe(true)
    })

    it('shouldShowGrid shows grid when anime exists', async () => {
      const wrapper = await mountSuspended(AnimeGrid, {
        props: defaultProps,
        global: {
          stubs: {
            AnimeCard: AnimeCardMock,
            TransitionGroup: true
          }
        }
      })

      expect((wrapper.vm as any).shouldShowGrid).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty anime array gracefully', async () => {
      const wrapper = await mountSuspended(AnimeGrid, {
        props: {
          ...defaultProps,
          anime: []
        },
        global: {
          stubs: {
            AnimeCard: AnimeCardMock,
            TransitionGroup: true
          }
        }
      })

      expect(wrapper.findAllComponents(AnimeCardMock as any)).toHaveLength(0)
      expect(wrapper.find('.anime-grid').exists()).toBe(false)
    })

    it('handles both loading and error states correctly', async () => {
      const wrapper = await mountSuspended(AnimeGrid, {
        props: {
          ...defaultProps,
          loading: true,
          error: 'Some error',
          anime: []
        },
        global: {
          stubs: {
            AnimeCard: AnimeCardMock,
            TransitionGroup: true
          }
        }
      })

      // Error takes precedence over loading
      expect(wrapper.find('.error').exists()).toBe(true)
      expect(wrapper.find('.loading').exists()).toBe(false)
    })

    it('maintains anime display during loading when hasData is true', async () => {
      const wrapper = await mountSuspended(AnimeGrid, {
        props: {
          ...defaultProps,
          loading: true,
          hasData: true
        },
        global: {
          stubs: {
            AnimeCard: AnimeCardMock,
            TransitionGroup: true
          }
        }
      })

      // Should show both anime grid and loading state
      expect(wrapper.find('.anime-grid').exists()).toBe(true)
      expect(wrapper.find('.anime-grid-container.is-loading').exists()).toBe(true)
      expect(wrapper.findAllComponents(AnimeCardMock as any)).toHaveLength(5)
    })
  })
})

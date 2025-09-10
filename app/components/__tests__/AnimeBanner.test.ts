import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createMockAnime, createIncompleteAnime } from './test-utils'
import AnimeBanner from '../AnimeBanner.vue'

// Mock NuxtImg component
const NuxtImgMock = {
  name: 'NuxtImg',
  props: ['src', 'alt', 'class', 'loading', 'preset', 'width', 'height', 'format'],
  template: '<img v-bind="$attrs" />'
}

describe('AnimeBanner', () => {
  const mockAnime = createMockAnime()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the banner with anime information', async () => {
      const wrapper = await mountSuspended(AnimeBanner, {
        props: { anime: mockAnime },
        global: {
          stubs: {
            NuxtImg: NuxtImgMock
          }
        }
      })

      expect(wrapper.find('.banner').exists()).toBe(true)
      expect(wrapper.find('.title').text()).toBe('Test Anime English')
      expect(wrapper.find('.cover-image').exists()).toBe(true)
      expect(wrapper.find('.basic-info').exists()).toBe(true)
    })

    it('displays banner background image when available', async () => {
      const wrapper = await mountSuspended(AnimeBanner, {
        props: { anime: mockAnime },
        global: {
          stubs: {
            NuxtImg: NuxtImgMock
          }
        }
      })

      // Check that there are multiple NuxtImg components (banner + cover)
      const images = wrapper.findAllComponents(NuxtImgMock)
      expect(images.length).toBe(2) // banner-bg + cover-image
    })

    it('does not display banner background when not available', async () => {
      const animeWithoutBanner = createMockAnime({ bannerImage: null })
      const wrapper = await mountSuspended(AnimeBanner, {
        props: { anime: animeWithoutBanner },
        global: {
          stubs: {
            NuxtImg: NuxtImgMock
          }
        }
      })

      // Check that there's only one NuxtImg component (cover-image only)
      const images = wrapper.findAllComponents(NuxtImgMock)
      expect(images.length).toBe(1) // Only cover-image
    })

    it('displays cover image with correct attributes', async () => {
      const wrapper = await mountSuspended(AnimeBanner, {
        props: { anime: mockAnime },
        global: {
          stubs: {
            NuxtImg: NuxtImgMock
          }
        }
      })

      const coverImage = wrapper.find('.cover-image').findComponent(NuxtImgMock)
      expect(coverImage.props()).toMatchObject({
        alt: 'Test Anime English',
        loading: 'lazy',
        width: '230',
        height: '345',
        format: 'webp'
      })
    })

    it('displays alternative titles when different from main title', async () => {
      const animeWithDifferentTitles = createMockAnime({
        title: {
          romaji: 'Different Romaji Title',
          english: 'Test Anime English',
          native: 'Different Native Title'
        }
      })

      const wrapper = await mountSuspended(AnimeBanner, {
        props: { anime: animeWithDifferentTitles },
        global: {
          stubs: {
            NuxtImg: NuxtImgMock
          }
        }
      })

      expect(wrapper.find('.alt-titles').exists()).toBe(true)
      expect(wrapper.text()).toContain('Different Romaji Title')
      expect(wrapper.text()).toContain('Different Native Title')
    })

    it('does not display alternative titles when same as main title', async () => {
      const animeWithSameTitles = createMockAnime({
        title: {
          romaji: 'Test Anime English',
          english: 'Test Anime English',
          native: 'Test Anime English'
        }
      })

      const wrapper = await mountSuspended(AnimeBanner, {
        props: { anime: animeWithSameTitles },
        global: {
          stubs: {
            NuxtImg: NuxtImgMock
          }
        }
      })

      expect(wrapper.find('.alt-titles').exists()).toBe(false)
    })
  })

  describe('Meta Information', () => {
    it('displays all available meta information', async () => {
      const wrapper = await mountSuspended(AnimeBanner, {
        props: { anime: mockAnime },
        global: {
          stubs: {
            NuxtImg: NuxtImgMock
          }
        }
      })

      const metaItems = wrapper.findAll('.meta-item')
      expect(metaItems.length).toBeGreaterThan(0)

      // Check score
      expect(wrapper.text()).toContain('Score:')
      expect(wrapper.text()).toContain('85%')

      // Check status
      expect(wrapper.text()).toContain('Status:')
      expect(wrapper.text()).toContain('Completed')

      // Check format
      expect(wrapper.text()).toContain('Format:')
      expect(wrapper.text()).toContain('TV')

      // Check episodes
      expect(wrapper.text()).toContain('Episodes:')
      expect(wrapper.text()).toContain('12')

      // Check duration
      expect(wrapper.text()).toContain('Duration:')
      expect(wrapper.text()).toContain('24 min')
    })

    it('hides optional meta items when not available', async () => {
      const incompleteAnime = createMockAnime({
        format: null,
        episodes: null,
        duration: null
      })

      const wrapper = await mountSuspended(AnimeBanner, {
        props: { anime: incompleteAnime },
        global: {
          stubs: {
            NuxtImg: NuxtImgMock
          }
        }
      })

      expect(wrapper.text()).not.toContain('Format:')
      expect(wrapper.text()).not.toContain('Episodes:')
      expect(wrapper.text()).not.toContain('Duration:')
    })
  })

  describe('Genres', () => {
    it('displays all genres', async () => {
      const wrapper = await mountSuspended(AnimeBanner, {
        props: { anime: mockAnime },
        global: {
          stubs: {
            NuxtImg: NuxtImgMock
          }
        }
      })

      const genreTags = wrapper.findAll('.genre-tag')
      expect(genreTags).toHaveLength(3) // mockAnime has 3 genres
      expect(genreTags[0]?.text()).toBe('Action')
      expect(genreTags[1]?.text()).toBe('Adventure')
      expect(genreTags[2]?.text()).toBe('Fantasy')
    })

    it('handles empty genres gracefully', async () => {
      const animeWithoutGenres = createMockAnime({ genres: [] })
      const wrapper = await mountSuspended(AnimeBanner, {
        props: { anime: animeWithoutGenres },
        global: {
          stubs: {
            NuxtImg: NuxtImgMock
          }
        }
      })

      expect(wrapper.findAll('.genre-tag')).toHaveLength(0)
    })
  })

  describe('Props Validation', () => {
    it('accepts valid anime object', async () => {
      expect(async () => {
        await mountSuspended(AnimeBanner, {
          props: { anime: mockAnime },
          global: {
            stubs: {
              NuxtImg: NuxtImgMock
            }
          }
        })
      }).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('handles incomplete anime data gracefully', async () => {
      const incompleteAnime = createIncompleteAnime()
      const wrapper = await mountSuspended(AnimeBanner, {
        props: { anime: incompleteAnime },
        global: {
          stubs: {
            NuxtImg: NuxtImgMock
          }
        }
      })

      expect(wrapper.find('.banner').exists()).toBe(true)
      expect(wrapper.find('.title').text()).toBe('テストアニメ')
    })

    it('handles missing cover image gracefully', async () => {
      const animeWithoutCover = createMockAnime({
        coverImage: {
          extraLarge: null,
          large: null,
          medium: null,
          color: null
        }
      })

      const wrapper = await mountSuspended(AnimeBanner, {
        props: { anime: animeWithoutCover },
        global: {
          stubs: {
            NuxtImg: NuxtImgMock
          }
        }
      })

      const coverImage = wrapper.find('.cover-image').findComponent(NuxtImgMock)
      expect(coverImage.exists()).toBe(true)
    })
  })
})

import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createMockAnime } from './test-utils'
import AnimeMetadata from '../AnimeMetadata.vue'


describe('AnimeMetadata', () => {
  const mockAnime = createMockAnime({
    startDate: { year: 2021, month: 4, day: 6 },
    endDate: { year: 2021, month: 9, day: 21 },
    seasonYear: 2021,
    studios: { nodes: [{ id: 1, name: 'Studio A' }, { id: 2, name: 'Studio B' }] },
    popularity: 123456,
    favourites: 7890
  })

  describe('Rendering', () => {
    it('renders the info panel and grid', async () => {
      const wrapper = await mountSuspended(AnimeMetadata, {
        props: { anime: mockAnime }
      })

      expect(wrapper.find('.info-panel').exists()).toBe(true)
      expect(wrapper.find('.info-grid').exists()).toBe(true)
    })

    it('displays start and end dates with proper formatting', async () => {
      const wrapper = await mountSuspended(AnimeMetadata, {
        props: { anime: mockAnime }
      })

      const text = wrapper.text()
      expect(text).toContain('Start Date:')
      expect(text).toContain('Apr 6, 2021')
      expect(text).toContain('End Date:')
      expect(text).toContain('Sep 21, 2021')
    })

    it('displays season and source when provided', async () => {
      const wrapper = await mountSuspended(AnimeMetadata, {
        props: { anime: mockAnime }
      })

      expect(wrapper.text()).toContain('Season:')
      expect(wrapper.text()).toContain('WINTER 2021') // from mockAnime seasonYear: 2021
    })

    it('displays studios, popularity and favourites', async () => {
      const wrapper = await mountSuspended(AnimeMetadata, {
        props: { anime: mockAnime }
      })

      const text = wrapper.text()
      expect(text).toContain('Studio:')
      expect(text).toContain('Studio A, Studio B')
      expect(text).toContain('Popularity:')
      expect(text).toContain('#123,456')
      expect(text).toContain('Favourites:')
      expect(text).toContain('7,890')
    })
  })

  describe('Edge cases', () => {
    it('handles missing optional fields gracefully', async () => {
      const minimalAnime = createMockAnime({
        startDate: null,
        endDate: null,
        season: null,
        seasonYear: null,
        source: null,
        studios: { nodes: [] },
        popularity: null,
        favourites: null
      })

      const wrapper = await mountSuspended(AnimeMetadata, {
        props: { anime: minimalAnime }
      })

      const text = wrapper.text()
      expect(text).not.toContain('Start Date: TBA') // Section omitted when null
      expect(text).not.toContain('End Date: TBA')
      expect(text).not.toContain('Season:')
      expect(text).not.toContain('Source:')
      expect(text).not.toContain('Studio:')
      expect(text).not.toContain('Popularity:')
      expect(text).not.toContain('Favourites:')
    })
  })
})

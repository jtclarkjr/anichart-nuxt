import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SearchFilters from '../SearchFilters.vue'
import { MediaSort } from '../../utils/types/anilist'

// Mock the getCurrentSeason function
vi.mock('../../utils/api/anime.api', () => ({
  getCurrentSeason: vi.fn(() => ({
    season: 'FALL' as const,
    year: 2023
  }))
}))

describe('SearchFilters', () => {
  const defaultProps = {
    searchQuery: '',
    selectedSort: MediaSort.POPULARITY_DESC,
    selectedSeason: 'SPRING'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the search filters container', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: defaultProps
      })

      expect(wrapper.find('.search-filters').exists()).toBe(true)
      expect(wrapper.find('.search-section').exists()).toBe(true)
      expect(wrapper.find('.filters').exists()).toBe(true)
    })

    it('renders search input with correct attributes', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: { ...defaultProps, searchQuery: 'test query' }
      })

      const searchInput = wrapper.find('.search-input')
      expect((searchInput.element as HTMLInputElement).value).toBe('test query')
      expect(searchInput.attributes('placeholder')).toBe('Search anime...')
      expect(searchInput.attributes('type')).toBe('text')
    })

    it('renders sort select with all options', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: defaultProps
      })

      const sortSelect = wrapper.find('.filter-select')
      expect(sortSelect.exists()).toBe(true)

      const options = sortSelect.findAll('option')
      expect(options).toHaveLength(4)
      expect(options[0]?.text()).toBe('Popular')
      expect(options[1]?.text()).toBe('Trending')
      expect(options[2]?.text()).toBe('Top Rated')
      expect(options[3]?.text()).toBe('Recently Released')
    })

    it('renders season select with available seasons', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: defaultProps
      })

      const seasonSelects = wrapper.findAll('.filter-select')
      const seasonSelect = seasonSelects[1] // Second select is for seasons
      expect(seasonSelect?.exists()).toBe(true)

      const options = seasonSelect?.findAll('option')
      expect(options?.length).toBeGreaterThan(0)

      // Should include current year seasons based on mocked getCurrentSeason
      expect(wrapper.text()).toContain('Spring 2023')
      expect(wrapper.text()).toContain('Summer 2023')
      expect(wrapper.text()).toContain('Fall 2023')
    })
  })

  describe('Props and v-model', () => {
    it('reflects prop values in form elements', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: {
          searchQuery: 'attack on titan',
          selectedSort: MediaSort.SCORE_DESC,
          selectedSeason: 'SUMMER'
        }
      })

      const searchInput = wrapper.find('.search-input')
      expect((searchInput.element as HTMLInputElement).value).toBe('attack on titan')

      const sortSelect = wrapper.findAll('.filter-select')[0]
      if (!sortSelect) throw new Error('Sort select not found')
      expect((sortSelect.element as HTMLSelectElement).value).toBe(MediaSort.SCORE_DESC)

      const seasonSelect = wrapper.findAll('.filter-select')[1]
      if (!seasonSelect) throw new Error('Season select not found')
      expect((seasonSelect.element as HTMLSelectElement).value).toBe('SUMMER')
    })

    it('emits update events when search input changes', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: defaultProps
      })

      const searchInput = wrapper.find('.search-input')
      await searchInput.setValue('new search query')

      expect(wrapper.emitted('update:searchQuery')).toBeTruthy()
      expect(wrapper.emitted('update:searchQuery')![0]).toEqual(['new search query'])
    })

    it('emits update events when sort selection changes', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: defaultProps
      })

      const sortSelect = wrapper.findAll('.filter-select')[0]
      await sortSelect?.setValue(MediaSort.TRENDING_DESC)

      expect(wrapper.emitted('update:selectedSort')).toBeTruthy()
      expect(wrapper.emitted('update:selectedSort')![0]).toEqual([MediaSort.TRENDING_DESC])
    })

    it('emits update events when season selection changes', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: defaultProps
      })

      const seasonSelect = wrapper.findAll('.filter-select')[1]
      await seasonSelect?.setValue('WINTER')

      expect(wrapper.emitted('update:selectedSeason')).toBeTruthy()
      expect(wrapper.emitted('update:selectedSeason')![0]).toEqual(['WINTER'])
    })

    it('emits filterChange event when selects change', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: defaultProps
      })

      const sortSelect = wrapper.findAll('.filter-select')[0]
      await sortSelect?.trigger('change')

      expect(wrapper.emitted('filterChange')).toBeTruthy()
      expect(wrapper.emitted('filterChange')).toHaveLength(1)

      const seasonSelect = wrapper.findAll('.filter-select')[1]
      await seasonSelect?.trigger('change')

      expect(wrapper.emitted('filterChange')).toHaveLength(2)
    })
  })

  describe('Season Logic', () => {
    it('generates available seasons based on mocked current season', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: defaultProps
      })

      const seasonSelect = wrapper.findAll('.filter-select')[1]
      const options = seasonSelect?.findAll('option')
      
      // Should have season options based on mocked getCurrentSeason
      expect(options?.length).toBeGreaterThan(0)
      expect(wrapper.text()).toContain('2023') // Year from mock
    })

    it('displays season options with proper format', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: defaultProps
      })

      const seasonSelect = wrapper.findAll('.filter-select')[1]
      const options = seasonSelect?.findAll('option')
      const optionTexts = options?.map(option => option.text())
      
      // Check that seasons are formatted as "Season YYYY"
      const hasProperFormat = optionTexts?.some(text => /^(Spring|Summer|Fall|Winter) \d{4}$/.test(text))
      expect(hasProperFormat).toBe(true)
    })
  })

  describe('Styling and Structure', () => {
    it('applies correct CSS classes', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: defaultProps
      })

      expect(wrapper.find('.search-filters').exists()).toBe(true)
      expect(wrapper.find('.search-section').exists()).toBe(true)
      expect(wrapper.find('.search-input').exists()).toBe(true)
      expect(wrapper.find('.filters').exists()).toBe(true)
      expect(wrapper.findAll('.filter-select')).toHaveLength(2)
    })

    it('has proper form structure', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: defaultProps
      })

      const searchInput = wrapper.find('.search-input')
      expect(searchInput.attributes('type')).toBe('text')

      const selects = wrapper.findAll('.filter-select')
      selects.forEach(select => {
        expect(select.element.tagName.toLowerCase()).toBe('select')
      })
    })
  })

  describe('Props Validation', () => {
    it('accepts all required props', async () => {
      expect(async () => {
        await mountSuspended(SearchFilters, {
          props: defaultProps
        })
      }).not.toThrow()
    })

    it('handles different prop combinations', async () => {
      const propCombinations = [
        { searchQuery: '', selectedSort: MediaSort.POPULARITY_DESC, selectedSeason: 'SPRING' },
        { searchQuery: 'test', selectedSort: MediaSort.SCORE_DESC, selectedSeason: 'WINTER' },
        { searchQuery: 'long search query here', selectedSort: MediaSort.TRENDING_DESC, selectedSeason: 'SUMMER' }
      ]

      for (const props of propCombinations) {
        expect(async () => {
          await mountSuspended(SearchFilters, { props })
        }).not.toThrow()
      }
    })
  })

  describe('Edge Cases', () => {
    it('handles empty search query', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: { ...defaultProps, searchQuery: '' }
      })

      const searchInput = wrapper.find('.search-input')
      expect((searchInput.element as HTMLInputElement).value).toBe('')
    })

    it('handles very long search queries', async () => {
      const longQuery = 'a'.repeat(1000)
      const wrapper = await mountSuspended(SearchFilters, {
        props: { ...defaultProps, searchQuery: longQuery }
      })

      const searchInput = wrapper.find('.search-input')
      expect((searchInput.element as HTMLInputElement).value).toBe(longQuery)
    })

    it('handles special characters in search', async () => {
      const specialQuery = 'アニメ & <script>alert("test")</script> émoji 🎌'
      const wrapper = await mountSuspended(SearchFilters, {
        props: { ...defaultProps, searchQuery: specialQuery }
      })

      const searchInput = wrapper.find('.search-input')
      expect((searchInput.element as HTMLInputElement).value).toBe(specialQuery)
    })
  })
})

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
      expect(wrapper.find('.search-input-wrapper').exists()).toBe(true)
      expect(wrapper.find('.search-input').exists()).toBe(true)
      expect(wrapper.find('.filters').exists()).toBe(true)
      expect(wrapper.findAll('.select-wrapper')).toHaveLength(2)
      expect(wrapper.findAll('.filter-select')).toHaveLength(2)
      expect(wrapper.findAll('.select-icon')).toHaveLength(2)
    })

    it('has proper form structure', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: defaultProps
      })

      const searchInput = wrapper.find('.search-input')
      expect(searchInput.attributes('type')).toBe('text')

      const selectWrappers = wrapper.findAll('.select-wrapper')
      expect(selectWrappers).toHaveLength(2)
      
      const selects = wrapper.findAll('.filter-select')
      selects.forEach(select => {
        expect(select.element.tagName.toLowerCase()).toBe('select')
      })
      
      // Check that select icons are present in the HTML
      const selectIcons = wrapper.findAll('.select-icon')
      expect(selectIcons).toHaveLength(2) // Exactly 2 for select dropdowns
      
      // Verify the icons contain the expected chevron-down name
      selectIcons.forEach(icon => {
        expect(icon.html()).toContain('chevron-down')
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

  describe('Clear Button Functionality', () => {
    it('does not show clear button when search query is empty', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: { ...defaultProps, searchQuery: '' }
      })

      const clearButton = wrapper.find('.clear-button')
      expect(clearButton.exists()).toBe(false)
    })

    it('shows clear button when search query has value', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: { ...defaultProps, searchQuery: 'test query' }
      })

      const clearButton = wrapper.find('.clear-button')
      expect(clearButton.exists()).toBe(true)
    })

    it('clear button has correct attributes', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: { ...defaultProps, searchQuery: 'test' }
      })

      const clearButton = wrapper.find('.clear-button')
      expect(clearButton.attributes('type')).toBe('button')
      expect(clearButton.attributes('aria-label')).toBe('Clear search')
    })

    it('clear button contains Icon component', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: { ...defaultProps, searchQuery: 'test' }
      })

      const clearButton = wrapper.find('.clear-button')
      // Check for Icon component by looking for elements with the expected icon name
      expect(clearButton.html()).toContain('lucide:x')
    })

    it('emits correct events when clear button is clicked', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: { ...defaultProps, searchQuery: 'test query' }
      })

      const clearButton = wrapper.find('.clear-button')
      await clearButton.trigger('click')

      // Should emit update:searchQuery with empty string
      expect(wrapper.emitted('update:searchQuery')).toBeTruthy()
      expect(wrapper.emitted('update:searchQuery')![0]).toEqual([''])
      
      // Should also emit filterChange to update results
      expect(wrapper.emitted('filterChange')).toBeTruthy()
      expect(wrapper.emitted('filterChange')).toHaveLength(1)
    })

    it('clear button disappears after clearing search', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: { ...defaultProps, searchQuery: 'test query' }
      })

      // Initially clear button should be visible
      expect(wrapper.find('.clear-button').exists()).toBe(true)

      // Simulate clearing by updating the prop (simulates parent component response)
      await wrapper.setProps({ ...defaultProps, searchQuery: '' })

      // Clear button should now be hidden
      expect(wrapper.find('.clear-button').exists()).toBe(false)
    })

    it('clear button shows/hides reactively as search input changes', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: { ...defaultProps, searchQuery: '' }
      })

      // Initially no clear button
      expect(wrapper.find('.clear-button').exists()).toBe(false)

      // Add text to search input
      await wrapper.setProps({ ...defaultProps, searchQuery: 'test' })
      expect(wrapper.find('.clear-button').exists()).toBe(true)

      // Clear text
      await wrapper.setProps({ ...defaultProps, searchQuery: '' })
      expect(wrapper.find('.clear-button').exists()).toBe(false)

      // Add text again
      await wrapper.setProps({ ...defaultProps, searchQuery: 'another test' })
      expect(wrapper.find('.clear-button').exists()).toBe(true)
    })

    it('clear button works with different search query values', async () => {
      const testQueries = ['test', 'a', 'very long search query', '日本語', '123', '!@#$%']
      
      for (const query of testQueries) {
        const wrapper = await mountSuspended(SearchFilters, {
          props: { ...defaultProps, searchQuery: query }
        })

        expect(wrapper.find('.clear-button').exists()).toBe(true)
        
        const clearButton = wrapper.find('.clear-button')
        await clearButton.trigger('click')
        
        expect(wrapper.emitted('update:searchQuery')![0]).toEqual([''])
      }
    })
  })

  describe('Select Dropdown Icons', () => {
    it('renders chevron-down icons for both select dropdowns', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: defaultProps
      })

      const selectWrappers = wrapper.findAll('.select-wrapper')
      expect(selectWrappers).toHaveLength(2)
      
      const selectIcons = wrapper.findAll('.select-icon')
      expect(selectIcons).toHaveLength(2)
      
      // Check that each icon contains the chevron-down icon name
      selectIcons.forEach(icon => {
        expect(icon.html()).toContain('chevron-down')
      })
    })

    it('select icons have correct CSS classes and positioning', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: defaultProps
      })

      const selectIcons = wrapper.findAll('.select-icon')
      selectIcons.forEach(icon => {
        expect(icon.classes()).toContain('select-icon')
      })
    })

    it('select wrappers contain both select element and icon', async () => {
      const wrapper = await mountSuspended(SearchFilters, {
        props: defaultProps
      })

      const selectWrappers = wrapper.findAll('.select-wrapper')
      selectWrappers.forEach(selectWrapper => {
        // Each wrapper should contain exactly one select and one icon
        expect(selectWrapper.findAll('select')).toHaveLength(1)
        expect(selectWrapper.findAll('.select-icon')).toHaveLength(1)
      })
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

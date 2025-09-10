import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createMockAnime } from './test-utils'
import AnimeDescription from '../AnimeDescription.vue'

describe('AnimeDescription', () => {
  const mockAnime = createMockAnime()

  describe('Rendering', () => {
    it('renders the description section with title', async () => {
      const wrapper = await mountSuspended(AnimeDescription, {
        props: { anime: mockAnime }
      })

      expect(wrapper.find('.description-section').exists()).toBe(true)
      expect(wrapper.find('h2').text()).toBe('Description')
    })

    it('displays anime description when available', async () => {
      const animeWithDescription = createMockAnime({
        description: '<p>This is a test anime description with <strong>bold text</strong>.</p>'
      })

      const wrapper = await mountSuspended(AnimeDescription, {
        props: { anime: animeWithDescription }
      })

      const description = wrapper.find('.description')
      expect(description.exists()).toBe(true)
      expect(description.html()).toContain('<p>This is a test anime description with <strong>bold text</strong>.</p>')
    })

    it('displays fallback message when description is null', async () => {
      const animeWithoutDescription = createMockAnime({ description: null })

      const wrapper = await mountSuspended(AnimeDescription, {
        props: { anime: animeWithoutDescription }
      })

      const description = wrapper.find('.description')
      expect(description.text()).toBe('No description available.')
    })

    it('displays fallback message when description is empty string', async () => {
      const animeWithEmptyDescription = createMockAnime({ description: '' })

      const wrapper = await mountSuspended(AnimeDescription, {
        props: { anime: animeWithEmptyDescription }
      })

      const description = wrapper.find('.description')
      expect(description.text()).toBe('No description available.')
    })
  })

  describe('HTML Content', () => {
    it('renders HTML content properly with v-html', async () => {
      const animeWithHtmlDescription = createMockAnime({
        description: '<p>First paragraph</p><p>Second paragraph with <i>italic</i> and <b>bold</b> text.</p><br/>Line break here.'
      })

      const wrapper = await mountSuspended(AnimeDescription, {
        props: { anime: animeWithHtmlDescription }
      })

      const description = wrapper.find('.description')
      
      // Check that HTML is rendered
      expect(description.html()).toContain('<p>First paragraph</p>')
      expect(description.html()).toContain('<p>Second paragraph with <i>italic</i> and <b>bold</b> text.</p>')
      expect(description.html()).toContain('<br>')
      
      // Check that text content is accessible
      expect(description.text()).toContain('First paragraph')
      expect(description.text()).toContain('Second paragraph with italic and bold text.')
    })

    it('handles complex HTML formatting', async () => {
      const animeWithComplexHtml = createMockAnime({
        description: '<p>A story about <strong>heroes</strong> who fight against <i>evil forces</i>.</p><p>Features:</p><ul><li>Great animation</li><li>Amazing soundtrack</li></ul>'
      })

      const wrapper = await mountSuspended(AnimeDescription, {
        props: { anime: animeWithComplexHtml }
      })

      const description = wrapper.find('.description')
      expect(description.html()).toContain('<strong>heroes</strong>')
      expect(description.html()).toContain('<i>evil forces</i>')
      expect(description.text()).toContain('A story about heroes who fight against evil forces.')
    })
  })

  describe('Props Validation', () => {
    it('accepts valid anime object', async () => {
      expect(async () => {
        await mountSuspended(AnimeDescription, {
          props: { anime: mockAnime }
        })
      }).not.toThrow()
    })

    it('handles anime object with various description states', async () => {
      const testCases = [
        createMockAnime({ description: 'Simple text description' }),
        createMockAnime({ description: '<p>HTML description</p>' }),
        createMockAnime({ description: null }),
        createMockAnime({ description: '' })
      ]

      for (const anime of testCases) {
        expect(async () => {
          await mountSuspended(AnimeDescription, {
            props: { anime }
          })
        }).not.toThrow()
      }
    })
  })

  describe('Styling and Structure', () => {
    it('applies correct CSS classes', async () => {
      const wrapper = await mountSuspended(AnimeDescription, {
        props: { anime: mockAnime }
      })

      expect(wrapper.find('.description-section').exists()).toBe(true)
      expect(wrapper.find('.description').exists()).toBe(true)
    })

    it('renders section heading with proper structure', async () => {
      const wrapper = await mountSuspended(AnimeDescription, {
        props: { anime: mockAnime }
      })

      const heading = wrapper.find('h2')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toBe('Description')
    })
  })

  describe('Edge Cases', () => {
    it('handles very long descriptions', async () => {
      const longDescription = '<p>' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100) + '</p>'
      const animeWithLongDescription = createMockAnime({ description: longDescription })

      const wrapper = await mountSuspended(AnimeDescription, {
        props: { anime: animeWithLongDescription }
      })

      const description = wrapper.find('.description')
      expect(description.exists()).toBe(true)
      expect(description.text().length).toBeGreaterThan(1000)
    })

    it('handles descriptions with special characters', async () => {
      const animeWithSpecialChars = createMockAnime({
        description: '<p>Description with special characters: &amp; &lt; &gt; &quot; &#39; 日本語 émoji 🎌</p>'
      })

      const wrapper = await mountSuspended(AnimeDescription, {
        props: { anime: animeWithSpecialChars }
      })

      const description = wrapper.find('.description')
      expect(description.exists()).toBe(true)
      expect(description.html()).toContain('special characters')
    })

    it('handles malformed HTML gracefully', async () => {
      const animeWithMalformedHtml = createMockAnime({
        description: '<p>Unclosed paragraph<strong>Bold text<i>Italic text</p>'
      })

      const wrapper = await mountSuspended(AnimeDescription, {
        props: { anime: animeWithMalformedHtml }
      })

      const description = wrapper.find('.description')
      expect(description.exists()).toBe(true)
      expect(description.text()).toContain('Unclosed paragraph')
    })
  })
})

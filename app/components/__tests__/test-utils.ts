import { vi } from 'vitest'
import type { Media, MediaTitle, MediaCoverImage, MediaDate } from '../../utils/types/anilist'
import { MediaType, MediaFormat, MediaStatus, MediaSeason } from '../../utils/types/anilist'

/**
 * Create a mock Media object with default values
 */
export const createMockAnime = (overrides: Partial<Media> = {}): Media => {
  const defaultAnime: Media = {
    id: 1,
    title: {
      romaji: 'Test Anime',
      english: 'Test Anime English',
      native: 'テストアニメ'
    } as MediaTitle,
    description: 'Test anime description',
    startDate: {
      year: 2023,
      month: 1,
      day: 1
    } as MediaDate,
    endDate: null,
    season: MediaSeason.WINTER,
    seasonYear: 2023,
    type: MediaType.ANIME,
    format: MediaFormat.TV,
    status: MediaStatus.FINISHED,
    episodes: 12,
    duration: 24,
    chapters: null,
    volumes: null,
    genres: ['Action', 'Adventure', 'Fantasy'],
    averageScore: 85,
    meanScore: 85,
    popularity: 10000,
    favourites: 5000,
    hashtag: '#TestAnime',
    isAdult: false,
    countryOfOrigin: 'JP',
    coverImage: {
      extraLarge: 'https://example.com/cover-xl.jpg',
      large: 'https://example.com/cover-large.jpg',
      medium: 'https://example.com/cover-medium.jpg',
      color: '#FF6B6B'
    } as MediaCoverImage,
    bannerImage: 'https://example.com/banner.jpg',
    studios: {
      nodes: [
        { id: 1, name: 'Test Studio' }
      ]
    },
    source: null
  }

  return { ...defaultAnime, ...overrides }
}

/**
 * Create multiple mock anime for testing grids/lists
 */
export const createMockAnimeList = (count: number = 3): Media[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockAnime({
      id: index + 1,
      title: {
        romaji: `Test Anime ${index + 1}`,
        english: `Test Anime ${index + 1} English`,
        native: `テストアニメ${index + 1}`
      } as MediaTitle,
      averageScore: 80 + index * 5,
      genres: index % 2 === 0 ? ['Action', 'Adventure'] : ['Comedy', 'Romance', 'Drama']
    })
  )
}

/**
 * Mock anime with missing data for edge case testing
 */
export const createIncompleteAnime = (): Media => {
  return createMockAnime({
    title: {
      romaji: null,
      english: null,
      native: 'テストアニメ'
    } as MediaTitle,
    averageScore: null,
    startDate: null,
    genres: [],
    coverImage: {
      extraLarge: null,
      large: null,
      medium: null,
      color: null
    } as MediaCoverImage
  })
}

/**
 * Global mocks for Nuxt/Vue testing
 */
export const mockNuxtComponents = () => {
  // Mock NuxtImg component
  global.NuxtImg = {
    name: 'NuxtImg',
    props: ['src', 'alt', 'class', 'loading', 'preset'],
    emits: ['load', 'error'],
    template: `<img v-bind="$attrs" @load="$emit('load')" @error="$emit('error')" />`
  }
}

/**
 * Mock utility functions that are commonly used
 */
export const mockUtilityFunctions = () => {
  return {
    getDisplayTitle: vi.fn((title: MediaTitle) => 
      title.english || title.romaji || title.native || 'Unknown Title'
    ),
    getSafeImageUrl: vi.fn((coverImage: MediaCoverImage) => 
      coverImage.extraLarge || coverImage.large || coverImage.medium || undefined
    ),
    formatYear: vi.fn((startDate: MediaDate | null) => 
      startDate?.year ? startDate.year.toString() : 'TBA'
    )
  }
}

/**
 * Create a mock event for testing user interactions
 */
export const createMockEvent = (type: string = 'click'): Event => {
  return new Event(type, { bubbles: true, cancelable: true })
}

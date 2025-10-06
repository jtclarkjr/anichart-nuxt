import { describe, it, expect, afterEach } from 'vitest'
import {
  getDisplayTitle,
  getSafeImageUrl,
  formatScore,
  formatYear,
  formatStatus,
  getCurrentSeason
} from '../api/anime.api'
import { MediaStatus, MediaSeason } from '../types/anilist'
import type { MediaTitle, MediaCoverImage, MediaDate } from '../types/anilist'

describe('Anime API Utils', () => {
  describe('getDisplayTitle', () => {
    it('returns English title when available', () => {
      const title: MediaTitle = {
        romaji: 'Kimetsu no Yaiba',
        english: 'Demon Slayer',
        native: '鬼滅の刃'
      }
      expect(getDisplayTitle(title)).toBe('Demon Slayer')
    })

    it('returns Romaji title when English is not available', () => {
      const title: MediaTitle = {
        romaji: 'Kimetsu no Yaiba',
        english: null,
        native: '鬼滅の刃'
      }
      expect(getDisplayTitle(title)).toBe('Kimetsu no Yaiba')
    })

    it('returns Native title when English and Romaji are not available', () => {
      const title: MediaTitle = {
        romaji: null,
        english: null,
        native: '鬼滅の刃'
      }
      expect(getDisplayTitle(title)).toBe('鬼滅の刃')
    })

    it('returns "Unknown Title" when all titles are null', () => {
      const title: MediaTitle = {
        romaji: null,
        english: null,
        native: null
      }
      expect(getDisplayTitle(title)).toBe('Unknown Title')
    })

    it('handles empty strings as falsy values', () => {
      const title: MediaTitle = {
        romaji: '',
        english: 'Demon Slayer',
        native: '鬼滅の刃'
      }
      expect(getDisplayTitle(title)).toBe('Demon Slayer')
    })
  })

  describe('getSafeImageUrl', () => {
    it('returns extraLarge URL when available', () => {
      const coverImage: MediaCoverImage = {
        extraLarge: 'https://example.com/xl.jpg',
        large: 'https://example.com/large.jpg',
        medium: 'https://example.com/medium.jpg',
        color: '#FF0000'
      }
      expect(getSafeImageUrl(coverImage)).toBe('https://example.com/xl.jpg')
    })

    it('returns large URL when extraLarge is not available', () => {
      const coverImage: MediaCoverImage = {
        extraLarge: null,
        large: 'https://example.com/large.jpg',
        medium: 'https://example.com/medium.jpg',
        color: '#FF0000'
      }
      expect(getSafeImageUrl(coverImage)).toBe('https://example.com/large.jpg')
    })

    it('returns medium URL when extraLarge and large are not available', () => {
      const coverImage: MediaCoverImage = {
        extraLarge: null,
        large: null,
        medium: 'https://example.com/medium.jpg',
        color: '#FF0000'
      }
      expect(getSafeImageUrl(coverImage)).toBe('https://example.com/medium.jpg')
    })

    it('returns undefined when no URLs are available', () => {
      const coverImage: MediaCoverImage = {
        extraLarge: null,
        large: null,
        medium: null,
        color: '#FF0000'
      }
      expect(getSafeImageUrl(coverImage)).toBeUndefined()
    })

    it('handles empty strings as falsy values', () => {
      const coverImage: MediaCoverImage = {
        extraLarge: '',
        large: 'https://example.com/large.jpg',
        medium: 'https://example.com/medium.jpg',
        color: '#FF0000'
      }
      expect(getSafeImageUrl(coverImage)).toBe('https://example.com/large.jpg')
    })
  })

  describe('formatScore', () => {
    it('formats numeric scores correctly', () => {
      expect(formatScore(85)).toBe('85%')
      expect(formatScore(100)).toBe('100%')
      expect(formatScore(0)).toBe('N/A') // 0 is treated as falsy
    })

    it('returns "N/A" for null scores', () => {
      expect(formatScore(null)).toBe('N/A')
    })

    it('handles edge cases', () => {
      expect(formatScore(undefined as unknown as number | null)).toBe('N/A')
    })
  })

  describe('formatYear', () => {
    it('formats complete dates correctly', () => {
      const date: MediaDate = { year: 2021, month: 4, day: 6 }
      expect(formatYear(date)).toBe('2021')
    })

    it('handles dates with only year', () => {
      const date: MediaDate = { year: 2021, month: null, day: null }
      expect(formatYear(date)).toBe('2021')
    })

    it('returns "TBA" for null dates', () => {
      expect(formatYear(null)).toBe('TBA')
    })

    it('returns "TBA" for dates without year', () => {
      const date: MediaDate = { year: null, month: 4, day: 6 }
      expect(formatYear(date)).toBe('TBA')
    })

    it('handles undefined', () => {
      expect(formatYear(undefined as unknown as MediaDate | null)).toBe('TBA')
    })
  })

  describe('formatStatus', () => {
    it('formats MediaStatus.FINISHED correctly', () => {
      expect(formatStatus(MediaStatus.FINISHED)).toBe('Completed')
    })

    it('formats MediaStatus.RELEASING correctly', () => {
      expect(formatStatus(MediaStatus.RELEASING)).toBe('Airing')
    })

    it('formats MediaStatus.NOT_YET_RELEASED correctly', () => {
      expect(formatStatus(MediaStatus.NOT_YET_RELEASED)).toBe('Upcoming')
    })

    it('formats MediaStatus.CANCELLED correctly', () => {
      expect(formatStatus(MediaStatus.CANCELLED)).toBe('Cancelled')
    })

    it('formats MediaStatus.HIATUS correctly', () => {
      expect(formatStatus(MediaStatus.HIATUS)).toBe('Hiatus')
    })

    it('returns "Unknown" for null status', () => {
      expect(formatStatus(null)).toBe('Unknown')
    })

    it('returns the original value for unknown status values', () => {
      expect(formatStatus('UNKNOWN_STATUS' as MediaStatus)).toBe('UNKNOWN_STATUS')
    })
  })

  describe('getCurrentSeason', () => {
    const originalDate = Date

    afterEach(() => {
      global.Date = originalDate
    })

    const mockDate = (month: number, year = 2023) => {
      global.Date = class extends Date {
        constructor() {
          super()
          return new originalDate(year, month - 1, 15) // 15th of the month
        }

        static now() {
          return new originalDate(year, month - 1, 15).getTime()
        }

        getMonth() {
          return month - 1
        }

        getFullYear() {
          return year
        }
      } as DateConstructor
    }

    it('returns WINTER for December', () => {
      mockDate(12, 2023)
      const result = getCurrentSeason()
      expect(result.season).toBe(MediaSeason.WINTER)
      expect(result.year).toBe(2023)
    })

    it('returns WINTER for January', () => {
      mockDate(1, 2023)
      const result = getCurrentSeason()
      expect(result.season).toBe(MediaSeason.WINTER)
      expect(result.year).toBe(2023)
    })

    it('returns WINTER for February', () => {
      mockDate(2, 2023)
      const result = getCurrentSeason()
      expect(result.season).toBe(MediaSeason.WINTER)
      expect(result.year).toBe(2023)
    })

    it('returns SPRING for March', () => {
      mockDate(3, 2023)
      const result = getCurrentSeason()
      expect(result.season).toBe(MediaSeason.SPRING)
      expect(result.year).toBe(2023)
    })

    it('returns SPRING for April', () => {
      mockDate(4, 2023)
      const result = getCurrentSeason()
      expect(result.season).toBe(MediaSeason.SPRING)
      expect(result.year).toBe(2023)
    })

    it('returns SPRING for May', () => {
      mockDate(5, 2023)
      const result = getCurrentSeason()
      expect(result.season).toBe(MediaSeason.SPRING)
      expect(result.year).toBe(2023)
    })

    it('returns SUMMER for June', () => {
      mockDate(6, 2023)
      const result = getCurrentSeason()
      expect(result.season).toBe(MediaSeason.SUMMER)
      expect(result.year).toBe(2023)
    })

    it('returns SUMMER for July', () => {
      mockDate(7, 2023)
      const result = getCurrentSeason()
      expect(result.season).toBe(MediaSeason.SUMMER)
      expect(result.year).toBe(2023)
    })

    it('returns SUMMER for August', () => {
      mockDate(8, 2023)
      const result = getCurrentSeason()
      expect(result.season).toBe(MediaSeason.SUMMER)
      expect(result.year).toBe(2023)
    })

    it('returns FALL for September', () => {
      mockDate(9, 2023)
      const result = getCurrentSeason()
      expect(result.season).toBe(MediaSeason.FALL)
      expect(result.year).toBe(2023)
    })

    it('returns FALL for October', () => {
      mockDate(10, 2023)
      const result = getCurrentSeason()
      expect(result.season).toBe(MediaSeason.FALL)
      expect(result.year).toBe(2023)
    })

    it('returns FALL for November', () => {
      mockDate(11, 2023)
      const result = getCurrentSeason()
      expect(result.season).toBe(MediaSeason.FALL)
      expect(result.year).toBe(2023)
    })
  })
})

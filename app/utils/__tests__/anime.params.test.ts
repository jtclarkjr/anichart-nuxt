import { describe, expect, it } from 'vitest'
import { buildAnimeListParams, calculateSeasonYear, normalizeSearchQuery } from '../anime/params'
import { MediaSeason, MediaSort } from '../types/anilist'
import type { AnimeListQueryFilters } from '../types/anime'

const createFilters = (overrides: Partial<AnimeListQueryFilters> = {}): AnimeListQueryFilters => ({
  search: '',
  sort: MediaSort.POPULARITY_DESC,
  season: '',
  seasonYear: null,
  perPage: 50,
  ...overrides
})

describe('anime query parameters', () => {
  it('normalizes surrounding, repeated, and unicode whitespace', () => {
    expect(normalizeSearchQuery('  Cowboy\u00a0\u2003Bebop  ')).toBe('Cowboy Bebop')
  })

  it('adds search-match precedence and mandatory safe-content filtering', () => {
    const params = buildAnimeListParams(
      createFilters({ search: ' Cowboy   Bebop ', sort: MediaSort.SCORE_DESC }),
      3
    )

    expect(params).toEqual({
      page: 3,
      perPage: 50,
      sort: [MediaSort.SEARCH_MATCH, MediaSort.SCORE_DESC],
      search: 'Cowboy Bebop',
      isAdult: false
    })
  })

  it('includes the selected season only with its deterministic year', () => {
    const params = buildAnimeListParams(
      createFilters({ season: MediaSeason.WINTER, seasonYear: 2027 }),
      1
    )

    expect(params.season).toBe(MediaSeason.WINTER)
    expect(params.seasonYear).toBe(2027)
  })

  it('calculates winter-boundary season years from the serialized context', () => {
    expect(calculateSeasonYear(MediaSeason.FALL, { season: MediaSeason.WINTER, year: 2026 })).toBe(
      2025
    )
    expect(calculateSeasonYear(MediaSeason.WINTER, { season: MediaSeason.FALL, year: 2026 })).toBe(
      2027
    )
    expect(
      calculateSeasonYear(MediaSeason.SPRING, { season: MediaSeason.SUMMER, year: 2026 })
    ).toBe(2026)
  })
})

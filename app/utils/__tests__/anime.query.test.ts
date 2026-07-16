import { describe, expect, it } from 'vitest'
import {
  ANIME_INITIAL_PAGE,
  animeDetailsQueryOptions,
  getNextAnimePageParam
} from '../anime/queryOptions'
import { animeQueryKeys } from '../anime/queryKeys'
import { MediaSeason, MediaSort } from '../types/anilist'
import type { Page } from '../types/anilist'
import type { AnimeListQueryFilters } from '../types/anime'

const filters: AnimeListQueryFilters = {
  search: 'frieren',
  sort: MediaSort.SCORE_DESC,
  season: MediaSeason.FALL,
  seasonYear: 2025,
  perPage: 50
}

const createPage = (currentPage: number, hasNextPage: boolean): Page => ({
  pageInfo: {
    total: 100,
    currentPage,
    lastPage: 2,
    hasNextPage,
    perPage: 50
  },
  media: []
})

describe('anime TanStack query definitions', () => {
  it('uses stable resource keys and keeps pagination out of the list key', () => {
    expect(animeQueryKeys.list(filters)).toEqual([
      'anime',
      'list',
      {
        search: 'frieren',
        sort: MediaSort.SCORE_DESC,
        season: MediaSeason.FALL,
        seasonYear: 2025,
        perPage: 50
      }
    ])
    expect(animeQueryKeys.detail(154587)).toEqual(['anime', 'detail', 154587])
  })

  it('starts infinite queries at page one and advances from pageInfo', () => {
    const firstPage = createPage(1, true)
    const lastPage = createPage(2, false)

    expect(ANIME_INITIAL_PAGE).toBe(1)
    expect(getNextAnimePageParam(firstPage)).toBe(2)
    expect(getNextAnimePageParam(lastPage)).toBeUndefined()
  })

  it('disables invalid detail identifiers', () => {
    expect(animeDetailsQueryOptions(1).enabled).toBe(true)
    expect(animeDetailsQueryOptions(0).enabled).toBe(false)
    expect(animeDetailsQueryOptions(Number.NaN).enabled).toBe(false)
  })
})

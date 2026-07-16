import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getAnimeDetails, getAnimeList } from '../api/anime.api'
import { AnimeApiError, isRetryableAnimeError } from '../api/errors'
import { MediaType } from '../types/anilist'
import type { Media, Page } from '../types/anilist'

const createMedia = (overrides: Partial<Media> = {}): Media => ({
  id: 1,
  title: { romaji: 'Cowboy Bebop', english: 'Cowboy Bebop', native: 'カウボーイビバップ' },
  description: null,
  startDate: null,
  endDate: null,
  season: null,
  seasonYear: null,
  type: MediaType.ANIME,
  format: null,
  status: null,
  episodes: null,
  duration: null,
  chapters: null,
  volumes: null,
  genres: ['Action'],
  averageScore: null,
  meanScore: null,
  popularity: null,
  favourites: null,
  hashtag: null,
  isAdult: false,
  countryOfOrigin: null,
  coverImage: { extraLarge: null, large: null, medium: null, color: null },
  bannerImage: null,
  studios: null,
  source: null,
  ...overrides
})

const createPage = (media: Media[]): Page => ({
  pageInfo: {
    total: media.length,
    currentPage: 1,
    lastPage: 1,
    hasNextPage: false,
    perPage: 50
  },
  media
})

describe('anime server data API', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('$fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('unwraps GraphQL data, forwards cancellation, and caches only safe list results', async () => {
    const safe = createMedia()
    const adult = createMedia({ id: 2, isAdult: true })
    const bannedGenre = createMedia({ id: 3, genres: ['Hentai'] })
    const controller = new AbortController()
    fetchMock.mockResolvedValue({ data: { Page: createPage([safe, adult, bannedGenre]) } })

    const result = await getAnimeList({ isAdult: true }, { signal: controller.signal })

    expect(result.media).toEqual([safe])
    expect(fetchMock).toHaveBeenCalledWith(
      '/graphql',
      expect.objectContaining({
        signal: controller.signal,
        body: expect.objectContaining({
          variables: expect.objectContaining({ isAdult: false })
        })
      })
    )
  })

  it('rejects unsafe detail records', async () => {
    fetchMock.mockResolvedValue({
      data: { Media: createMedia({ isAdult: true }) }
    })

    await expect(getAnimeDetails(1)).rejects.toMatchObject({
      name: 'AnimeApiError',
      retryable: false
    })
  })

  it('turns GraphQL errors into non-retryable errors', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    fetchMock.mockResolvedValue({ errors: [{ message: 'Invalid query' }] })

    await expect(getAnimeList()).rejects.toMatchObject({
      name: 'AnimeApiError',
      retryable: false
    })
  })

  it('classifies transient transport errors as retryable', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    fetchMock.mockRejectedValue(Object.assign(new Error('Unavailable'), { statusCode: 503 }))

    await expect(getAnimeList()).rejects.toMatchObject({
      name: 'AnimeApiError',
      retryable: true,
      statusCode: 503
    })
  })

  it('does not retry cancellation errors', () => {
    const error = new AnimeApiError('Cancelled', { retryable: false })
    expect(isRetryableAnimeError(error)).toBe(false)
    expect(
      isRetryableAnimeError(Object.assign(new Error('Cancelled'), { name: 'AbortError' }))
    ).toBe(false)
  })
})

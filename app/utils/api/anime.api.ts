import { GET_ANIME_LIST, GET_ANIME_DETAILS } from './queries'
import type {
  Media,
  Page,
  AnimeListParams,
  GraphQLResponse,
  AnimeListResponse,
  AnimeDetailsResponse,
  MediaTitle,
  MediaCoverImage,
  MediaDate
} from '../types/anilist'
import { MediaSeason, MediaSort, MediaStatus } from '../types/anilist'
import type { Nullable } from '../types/shared'
import type { AnimeApiRequestOptions } from '../types/anime'
import { getCurrentSeason } from '../helpers/date'
import { filterSafeAnime } from '../anime/filters'
import { AnimeApiError, isAbortError, toAnimeApiError } from './errors'

export { getCurrentSeason }

// Helper function to handle GraphQL queries using Nuxt's $fetch
const executeQuery = async <T>(
  query: string,
  variables: Record<string, unknown> | AnimeListParams,
  errorMessage: string,
  options: AnimeApiRequestOptions = {}
): Promise<T> => {
  try {
    const response = await $fetch<GraphQLResponse<T>>('/graphql', {
      method: 'POST',
      body: {
        query,
        variables
      },
      signal: options.signal
    })

    if (response.errors?.length) {
      throw new AnimeApiError(
        `${errorMessage}: ${response.errors.map((error) => error.message).join('; ')}`,
        { retryable: false }
      )
    }

    if (!response.data) {
      throw new AnimeApiError(`${errorMessage}: No data returned from GraphQL query`, {
        retryable: false
      })
    }

    return response.data
  } catch (error) {
    if (!isAbortError(error)) {
      console.error(`${errorMessage}:`, error)
    }
    throw toAnimeApiError(error, errorMessage)
  }
}

// Helper function to extract Page data with validation
const extractPageData = (data: AnimeListResponse | undefined): Page => {
  if (!data?.Page) {
    throw new Error('No data received from API')
  }
  return data.Page
}

// Helper function to extract Media data with validation
const extractMediaData = (data: AnimeDetailsResponse | undefined): Media => {
  if (!data?.Media) {
    throw new Error('No anime data received from API')
  }
  return data.Media
}

/**
 * Get a list of anime with optional filtering and pagination
 */
export const getAnimeList = async (
  params: AnimeListParams = {},
  options: AnimeApiRequestOptions = {}
): Promise<Page> => {
  const data = await executeQuery<AnimeListResponse>(
    GET_ANIME_LIST,
    { ...params, isAdult: false },
    'Failed to fetch anime list',
    options
  )
  const page = extractPageData(data)
  return { ...page, media: filterSafeAnime(page.media) }
}

/**
 * Get detailed information about a specific anime
 */
export const getAnimeDetails = async (
  id: number,
  options: AnimeApiRequestOptions = {}
): Promise<Media> => {
  const data = await executeQuery<AnimeDetailsResponse>(
    GET_ANIME_DETAILS,
    { id },
    'Failed to fetch anime details',
    options
  )
  const media = extractMediaData(data)
  if (filterSafeAnime([media]).length === 0) {
    throw new AnimeApiError('Anime details are unavailable', { retryable: false })
  }
  return media
}

/**
 * Search for anime by title
 */
export const searchAnime = async (
  search: string,
  page: number = 1,
  perPage: number = 20
): Promise<Page> => {
  return getAnimeList({
    search,
    page,
    perPage,
    sort: [MediaSort.SEARCH_MATCH, MediaSort.POPULARITY_DESC]
  })
}

/**
 * Get trending anime
 */
export const getTrendingAnime = async (page: number = 1, perPage: number = 20): Promise<Page> => {
  return getAnimeList({
    page,
    perPage,
    sort: [MediaSort.TRENDING_DESC, MediaSort.POPULARITY_DESC]
  })
}

/**
 * Get seasonal anime
 */
export const getSeasonalAnime = async (
  season: MediaSeason,
  seasonYear: number,
  page: number = 1,
  perPage: number = 20
): Promise<Page> => {
  return getAnimeList({ season, seasonYear, page, perPage })
}

/**
 * Get the display title for an anime (prefer English, fallback to Romaji)
 */
export const getDisplayTitle = (title: MediaTitle): string => {
  return title.english || title.romaji || title.native || 'Unknown Title'
}

/**
 * Get a safe image URL that handles null values properly
 */
export const getSafeImageUrl = (
  coverImage: Pick<MediaCoverImage, 'extraLarge' | 'large' | 'medium'>
): string | undefined => {
  return coverImage.extraLarge || coverImage.large || coverImage.medium || undefined
}

/**
 * Format anime score for display
 */
export const formatScore = (score: Nullable<number>): string => {
  if (!score) return 'N/A'
  return `${score}%`
}

/**
 * Format anime year for display
 */
export const formatYear = (startDate: Nullable<MediaDate>): string => {
  if (!startDate?.year) return 'TBA'
  return startDate.year.toString()
}

/**
 * Format anime status for display
 */
export const formatStatus = (status: Nullable<MediaStatus>): string => {
  if (!status) return 'Unknown'

  switch (status) {
    case MediaStatus.FINISHED:
      return 'Completed'
    case MediaStatus.RELEASING:
      return 'Airing'
    case MediaStatus.NOT_YET_RELEASED:
      return 'Upcoming'
    case MediaStatus.CANCELLED:
      return 'Cancelled'
    case MediaStatus.HIATUS:
      return 'Hiatus'
    default:
      return status
  }
}

// For backward compatibility, export all functions as AnimeApi object
export const AnimeApi = {
  getAnimeList,
  getAnimeDetails,
  searchAnime,
  getTrendingAnime,
  getSeasonalAnime,
  getCurrentSeason,
  getDisplayTitle,
  getSafeImageUrl,
  formatScore,
  formatYear,
  formatStatus
}

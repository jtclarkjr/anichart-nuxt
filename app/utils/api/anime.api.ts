import {
  GET_ANIME_LIST,
  GET_ANIME_DETAILS,
  SEARCH_ANIME,
  GET_TRENDING_ANIME,
  GET_SEASONAL_ANIME
} from './queries'
import type {
  Media,
  Page,
  AnimeListParams,
  AnimeListResponse,
  AnimeDetailsResponse
} from '../types/anilist'
import { MediaSeason } from '../types/anilist'
import { GraphQLError, NetworkError, ValidationError } from './errors'
import { logRequest, logResponse, logError } from './interceptors'
import { withRetry } from './retry'
import { apiCache } from './cache'
import {
  getDisplayTitle,
  getSafeImageUrl,
  formatScore,
  formatYear,
  formatStatus
} from '../helpers/formatters'

// Type guards for runtime validation
const isValidPage = (data: unknown): data is Page => {
  return (
    !!data &&
    typeof data === 'object' &&
    'pageInfo' in data &&
    'media' in data &&
    Array.isArray((data as Page).media)
  )
}

const isValidMedia = (data: unknown): data is Media => {
  return !!data && typeof data === 'object' && 'id' in data && 'title' in data
}

// Helper function to generate cache keys
const generateCacheKey = (query: string, variables: Record<string, unknown>): string => {
  const sortedVars = JSON.stringify(variables, Object.keys(variables).sort())
  return `${query.slice(0, 50)}:${sortedVars}`
}

// Helper function to handle GraphQL queries using Nuxt's $fetch
const executeQuery = async <T>(
  query: string,
  variables: Record<string, unknown> | AnimeListParams,
  errorMessage: string,
  options: { enableCache?: boolean; cacheTTL?: number; enableRetry?: boolean } = {}
): Promise<T> => {
  const { enableCache = true, cacheTTL = 300000, enableRetry = true } = options
  const startTime = Date.now()

  // Check cache first
  if (enableCache) {
    const cacheKey = generateCacheKey(query, variables as Record<string, unknown>)
    const cached = apiCache.get<T>(cacheKey)
    if (cached) {
      if (import.meta.dev) {
        console.log('[API Cache Hit]', cacheKey)
      }
      return cached
    }
  }

  logRequest(query, variables)

  const fetchData = async (): Promise<T> => {
    try {
      const data = await $fetch<T>('/graphql', {
        method: 'POST',
        body: {
          query,
          variables
        }
      })

      if (!data) {
        throw new ValidationError('No data returned from GraphQL query')
      }

      return data
    } catch (error) {
      logError(error, errorMessage)

      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('network')) {
          throw new NetworkError(errorMessage, error)
        }
        throw new GraphQLError(errorMessage, error)
      }

      throw new GraphQLError(`${errorMessage}: Unknown error`)
    }
  }

  try {
    const data = enableRetry ? await withRetry(fetchData) : await fetchData()

    logResponse(data, startTime)

    // Cache the result
    if (enableCache) {
      const cacheKey = generateCacheKey(query, variables as Record<string, unknown>)
      apiCache.set(cacheKey, data, cacheTTL)
    }

    return data
  } catch (error) {
    logError(error, `${errorMessage} - Final attempt failed`)
    throw error
  }
}

// Helper function to extract Page data with validation
const extractPageData = (data: AnimeListResponse | undefined): Page => {
  if (!data?.Page) {
    throw new ValidationError('No data received from API')
  }
  if (!isValidPage(data.Page)) {
    throw new ValidationError('Invalid API response structure for Page')
  }
  return data.Page
}

// Helper function to extract Media data with validation
const extractMediaData = (data: AnimeDetailsResponse | undefined): Media => {
  if (!data?.Media) {
    throw new ValidationError('No anime data received from API')
  }
  if (!isValidMedia(data.Media)) {
    throw new ValidationError('Invalid API response structure for Media')
  }
  return data.Media
}

/**
 * Get a list of anime with optional filtering and pagination
 */
export const getAnimeList = async (params: AnimeListParams = {}): Promise<Page> => {
  const data = await executeQuery<AnimeListResponse>(
    GET_ANIME_LIST,
    params,
    'Failed to fetch anime list'
  )
  return extractPageData(data)
}

/**
 * Get detailed information about a specific anime
 */
export const getAnimeDetails = async (id: number): Promise<Media> => {
  const data = await executeQuery<AnimeDetailsResponse>(
    GET_ANIME_DETAILS,
    { id },
    'Failed to fetch anime details'
  )
  return extractMediaData(data)
}

/**
 * Search for anime by title
 */
export const searchAnime = async (
  search: string,
  page: number = 1,
  perPage: number = 20
): Promise<Page> => {
  const data = await executeQuery<AnimeListResponse>(
    SEARCH_ANIME,
    { search, page, perPage },
    'Failed to search anime'
  )
  return extractPageData(data)
}

/**
 * Get trending anime
 */
export const getTrendingAnime = async (page: number = 1, perPage: number = 20): Promise<Page> => {
  const data = await executeQuery<AnimeListResponse>(
    GET_TRENDING_ANIME,
    { page, perPage },
    'Failed to fetch trending anime'
  )
  return extractPageData(data)
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
  const data = await executeQuery<AnimeListResponse>(
    GET_SEASONAL_ANIME,
    { season, seasonYear, page, perPage },
    'Failed to fetch seasonal anime'
  )
  return extractPageData(data)
}

/**
 * Get current season and year
 */
export const getCurrentSeason = (): { season: MediaSeason; year: number } => {
  const now = new Date()
  const month = now.getMonth() + 1 // getMonth() returns 0-11
  const year = now.getFullYear()

  let season: MediaSeason
  if (month >= 12 || month <= 2) {
    season = MediaSeason.WINTER
  } else if (month >= 3 && month <= 5) {
    season = MediaSeason.SPRING
  } else if (month >= 6 && month <= 8) {
    season = MediaSeason.SUMMER
  } else {
    season = MediaSeason.FALL
  }

  return { season, year }
}

// Re-export formatter functions for backward compatibility
export { getDisplayTitle, getSafeImageUrl, formatScore, formatYear, formatStatus }

// Cache management utilities
export const clearApiCache = (): void => {
  apiCache.clear()
}

export const invalidateCache = (pattern: string | RegExp): number => {
  return apiCache.invalidate(pattern)
}

export const getCacheSize = (): number => {
  return apiCache.size()
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
  formatStatus,
  clearCache: clearApiCache,
  invalidateCache,
  getCacheSize
}

import type { Media, MediaSeason } from '~/utils/types/anilist'
import type { CacheEntry } from '~/utils/types/anime'

export const generateCacheKey = (
  searchQuery: string,
  selectedSort: string,
  selectedSeason: MediaSeason | ''
): string => {
  return `${searchQuery}-${selectedSort}-${selectedSeason}`
}

export const getCachedData = (
  cache: Record<string, CacheEntry>,
  cacheKey: string
): CacheEntry | undefined => {
  return cache[cacheKey]
}

export const setCacheData = (
  cache: Record<string, CacheEntry>,
  cacheKey: string,
  data: Media[],
  page: number,
  hasMore: boolean
): void => {
  cache[cacheKey] = { data, page, hasMore }
}

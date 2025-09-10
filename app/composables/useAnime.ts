import { getAnimeList, getAnimeDetails, getCurrentSeason } from '~/utils/api/anime.api'
import type { Media, AnimeListParams } from '~/utils/types/anilist'
import { MediaSort, MediaSeason } from '~/utils/types/anilist'

export interface AnimeState {
  // Current filtered/sorted data
  currentAnime: Media[]

  // UI state
  loading: boolean
  loadingMore: boolean
  error: string

  // Filters
  searchQuery: string
  selectedSort: string // Store as string to avoid serialization issues
  selectedSeason: string // Store as string to avoid serialization issues

  // Pagination
  currentPage: number
  itemsPerPage: number
  totalAvailable: number
  hasNextPage: boolean

  // Cache for different filter combinations
  cache: Record<string, { data: Media[]; page: number; hasMore: boolean }>
}

export const useAnime = () => {
  const { season } = getCurrentSeason()

  // Initialize state with useState for SSR compatibility
  const currentAnime = useState<Media[]>('anime.currentAnime', () => [])
  const loading = useState<boolean>('anime.loading', () => false)
  const loadingMore = useState<boolean>('anime.loadingMore', () => false)
  const error = useState<string>('anime.error', () => '')
  const searchQuery = useState<string>('anime.searchQuery', () => '')
  const selectedSort = useState<string>('anime.selectedSort', () => MediaSort.POPULARITY_DESC)
  const selectedSeason = useState<string>('anime.selectedSeason', () => season)
  const currentPage = useState<number>('anime.currentPage', () => 1)
  const itemsPerPage = useState<number>('anime.itemsPerPage', () => 50)
  const totalAvailable = useState<number>('anime.totalAvailable', () => 0)
  const hasNextPage = useState<boolean>('anime.hasNextPage', () => true)
  const cache = useState<Record<string, { data: Media[]; page: number; hasMore: boolean }>>(
    'anime.cache',
    () => ({})
  )

  // Computed getters
  const displayedAnime = computed(() => currentAnime.value)
  const hasMoreToShow = computed(() => hasNextPage.value)
  const currentCount = computed(() => currentAnime.value.length)
  const cacheKey = computed(
    () => `${searchQuery.value}-${selectedSort.value}-${selectedSeason.value}`
  )

  // Generate API parameters from current state (now exposed for page-level fetching)
  const getApiParams = (): AnimeListParams => {
    const params: AnimeListParams = {
      page: currentPage.value,
      perPage: itemsPerPage.value,
      sort: [selectedSort.value as MediaSort],
      isAdult: false
    }

    // Add search if present
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }

    // Add season filter if present
    if (selectedSeason.value) {
      params.season = selectedSeason.value as MediaSeason
      // For seasonal anime, calculate the correct year
      const { season: currentSeason, year } = getCurrentSeason()
      // Winter season belongs to the next calendar year only if we're currently in Fall
      // (or later months that would make Winter refer to next year's Winter)
      params.seasonYear =
        selectedSeason.value === 'WINTER' && currentSeason === MediaSeason.FALL ? year + 1 : year
    }

    return params
  }

  // New: helpers to allow page-level fetching to update state
  const setLoadingFlags = (isLoading: boolean, isLoadingMore: boolean = false) => {
    loading.value = isLoading
    loadingMore.value = isLoadingMore
  }

  const setError = (errorMessage: string) => {
    error.value = errorMessage
  }

  const setPage = (page: number) => {
    currentPage.value = page
  }

  // Helper: filter out adult content or explicit tags
  const filterSafeAnime = (list: Media[] = []): Media[] => {
    const banned = new Set(['adult', 'hentai'])
    return list.filter((m) => {
      if (m.isAdult) return false
      // Case-insensitive check in genres
      const genres = (m.genres || []).map((g) => g.toLowerCase())
      return !genres.some((g) => banned.has(g))
    })
  }

  const applyResult = (
    result: { media?: Media[]; pageInfo?: { total?: number | null; hasNextPage?: boolean | null } },
    resetData: boolean
  ) => {
    const previousAnime = resetData ? [] : currentAnime.value
    const filtered = filterSafeAnime(result.media ?? [])
    const newAnime = resetData ? filtered : [...previousAnime, ...filtered]

    currentAnime.value = newAnime
    totalAvailable.value = result.pageInfo?.total || 0
    hasNextPage.value = !!result.pageInfo?.hasNextPage

    // Update cache for the current filter combo
    cache.value[cacheKey.value] = {
      data: newAnime,
      page: currentPage.value,
      hasMore: hasNextPage.value
    }
  }

  // Load anime with current filters and sorting
  const loadAnime = async (resetData: boolean = false) => {
    // Generate cache key at the start for use throughout the function
    const currentCacheKey = cacheKey.value

    // For load more, don't use cache - always fetch fresh data
    if (!resetData) {
      // This is load more - keep existing data visible
      loadingMore.value = true
      error.value = ''
    } else {
      // This is a new search/filter - check cache first
      const cached = cache.value[currentCacheKey]

      if (cached) {
        // Use cached data for filters/search
        currentAnime.value = cached.data
        hasNextPage.value = cached.hasMore
        currentPage.value = cached.page
        return
      }

      loading.value = true
      error.value = ''
      currentPage.value = 1
      // Don't clear currentAnime yet - wait for successful response
    }

    // Store previous data to avoid "no anime found" flash
    const previousAnime = resetData ? [] : currentAnime.value

    try {
      const result = await getAnimeList(getApiParams())

      if (!result.media || result.media.length === 0) {
        // If no results and this is initial load, try fallback strategies
        if (resetData && selectedSeason.value && currentAnime.value.length === 0) {
          console.log(`No results for ${selectedSeason.value} season, trying fallbacks...`)

          // Try previous seasons first
          const { season: currentSeason, year } = getCurrentSeason()
          const fallbackSeasons: MediaSeason[] = []

          if (currentSeason === MediaSeason.WINTER) {
            fallbackSeasons.push(MediaSeason.FALL, MediaSeason.SUMMER)
          } else if (currentSeason === MediaSeason.SPRING) {
            fallbackSeasons.push(MediaSeason.WINTER, MediaSeason.FALL)
          } else if (currentSeason === MediaSeason.SUMMER) {
            fallbackSeasons.push(MediaSeason.SPRING, MediaSeason.WINTER)
          } else if (currentSeason === MediaSeason.FALL) {
            fallbackSeasons.push(MediaSeason.SUMMER, MediaSeason.SPRING)
          }

          // Try previous seasons
          for (const fallbackSeason of fallbackSeasons) {
            const seasonYear =
              fallbackSeason === MediaSeason.WINTER && currentSeason !== MediaSeason.WINTER
                ? year + 1
                : year
            const fallbackResult = await getAnimeList({
              ...getApiParams(),
              season: fallbackSeason,
              seasonYear
            })

            if (fallbackResult.media && fallbackResult.media.length > 0) {
              console.log(`Found results in ${fallbackSeason} season`)
              currentAnime.value = filterSafeAnime(fallbackResult.media)
              totalAvailable.value = fallbackResult.pageInfo?.total || 0
              hasNextPage.value = fallbackResult.pageInfo?.hasNextPage || false

              // Update the selected season to the working one
              selectedSeason.value = fallbackSeason

              // Cache the fallback result
              cache.value[cacheKey.value] = {
                data: currentAnime.value,
                page: currentPage.value,
                hasMore: hasNextPage.value
              }
              return
            }
          }

          // If seasonal fallbacks don't work, try without season filter
          const noSeasonParams = { ...getApiParams() }
          delete noSeasonParams.season
          delete noSeasonParams.seasonYear
          const noSeasonResult = await getAnimeList(noSeasonParams)

          if (noSeasonResult.media && noSeasonResult.media.length > 0) {
            currentAnime.value = filterSafeAnime(noSeasonResult.media)
            totalAvailable.value = noSeasonResult.pageInfo?.total || 0
            hasNextPage.value = noSeasonResult.pageInfo?.hasNextPage || false

            // Clear season filter since we're showing all anime
            selectedSeason.value = ''

            // Cache the result
            cache.value[cacheKey.value] = {
              data: currentAnime.value,
              page: currentPage.value,
              hasMore: hasNextPage.value
            }
            return
          }
        }
      }

      const filtered = filterSafeAnime(result.media)
      const newAnime = resetData ? filtered : [...previousAnime, ...filtered]

      currentAnime.value = newAnime
      totalAvailable.value = result.pageInfo?.total || 0
      hasNextPage.value = result.pageInfo?.hasNextPage || false

      // Update cache
      cache.value[currentCacheKey] = {
        data: newAnime,
        page: currentPage.value,
        hasMore: hasNextPage.value
      }
    } catch (err) {
      error.value = 'Failed to load anime data. Please try again.'
      console.error('Error loading anime data:', err)
      // Restore previous data on error if we had some
      if (resetData && previousAnime.length === 0) {
        currentAnime.value = []
      }
    } finally {
      loading.value = false
      loadingMore.value = false
    }
  }

  // Initial load - called when app starts
  const loadInitialData = async () => {
    // Only load if we don't have any data yet
    if (currentAnime.value.length === 0 && !loading.value) {
      await loadAnime(true)
    }
  }

  // Load next page of data
  const loadMoreData = async () => {
    if (loading.value || loadingMore.value || !hasNextPage.value) return

    currentPage.value++
    await loadAnime(false)
  }

  // Update search query and reload data
  const setSearchQuery = async (query: string) => {
    searchQuery.value = query
    await loadAnime(true)
  }

  // Update sort option and reload data
  const setSort = async (sort: MediaSort) => {
    selectedSort.value = sort
    await loadAnime(true)
  }

  // Update season filter and reload data
  const setSeason = async (season: MediaSeason | '') => {
    selectedSeason.value = season
    await loadAnime(true)
  }

  // Clear all filters and reload
  const clearFilters = async () => {
    searchQuery.value = ''
    selectedSort.value = MediaSort.POPULARITY_DESC
    selectedSeason.value = ''
    await loadAnime(true)
  }

  // Reset state for navigation
  const resetState = () => {
    currentAnime.value = []
    loading.value = false
    loadingMore.value = false
    error.value = ''
    currentPage.value = 1
    totalAvailable.value = 0
    hasNextPage.value = true
    cache.value = {}
  }

  // Get anime by ID from current loaded data
  const getAnimeById = (id: number): Media | undefined => {
    return currentAnime.value.find((anime) => anime.id === id)
  }

  // Load single anime details (always fetch fresh data for details)
  const loadAnimeDetails = async (id: number): Promise<Media> => {
    try {
      return await getAnimeDetails(id)
    } catch (error) {
      console.error('Error loading anime details:', error)
      throw error
    }
  }

  return {
    // State
    currentAnime: readonly(currentAnime),
    loading: readonly(loading),
    loadingMore: readonly(loadingMore),
    error: readonly(error),
    searchQuery,
    selectedSort,
    selectedSeason,
    currentPage: readonly(currentPage),
    itemsPerPage: readonly(itemsPerPage),
    totalAvailable: readonly(totalAvailable),
    hasNextPage: readonly(hasNextPage),
    cache,

    // Getters
    displayedAnime,
    hasMoreToShow,
    currentCount,

    // Exposed helpers for page-level fetching
    getApiParams,
    setLoadingFlags,
    setError,
    setPage,
    applyResult,

    // Actions (kept for backward compatibility)
    loadAnime,
    loadInitialData,
    loadMoreData,
    setSearchQuery,
    setSort,
    setSeason,
    clearFilters,
    resetState,
    getAnimeById,
    loadAnimeDetails
  }
}

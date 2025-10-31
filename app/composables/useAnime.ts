import { getAnimeDetails } from '~/utils/api/anime.api'
import type { Media, MediaSeason } from '~/utils/types/anilist'
import { MediaSort } from '~/utils/types/anilist'
import type { PageResult } from '~/utils/types/responses'
import { useAnimeState } from './useAnimeState'
import { generateCacheKey, getCachedData } from '~/utils/anime/cache'
import { filterSafeAnime } from '~/utils/anime/filters'
import { buildAnimeParams } from '~/utils/anime/params'
import { fetchAnimeData } from '~/utils/anime/dataLoader'

export const useAnime = () => {
  const state = useAnimeState()
  const {
    currentAnime,
    loading,
    loadingMore,
    error,
    searchQuery,
    selectedSort,
    selectedSeason,
    currentPage,
    itemsPerPage,
    totalAvailable,
    hasNextPage,
    cache,
    setLoadingFlags,
    setError,
    setPage,
    resetState
  } = state

  const displayedAnime = computed(() => currentAnime.value)
  const hasMoreToShow = computed(() => hasNextPage.value)
  const currentCount = computed(() => currentAnime.value.length)
  const cacheKey = computed(() =>
    generateCacheKey(searchQuery.value, selectedSort.value, selectedSeason.value)
  )

  const getApiParams = () => {
    return buildAnimeParams({
      page: currentPage.value,
      perPage: itemsPerPage.value,
      sort: selectedSort.value,
      searchQuery: searchQuery.value,
      selectedSeason: selectedSeason.value
    })
  }

  const applyResult = (result: PageResult, resetData: boolean) => {
    const previousAnime = resetData ? [] : currentAnime.value
    const filtered = filterSafeAnime(result.media ?? [])
    const newAnime = resetData ? filtered : [...previousAnime, ...filtered]

    currentAnime.value = newAnime
    totalAvailable.value = result.pageInfo?.total || 0
    hasNextPage.value = !!result.pageInfo?.hasNextPage
  }

  const loadAnime = async (resetData: boolean = false) => {
    const currentCacheKey = cacheKey.value

    if (resetData) {
      const cached = getCachedData(cache.value, currentCacheKey)
      if (cached) {
        currentAnime.value = cached.data
        hasNextPage.value = cached.hasMore
        currentPage.value = cached.page
        return
      }
    }

    await fetchAnimeData(
      {
        currentAnime,
        loading,
        loadingMore,
        error,
        selectedSeason,
        totalAvailable,
        hasNextPage,
        currentPage,
        cache,
        cacheKey: currentCacheKey
      },
      {
        resetData,
        getApiParams
      }
    )
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

    // Actions
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

import type { Media, MediaSeason } from '~/utils/types/anilist'
import { MediaSort } from '~/utils/types/anilist'
import { getCurrentSeason } from '~/utils/api/anime.api'

export const useAnimeState = () => {
  const { season } = getCurrentSeason()

  const currentAnime = useState<Media[]>('anime.currentAnime', () => [])
  const loading = useState<boolean>('anime.loading', () => false)
  const loadingMore = useState<boolean>('anime.loadingMore', () => false)
  const error = useState<string>('anime.error', () => '')
  const searchQuery = useState<string>('anime.searchQuery', () => '')
  const selectedSort = useState<string>('anime.selectedSort', () => MediaSort.POPULARITY_DESC)
  const selectedSeason = useState<MediaSeason | ''>('anime.selectedSeason', () => season)
  const currentPage = useState<number>('anime.currentPage', () => 1)
  const itemsPerPage = useState<number>('anime.itemsPerPage', () => 50)
  const totalAvailable = useState<number>('anime.totalAvailable', () => 0)
  const hasNextPage = useState<boolean>('anime.hasNextPage', () => true)
  const cache = useState<Record<string, { data: Media[]; page: number; hasMore: boolean }>>(
    'anime.cache',
    () => ({})
  )

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

  return {
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
  }
}

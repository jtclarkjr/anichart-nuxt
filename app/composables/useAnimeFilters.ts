import { refDebounced } from '@vueuse/core'
import { MediaSort } from '~/utils/types/anilist'
import type { MediaSeason } from '~/utils/types/anilist'
import type { AnimeListQueryFilters, AnimeSeasonContext } from '~/utils/types/anime'
import { getCurrentSeason } from '~/utils/helpers/date'
import { calculateSeasonYear, normalizeSearchQuery } from '~/utils/anime/params'

const ITEMS_PER_PAGE = 50
const SEARCH_DEBOUNCE = 500

export const useAnimeFilters = () => {
  const seasonContext = useState<AnimeSeasonContext>('anime.seasonContext', getCurrentSeason)
  const searchQuery = useState<string>('anime.searchQuery', () => '')
  const selectedSort = useState<MediaSort>('anime.selectedSort', () => MediaSort.POPULARITY_DESC)
  const selectedSeason = useState<MediaSeason | ''>(
    'anime.selectedSeason',
    () => seasonContext.value.season
  )
  const debouncedSearchQuery = refDebounced(searchQuery, SEARCH_DEBOUNCE)

  const normalizedFilters = computed<AnimeListQueryFilters>(() => ({
    search: normalizeSearchQuery(debouncedSearchQuery.value),
    sort: selectedSort.value,
    season: selectedSeason.value,
    seasonYear: selectedSeason.value
      ? calculateSeasonYear(selectedSeason.value, seasonContext.value)
      : null,
    perPage: ITEMS_PER_PAGE
  }))

  return {
    searchQuery,
    selectedSort,
    selectedSeason,
    debouncedSearchQuery: readonly(debouncedSearchQuery),
    normalizedFilters,
    seasonContext: readonly(seasonContext)
  }
}

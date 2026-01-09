import type { AnimeListParams, MediaSort } from '~/utils/types/anilist'
import { MediaSeason } from '~/utils/types/anilist'
import type { AnimeQueryState } from '~/utils/types/anime'
import { getCurrentSeason } from '~/utils/api/anime.api'

export const buildAnimeParams = (state: AnimeQueryState): AnimeListParams => {
  const params: AnimeListParams = {
    page: state.page,
    perPage: state.perPage,
    sort: [state.sort as MediaSort],
    isAdult: false
  }

  if (state.searchQuery.trim()) {
    params.search = state.searchQuery.trim()
  }

  if (state.selectedSeason) {
    params.season = state.selectedSeason
    params.seasonYear = calculateSeasonYear(state.selectedSeason)
  }

  return params
}

export const calculateSeasonYear = (selectedSeason: MediaSeason): number => {
  const { season: currentSeason, year } = getCurrentSeason()

  // Season year logic:
  // - If currently Winter and selecting Summer/Fall: use previous year (Winter 2026 -> Summer 2025)
  // - If currently Fall and selecting Winter: use next year (Fall 2025 -> Winter 2026)
  // - Otherwise: use current year
  if (
    currentSeason === MediaSeason.WINTER &&
    (selectedSeason === MediaSeason.SUMMER || selectedSeason === MediaSeason.FALL)
  ) {
    return year - 1
  }

  if (selectedSeason === MediaSeason.WINTER && currentSeason === MediaSeason.FALL) {
    return year + 1
  }

  return year
}

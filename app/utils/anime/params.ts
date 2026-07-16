import type { AnimeListParams } from '~/utils/types/anilist'
import { MediaSeason, MediaSort } from '~/utils/types/anilist'
import type { AnimeListQueryFilters, AnimeSeasonContext } from '~/utils/types/anime'
import { getCurrentSeason } from '~/utils/helpers/date'

export const normalizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .replace(/[\u00a0\u2000-\u200b\u2028-\u2029\u3000]/g, ' ')
    .replace(/\s+/g, ' ')
}

export const buildAnimeListParams = (
  filters: AnimeListQueryFilters,
  page: number
): AnimeListParams => {
  const search = normalizeSearchQuery(filters.search)
  const params: AnimeListParams = {
    page,
    perPage: filters.perPage,
    sort: search ? [MediaSort.SEARCH_MATCH, filters.sort] : [filters.sort],
    isAdult: false
  }

  if (search) {
    params.search = search
  }

  if (filters.season && filters.seasonYear !== null) {
    params.season = filters.season
    params.seasonYear = filters.seasonYear
  }

  return params
}

export const calculateSeasonYear = (
  selectedSeason: MediaSeason,
  context: AnimeSeasonContext = getCurrentSeason()
): number => {
  const { season: currentSeason, year } = context

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

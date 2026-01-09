import type { AnimeListParams } from '~/utils/types/anilist'
import { MediaSeason } from '~/utils/types/anilist'
import type { FallbackResult } from '~/utils/types/anime'
import { getAnimeList, getCurrentSeason } from '~/utils/api/anime.api'
import { filterSafeAnime } from './filters'

const getFallbackSeasons = (currentSeason: MediaSeason): MediaSeason[] => {
  const seasonMap: Record<MediaSeason, MediaSeason[]> = {
    [MediaSeason.WINTER]: [MediaSeason.FALL, MediaSeason.SUMMER],
    [MediaSeason.SPRING]: [MediaSeason.WINTER, MediaSeason.FALL],
    [MediaSeason.SUMMER]: [MediaSeason.SPRING, MediaSeason.WINTER],
    [MediaSeason.FALL]: [MediaSeason.SUMMER, MediaSeason.SPRING]
  }

  return seasonMap[currentSeason] || []
}

export const trySeasonalFallbacks = async (
  baseParams: AnimeListParams
): Promise<FallbackResult | null> => {
  const { season: currentSeason, year } = getCurrentSeason()
  const fallbackSeasons = getFallbackSeasons(currentSeason)

  for (const fallbackSeason of fallbackSeasons) {
    const seasonYear =
      fallbackSeason === MediaSeason.WINTER && currentSeason === MediaSeason.FALL
        ? year + 1
        : year

    const result = await getAnimeList({
      ...baseParams,
      season: fallbackSeason,
      seasonYear
    })

    if (result.media && result.media.length > 0) {
      console.log(`Found results in ${fallbackSeason} season`)
      return {
        media: filterSafeAnime(result.media),
        total: result.pageInfo?.total || 0,
        hasNextPage: result.pageInfo?.hasNextPage || false,
        usedSeason: fallbackSeason
      }
    }
  }

  return null
}

export const tryNoSeasonFallback = async (
  baseParams: AnimeListParams
): Promise<FallbackResult | null> => {
  const noSeasonParams = { ...baseParams }
  delete noSeasonParams.season
  delete noSeasonParams.seasonYear

  const result = await getAnimeList(noSeasonParams)

  if (result.media && result.media.length > 0) {
    return {
      media: filterSafeAnime(result.media),
      total: result.pageInfo?.total || 0,
      hasNextPage: result.pageInfo?.hasNextPage || false,
      usedSeason: ''
    }
  }

  return null
}

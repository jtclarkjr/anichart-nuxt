import type { Media, AnimeListParams } from '~/utils/types/anilist'
import type { PageResult } from '~/utils/types/responses'
import type { LoadContext, LoadOptions } from '~/utils/types/anime'
import { getAnimeList } from '~/utils/api/anime.api'
import { filterSafeAnime } from './filters'
import { setCacheData } from './cache'
import { trySeasonalFallbacks, tryNoSeasonFallback } from './fallbacks'

export type { LoadContext, LoadOptions }

export const handleLoadingState = (ctx: LoadContext, resetData: boolean): void => {
  if (!resetData) {
    ctx.loadingMore.value = true
    ctx.error.value = ''
  } else {
    ctx.loading.value = true
    ctx.error.value = ''
    ctx.currentPage.value = 1
  }
}

export const processAnimeResult = (
  ctx: LoadContext,
  result: PageResult,
  resetData: boolean,
  cacheKey: string
): void => {
  const previousAnime = resetData ? [] : ctx.currentAnime.value
  const filtered = filterSafeAnime(result.media)
  const newAnime = resetData ? filtered : [...previousAnime, ...filtered]

  ctx.currentAnime.value = newAnime
  ctx.totalAvailable.value = result.pageInfo?.total || 0
  ctx.hasNextPage.value = result.pageInfo?.hasNextPage || false

  setCacheData(ctx.cache.value, cacheKey, newAnime, ctx.currentPage.value, ctx.hasNextPage.value)
}

export const handleFallbackStrategies = async (
  ctx: LoadContext,
  getApiParams: () => AnimeListParams,
  resetData: boolean
): Promise<boolean> => {
  if (!resetData || !ctx.selectedSeason.value || ctx.currentAnime.value.length > 0) {
    return false
  }

  const seasonalFallback = await trySeasonalFallbacks(getApiParams())
  if (seasonalFallback) {
    ctx.currentAnime.value = seasonalFallback.media
    ctx.totalAvailable.value = seasonalFallback.total
    ctx.hasNextPage.value = seasonalFallback.hasNextPage
    if (seasonalFallback.usedSeason) {
      ctx.selectedSeason.value = seasonalFallback.usedSeason
    }
    setCacheData(
      ctx.cache.value,
      ctx.cacheKey,
      ctx.currentAnime.value,
      ctx.currentPage.value,
      ctx.hasNextPage.value
    )
    return true
  }

  const noSeasonFallback = await tryNoSeasonFallback(getApiParams())
  if (noSeasonFallback) {
    ctx.currentAnime.value = noSeasonFallback.media
    ctx.totalAvailable.value = noSeasonFallback.total
    ctx.hasNextPage.value = noSeasonFallback.hasNextPage
    ctx.selectedSeason.value = ''
    setCacheData(
      ctx.cache.value,
      ctx.cacheKey,
      ctx.currentAnime.value,
      ctx.currentPage.value,
      ctx.hasNextPage.value
    )
    return true
  }

  return false
}

export const handleLoadError = (
  ctx: LoadContext,
  err: unknown,
  resetData: boolean,
  previousAnime: Media[]
): void => {
  ctx.error.value = 'Failed to load anime data. Please try again.'
  console.error('Error loading anime data:', err)
  if (resetData && previousAnime.length === 0) {
    ctx.currentAnime.value = []
  }
}

export const finalizeLoading = (ctx: LoadContext): void => {
  ctx.loading.value = false
  ctx.loadingMore.value = false
}

export const fetchAnimeData = async (ctx: LoadContext, opts: LoadOptions): Promise<void> => {
  const currentCacheKey = ctx.cacheKey
  const previousAnime = opts.resetData ? [] : ctx.currentAnime.value

  handleLoadingState(ctx, opts.resetData)

  try {
    const result = await getAnimeList(opts.getApiParams())

    if (!result.media || result.media.length === 0) {
      const fallbackHandled = await handleFallbackStrategies(ctx, opts.getApiParams, opts.resetData)
      if (fallbackHandled) {
        return
      }
    }

    processAnimeResult(ctx, result, opts.resetData, currentCacheKey)
  } catch (err) {
    handleLoadError(ctx, err, opts.resetData, previousAnime)
  } finally {
    finalizeLoading(ctx)
  }
}

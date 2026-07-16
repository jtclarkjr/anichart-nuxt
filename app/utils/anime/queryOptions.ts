import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/vue-query'
import { getAnimeDetails, getAnimeList } from '~/utils/api/anime.api'
import type { Page } from '~/utils/types/anilist'
import type { AnimeListQueryFilters } from '~/utils/types/anime'
import { buildAnimeListParams } from './params'
import { animeQueryKeys } from './queryKeys'

export const ANIME_INITIAL_PAGE = 1

export const getNextAnimePageParam = (lastPage: Page): number | undefined => {
  return lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.currentPage + 1 : undefined
}

export const animeListQueryOptions = (filters: AnimeListQueryFilters) => {
  return infiniteQueryOptions({
    queryKey: animeQueryKeys.list(filters),
    queryFn: ({ pageParam, signal }) => {
      return getAnimeList(buildAnimeListParams(filters, pageParam), { signal })
    },
    initialPageParam: ANIME_INITIAL_PAGE,
    getNextPageParam: getNextAnimePageParam,
    placeholderData: keepPreviousData,
    throwOnError: false
  })
}

export const animeDetailsQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: animeQueryKeys.detail(id),
    queryFn: ({ signal }) => getAnimeDetails(id, { signal }),
    enabled: Number.isInteger(id) && id > 0,
    throwOnError: false
  })
}

import { useInfiniteQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import { animeListQueryOptions } from '~/utils/anime/queryOptions'
import type { AnimeListQueryFilters } from '~/utils/types/anime'

export const useAnimeListQuery = (filters: MaybeRefOrGetter<AnimeListQueryFilters>) => {
  const query = useInfiniteQuery(computed(() => animeListQueryOptions(toValue(filters))))

  const anime = computed(() => query.data.value?.pages.flatMap((page) => page.media) ?? [])
  const loadedCount = computed(() => anime.value.length)
  const totalAvailable = computed(() => query.data.value?.pages[0]?.pageInfo.total ?? 0)
  const errorMessage = computed(() => {
    return query.isError.value && anime.value.length === 0
      ? 'Failed to load anime data. Please try again.'
      : ''
  })

  return {
    ...query,
    anime,
    loadedCount,
    totalAvailable,
    errorMessage
  }
}

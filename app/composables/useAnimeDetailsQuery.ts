import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import { animeDetailsQueryOptions } from '~/utils/anime/queryOptions'

export const useAnimeDetailsQuery = (id: MaybeRefOrGetter<number>) => {
  const animeId = computed(() => toValue(id))

  return useQuery(computed(() => animeDetailsQueryOptions(animeId.value)))
}

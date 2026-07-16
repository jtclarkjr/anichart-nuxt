import type { AnimeListQueryFilters } from '~/utils/types/anime'

export const animeQueryKeys = {
  all: ['anime'] as const,
  lists: () => [...animeQueryKeys.all, 'list'] as const,
  list: (filters: AnimeListQueryFilters) =>
    [
      ...animeQueryKeys.lists(),
      {
        search: filters.search,
        sort: filters.sort,
        season: filters.season,
        seasonYear: filters.seasonYear,
        perPage: filters.perPage
      }
    ] as const,
  details: () => [...animeQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...animeQueryKeys.details(), id] as const
}

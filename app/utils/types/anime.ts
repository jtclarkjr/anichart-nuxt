import type { MediaSeason, MediaSort } from './anilist'
import type { Nullable } from './shared'

export interface AnimeSeasonContext {
  season: MediaSeason
  year: number
}

export interface AnimeListQueryFilters {
  search: string
  sort: MediaSort
  season: MediaSeason | ''
  seasonYear: Nullable<number>
  perPage: number
}

export interface AnimeApiRequestOptions {
  signal?: AbortSignal
}

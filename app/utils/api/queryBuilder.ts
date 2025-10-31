import type {
  AnimeListParams,
  MediaSeason,
  MediaFormat,
  MediaStatus,
  MediaSort
} from '../types/anilist'

interface QueryBuilder {
  page: (page: number) => QueryBuilder
  perPage: (perPage: number) => QueryBuilder
  search: (search: string) => QueryBuilder
  genre: (genre: string) => QueryBuilder
  season: (season: MediaSeason, year: number) => QueryBuilder
  format: (format: MediaFormat) => QueryBuilder
  status: (status: MediaStatus) => QueryBuilder
  sort: (sort: MediaSort[]) => QueryBuilder
  adultContent: (isAdult?: boolean) => QueryBuilder
  build: () => AnimeListParams
}

export const createAnimeQuery = (): QueryBuilder => {
  const params: Partial<AnimeListParams> = {}

  const builder: QueryBuilder = {
    page: (page: number) => {
      params.page = page
      return builder
    },
    perPage: (perPage: number) => {
      params.perPage = perPage
      return builder
    },
    search: (search: string) => {
      params.search = search
      return builder
    },
    genre: (genre: string) => {
      params.genre = genre
      return builder
    },
    season: (season: MediaSeason, year: number) => {
      params.season = season
      params.seasonYear = year
      return builder
    },
    format: (format: MediaFormat) => {
      params.format = format
      return builder
    },
    status: (status: MediaStatus) => {
      params.status = status
      return builder
    },
    sort: (sort: MediaSort[]) => {
      params.sort = sort
      return builder
    },
    adultContent: (isAdult: boolean = false) => {
      params.isAdult = isAdult
      return builder
    },
    build: () => ({ ...params })
  }

  return builder
}

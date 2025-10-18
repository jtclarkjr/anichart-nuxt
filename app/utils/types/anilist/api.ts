import type { MediaSort, MediaSeason, MediaFormat, MediaStatus } from './enums'
import type { Media } from './media'
import type { Page } from './pagination'

export interface AnimeListParams {
  page?: number
  perPage?: number
  sort?: MediaSort[]
  search?: string
  genre?: string
  season?: MediaSeason
  seasonYear?: number
  format?: MediaFormat
  status?: MediaStatus
  isAdult?: boolean
}

export interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{
      line: number
      column: number
    }>
    path?: string[]
  }>
}

export interface AnimeListResponse {
  Page: Page
}

export interface AnimeDetailsResponse {
  Media: Media
}

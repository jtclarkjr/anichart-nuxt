import type { Media } from './media'

export interface PageInfo {
  total: number
  currentPage: number
  lastPage: number
  hasNextPage: boolean
  perPage: number
}

export interface Page {
  pageInfo: PageInfo
  media: Media[]
}

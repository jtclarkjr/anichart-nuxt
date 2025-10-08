import type { Ref } from 'vue'
import type { Media, AnimeListParams } from './anilist'

export interface AnimeState {
  currentAnime: Media[]
  loading: boolean
  loadingMore: boolean
  error: string
  searchQuery: string
  selectedSort: string
  selectedSeason: string
  currentPage: number
  itemsPerPage: number
  totalAvailable: number
  hasNextPage: boolean
  cache: Record<string, { data: Media[]; page: number; hasMore: boolean }>
}

export interface LoadContext {
  currentAnime: Ref<Media[]>
  loading: Ref<boolean>
  loadingMore: Ref<boolean>
  error: Ref<string>
  selectedSeason: Ref<string>
  totalAvailable: Ref<number>
  hasNextPage: Ref<boolean>
  currentPage: Ref<number>
  cache: Ref<Record<string, { data: Media[]; page: number; hasMore: boolean }>>
  cacheKey: string
}

export interface LoadOptions {
  resetData: boolean
  getApiParams: () => AnimeListParams
}

export interface AnimeQueryState {
  page: number
  perPage: number
  sort: string
  searchQuery: string
  selectedSeason: string
}

export interface CacheEntry {
  data: Media[]
  page: number
  hasMore: boolean
}

export interface FallbackResult {
  media: Media[]
  total: number
  hasNextPage: boolean
  usedSeason?: string
}

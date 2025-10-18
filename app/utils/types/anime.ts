import type { Ref } from 'vue'
import type { Media, AnimeListParams } from './anilist'
import type { MediaSeason } from './anilist/enums'

export interface AnimeState {
  currentAnime: Media[]
  loading: boolean
  loadingMore: boolean
  error: string
  searchQuery: string
  selectedSort: string
  selectedSeason: MediaSeason | ''
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
  selectedSeason: Ref<MediaSeason | ''>
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
  selectedSeason: MediaSeason | ''
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
  usedSeason?: MediaSeason | ''
}

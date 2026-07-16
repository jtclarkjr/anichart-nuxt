import type { Media, MediaSeason, MediaSort } from '~/utils/types/anilist'
import type { AnimeSeasonContext } from '~/utils/types/anime'

/**
 * Props for components that display a single anime/media item
 */
export interface AnimeCardProps {
  anime: Media
}

/**
 * Props for components that display anime metadata
 */
export interface AnimeMetadataProps {
  anime: Media
}

/**
 * Props for components that display anime banner
 */
export interface AnimeBannerProps {
  anime: Media
}

/**
 * Props for components that display anime description
 */
export interface AnimeDescriptionProps {
  anime: Media
}

export interface AnimeGridProps {
  anime: Media[]
  loading: boolean
  loadingMore?: boolean
  error: string
  hasData: boolean
  hasMoreToShow: boolean
  totalCount: number
}

export interface AnimeGridEmits {
  animeClick: [id: number]
  retry: []
  loadMore: []
}

export interface SearchFiltersProps {
  searchQuery: string
  selectedSort: MediaSort
  selectedSeason: MediaSeason | ''
  seasonContext: AnimeSeasonContext
  loading?: boolean
}

export interface SearchFiltersEmits {
  'update:searchQuery': [value: string]
  'update:selectedSort': [value: MediaSort]
  'update:selectedSeason': [value: MediaSeason | '']
  filterChange: []
}

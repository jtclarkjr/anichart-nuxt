import type { Media } from '~/utils/types/anilist'

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

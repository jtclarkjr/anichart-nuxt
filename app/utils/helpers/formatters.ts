import type { Nullable } from '../types/shared'
import type { MediaTitle, MediaCoverImage, MediaDate } from '../types/anilist'
import { MediaStatus } from '../types/anilist'

export const getDisplayTitle = (title: MediaTitle): string => {
  return title.english || title.romaji || title.native || 'Unknown Title'
}

export const getSafeImageUrl = (
  coverImage: Pick<MediaCoverImage, 'extraLarge' | 'large' | 'medium'>
): string | undefined => {
  return coverImage.extraLarge || coverImage.large || coverImage.medium || undefined
}

export const formatScore = (score: Nullable<number>): string => {
  if (!score) return 'N/A'
  return `${score}%`
}

export const formatYear = (startDate: Nullable<MediaDate>): string => {
  if (!startDate?.year) return 'TBA'
  return startDate.year.toString()
}

export const formatStatus = (status: Nullable<MediaStatus>): string => {
  if (!status) return 'Unknown'

  switch (status) {
    case MediaStatus.FINISHED:
      return 'Completed'
    case MediaStatus.RELEASING:
      return 'Airing'
    case MediaStatus.NOT_YET_RELEASED:
      return 'Upcoming'
    case MediaStatus.CANCELLED:
      return 'Cancelled'
    case MediaStatus.HIATUS:
      return 'Hiatus'
    default:
      return status
  }
}

export const formatters = {
  displayTitle: getDisplayTitle,
  imageUrl: getSafeImageUrl,
  score: formatScore,
  year: formatYear,
  status: formatStatus
}

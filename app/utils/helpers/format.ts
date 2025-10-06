import { MediaFormat } from '../types/anilist'

/**
 * Format media format for display (converts underscores to spaces)
 */
export const formatMediaFormat = (format: MediaFormat | null): string => {
  if (!format) return 'Unknown'

  // Replace underscores with spaces for better display
  return format.replace(/_/g, ' ')
}

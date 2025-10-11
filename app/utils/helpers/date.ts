import { MediaSeason } from '~/utils/types/anilist/enums'

/**
 * Gets the current season and year based on the current date
 * @returns Object containing the current season and year
 */
export const getCurrentSeason = () => {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  let season: MediaSeason
  switch (month) {
    case 12:
    case 1:
    case 2:
      season = MediaSeason.WINTER
      break
    case 3:
    case 4:
    case 5:
      season = MediaSeason.SPRING
      break
    case 6:
    case 7:
    case 8:
      season = MediaSeason.SUMMER
      break
    default:
      season = MediaSeason.FALL
      break
  }

  return { season, year }
}
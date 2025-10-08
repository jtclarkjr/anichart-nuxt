import type { Media } from '~/utils/types/anilist'

const BANNED_GENRES = new Set(['adult', 'hentai'])

export const filterSafeAnime = (list: Media[] = []): Media[] => {
  return list.filter((media) => {
    if (media.isAdult) return false

    const genres = (media.genres || []).map((genre) => genre.toLowerCase())
    return !genres.some((genre) => BANNED_GENRES.has(genre))
  })
}

import type { MediaSeason, MediaType, MediaFormat, MediaStatus, MediaSource } from './enums'

export interface MediaTitle {
  romaji: string | null
  english: string | null
  native: string | null
}

export interface MediaCoverImage {
  extraLarge: string | null
  large: string | null
  medium: string | null
  color: string | null
}

export interface MediaDate {
  year: number | null
  month: number | null
  day: number | null
}

export interface Studio {
  id: number
  name: string
}

export interface StudioConnection {
  nodes: Studio[]
}

export interface GenreStats {
  count: number
  meanScore: number
  genre: string
}

export interface Media {
  id: number
  title: MediaTitle
  description: string | null
  startDate: MediaDate | null
  endDate: MediaDate | null
  season: MediaSeason | null
  seasonYear: number | null
  type: MediaType
  format: MediaFormat | null
  status: MediaStatus | null
  episodes: number | null
  duration: number | null
  chapters: number | null
  volumes: number | null
  genres: string[]
  averageScore: number | null
  meanScore: number | null
  popularity: number | null
  favourites: number | null
  hashtag: string | null
  isAdult: boolean
  countryOfOrigin: string | null
  coverImage: MediaCoverImage
  bannerImage: string | null
  studios: StudioConnection | null
  source: MediaSource | null
}

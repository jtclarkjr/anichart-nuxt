import type { MediaSeason, MediaType, MediaFormat, MediaStatus, MediaSource } from './enums'
import type { Nullable } from '../shared'

export interface MediaTitle {
  romaji: Nullable<string>
  english: Nullable<string>
  native: Nullable<string>
}

export interface MediaCoverImage {
  extraLarge: Nullable<string>
  large: Nullable<string>
  medium: Nullable<string>
  color: Nullable<string>
}

export interface MediaDate {
  year: Nullable<number>
  month: Nullable<number>
  day: Nullable<number>
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
  description: Nullable<string>
  startDate: Nullable<MediaDate>
  endDate: Nullable<MediaDate>
  season: Nullable<MediaSeason>
  seasonYear: Nullable<number>
  type: MediaType
  format: Nullable<MediaFormat>
  status: Nullable<MediaStatus>
  episodes: Nullable<number>
  duration: Nullable<number>
  chapters: Nullable<number>
  volumes: Nullable<number>
  genres: string[]
  averageScore: Nullable<number>
  meanScore: Nullable<number>
  popularity: Nullable<number>
  favourites: Nullable<number>
  hashtag: Nullable<string>
  isAdult: boolean
  countryOfOrigin: Nullable<string>
  coverImage: MediaCoverImage
  bannerImage: Nullable<string>
  studios: Nullable<StudioConnection>
  source: Nullable<MediaSource>
}

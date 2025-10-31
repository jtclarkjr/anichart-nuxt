import type { Media } from './anilist'
import type { Nullable } from './shared'

/**
 * Represents a page of media results from the API
 * Used for handling partial/incomplete API responses
 */
export interface PageResult {
  media?: Media[]
  pageInfo?: {
    total?: Nullable<number>
    hasNextPage?: Nullable<boolean>
  }
}

/**
 * Makes a type nullable (T | null)
 * Reduces repetition of `| null` throughout the codebase
 */
export type Nullable<T> = T | null

/**
 * Makes all properties of T nullable
 */
export type NullableProperties<T> = {
  [P in keyof T]: Nullable<T[P]>
}

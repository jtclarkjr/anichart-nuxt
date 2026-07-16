interface AnimeApiErrorOptions {
  cause?: unknown
  retryable: boolean
  statusCode?: number
}

export class AnimeApiError extends Error {
  readonly retryable: boolean
  readonly statusCode?: number

  constructor(message: string, options: AnimeApiErrorOptions) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause })
    this.name = 'AnimeApiError'
    this.retryable = options.retryable
    this.statusCode = options.statusCode
  }
}

const getErrorRecord = (error: unknown): Record<string, unknown> | undefined => {
  return typeof error === 'object' && error !== null
    ? (error as Record<string, unknown>)
    : undefined
}

const getStatusCode = (error: unknown, depth: number = 0): number | undefined => {
  if (depth > 3) return undefined

  const record = getErrorRecord(error)
  if (!record) return undefined

  const statusCode = record.statusCode ?? record.status
  if (typeof statusCode === 'number') return statusCode

  return getStatusCode(record.cause, depth + 1)
}

export const isAbortError = (error: unknown, depth: number = 0): boolean => {
  if (depth > 3) return false

  const record = getErrorRecord(error)
  if (!record) return false
  if (record.name === 'AbortError') return true

  return isAbortError(record.cause, depth + 1)
}

const getErrorMessage = (error: unknown): string => {
  const record = getErrorRecord(error)
  return typeof record?.message === 'string' ? record.message : 'Unknown error'
}

export const toAnimeApiError = (error: unknown, message: string): AnimeApiError => {
  if (error instanceof AnimeApiError) return error

  const statusCode = getStatusCode(error)
  const retryable =
    !isAbortError(error) &&
    (statusCode === undefined || statusCode === 408 || statusCode === 429 || statusCode >= 500)

  return new AnimeApiError(`${message}: ${getErrorMessage(error)}`, {
    cause: error,
    retryable,
    statusCode
  })
}

export const isRetryableAnimeError = (error: unknown): boolean => {
  if (error instanceof AnimeApiError) return error.retryable
  return !isAbortError(error)
}

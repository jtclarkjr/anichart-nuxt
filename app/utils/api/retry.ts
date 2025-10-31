import { NetworkError } from './errors'

export interface RetryOptions {
  maxRetries?: number
  delay?: number
  exponentialBackoff?: boolean
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  delay: 1000,
  exponentialBackoff: true
}

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const opts = { ...defaultOptions, ...options }
  let lastError: Error

  for (let attempt = 0; attempt < opts.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      // Check if this is a rate limit error (429)
      const isRateLimit =
        error instanceof Error &&
        (error.message.includes('429') || error.message.includes('Too Many Requests'))

      // Don't retry on rate limit errors - throw immediately
      if (isRateLimit) {
        throw new NetworkError('Rate limit exceeded. Please wait a moment and try again.', error)
      }

      if (attempt < opts.maxRetries - 1) {
        const delayTime = opts.exponentialBackoff ? opts.delay * Math.pow(2, attempt) : opts.delay

        if (import.meta.dev) {
          console.log(
            `[Retry] Attempt ${attempt + 1}/${opts.maxRetries} failed. Retrying in ${delayTime}ms...`
          )
        }

        await new Promise((resolve) => setTimeout(resolve, delayTime))
      }
    }
  }

  throw new NetworkError(`Failed after ${opts.maxRetries} attempts`, lastError!)
}

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

interface ApiCache {
  get: <T>(key: string) => T | null
  set: <T>(key: string, data: T, ttl?: number) => void
  has: (key: string) => boolean
  delete: (key: string) => boolean
  clear: () => void
  invalidate: (pattern: string | RegExp) => number
  size: () => number
  keys: () => string[]
}

const createApiCache = (): ApiCache => {
  const cache = new Map<string, CacheEntry<unknown>>()

  return {
    get: <T>(key: string): T | null => {
      const entry = cache.get(key) as CacheEntry<T> | undefined
      if (!entry) return null

      if (Date.now() - entry.timestamp > entry.ttl) {
        cache.delete(key)
        return null
      }

      return entry.data
    },

    set: <T>(key: string, data: T, ttl: number = 300000): void => {
      cache.set(key, { data, timestamp: Date.now(), ttl })
    },

    has: (key: string): boolean => {
      const entry = cache.get(key)
      if (!entry) return false

      if (Date.now() - entry.timestamp > entry.ttl) {
        cache.delete(key)
        return false
      }

      return true
    },

    delete: (key: string): boolean => {
      return cache.delete(key)
    },

    clear: (): void => {
      cache.clear()
    },

    invalidate: (pattern: string | RegExp): number => {
      let count = 0
      for (const key of cache.keys()) {
        if (typeof pattern === 'string' ? key.includes(pattern) : pattern.test(key)) {
          cache.delete(key)
          count++
        }
      }
      return count
    },

    size: (): number => {
      return cache.size
    },

    keys: (): string[] => {
      return Array.from(cache.keys())
    }
  }
}

export const apiCache = createApiCache()

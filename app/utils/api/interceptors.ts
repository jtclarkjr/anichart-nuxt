export interface RequestLog {
  query: string
  variables: unknown
  timestamp: number
}

export interface ResponseLog {
  duration: number
  hasData: boolean
  timestamp: number
}

export const logRequest = (query: string, variables: unknown): RequestLog => {
  const log: RequestLog = {
    query: query.slice(0, 100),
    variables,
    timestamp: Date.now()
  }

  if (import.meta.dev) {
    console.log('[API Request]', log)
  }

  return log
}

export const logResponse = <T>(data: T, startTime: number): ResponseLog => {
  const log: ResponseLog = {
    duration: Date.now() - startTime,
    hasData: !!data,
    timestamp: Date.now()
  }

  if (import.meta.dev) {
    console.log('[API Response]', { duration: `${log.duration}ms`, hasData: log.hasData })
  }

  return log
}

export const logError = (error: unknown, context: string): void => {
  if (import.meta.dev) {
    console.error(`[API Error - ${context}]`, error)
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NetworkError extends ApiError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'NETWORK_ERROR', undefined, originalError)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

export class GraphQLError extends ApiError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'GRAPHQL_ERROR', undefined, originalError)
    this.name = 'GraphQLError'
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_ERROR', 429)
    this.name = 'RateLimitError'
  }
}

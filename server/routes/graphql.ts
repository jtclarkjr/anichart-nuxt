interface GraphQLRequest {
  query: string
  variables?: Record<string, unknown>
  operationName?: string
}

const isValidGraphQLRequest = (body: unknown): body is GraphQLRequest => {
  return (
    !!body &&
    typeof body === 'object' &&
    'query' in body &&
    typeof (body as GraphQLRequest).query === 'string' &&
    (body as GraphQLRequest).query.trim().length > 0
  )
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Handle GET requests for GraphQL playground or schema introspection
  if (event.method === 'GET') {
    return {
      message: 'GraphQL endpoint - use POST with query and variables',
      endpoint: '/graphql',
      methods: ['POST']
    }
  }

  // Only allow POST requests for GraphQL queries
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    const body = await readBody(event)

    // Validate request body
    if (!isValidGraphQLRequest(body)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid GraphQL request - query is required and must be a non-empty string'
      })
    }

    // Validate variables if provided
    if (body.variables && typeof body.variables !== 'object') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid GraphQL request - variables must be an object'
      })
    }

    // Forward the request to AniList API
    const response = await $fetch(config.public.anilistApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    })

    return response
  } catch (error) {
    // If error is already a Nuxt error, rethrow it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Log the error for debugging
    console.error('[GraphQL Proxy Error]', error)

    // Handle network errors
    if (error instanceof Error) {
      if (error.message.includes('fetch') || error.message.includes('ECONNREFUSED')) {
        throw createError({
          statusCode: 503,
          statusMessage: 'Service Unavailable - Unable to reach AniList API'
        })
      }
    }

    // Generic error fallback
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error - Failed to process GraphQL request'
    })
  }
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (event.method === 'POST') {
    const body = await readBody(event)

    const response = await $fetch(config.public.anilistApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    })

    return response
  }

  // Handle GET requests for GraphQL playground or schema introspection
  if (event.method === 'GET') {
    return {
      message: 'GraphQL endpoint - use POST with query and variables',
      endpoint: '/graphql',
      methods: ['POST']
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed'
  })
})

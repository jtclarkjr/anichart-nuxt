import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'
import fetch from 'cross-fetch'

export default defineNuxtPlugin(() => {
  // eslint-disable-next-line no-unused-vars
  const _config = useRuntimeConfig()
  // Route all client requests through our internal API to avoid CORS and expose SSR
  const uri = '/graphql'

  const httpLink = new HttpLink({ uri, fetch })

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    ssrMode: import.meta.server
  })

  return {
    provide: {
      apollo: apolloClient
    }
  }
})

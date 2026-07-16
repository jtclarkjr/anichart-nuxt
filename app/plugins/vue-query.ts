import type { DehydratedState, VueQueryPluginOptions } from '@tanstack/vue-query'
import { QueryClient, VueQueryPlugin, dehydrate, hydrate } from '@tanstack/vue-query'
import { isRetryableAnimeError } from '~/utils/api/errors'

const STALE_TIME = 5 * 60 * 1000
const GC_TIME = 30 * 60 * 1000

export default defineNuxtPlugin((nuxtApp) => {
  const vueQueryState = useState<DehydratedState | null>('vue-query', () => null)
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME,
        gcTime: import.meta.server ? Infinity : GC_TIME,
        retry: (failureCount, error) => {
          return import.meta.client && failureCount < 2 && isRetryableAnimeError(error)
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        throwOnError: false
      }
    }
  })
  const options: VueQueryPluginOptions = { queryClient }

  nuxtApp.vueApp.use(VueQueryPlugin, options)

  if (import.meta.server) {
    nuxtApp.hooks.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient)
      queryClient.clear()
    })
  } else if (vueQueryState.value) {
    hydrate(queryClient, vueQueryState.value)
  }
})

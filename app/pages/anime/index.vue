<template>
  <div class="min-h-screen bg-background">
    <div class="sticky top-0 z-[100] py-6 bg-muted/40 border-b border-border backdrop-blur-[10px]">
      <div class="w-full max-w-[1200px] px-4 mx-auto">
        <h1 class="text-3xl font-bold text-primary text-center mb-0 md:mb-4 md:text-left">
          AniChart
        </h1>
        <SearchFilters
          v-model:search-query="searchQuery"
          v-model:selected-sort="selectedSort"
          v-model:selected-season="selectedSeason"
          :loading="loading"
          @filter-change="handleFilterChange"
          @update:search-query="handleSearch"
        />
      </div>
    </div>

    <div class="w-full max-w-[1200px] px-4 mx-auto">
      <AnimeGrid
        ref="animeGridRef"
        :anime="displayedAnime"
        :loading="loading"
        :loading-more="loadingMore"
        :error="error"
        :has-data="currentAnime.length > 0"
        :has-more-to-show="hasMoreToShow"
        :total-count="currentCount"
        @anime-click="goToDetails"
        @retry="retryLoad"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import debounce from '~/utils/helpers/debounce'
import { getCurrentSeason } from '~/utils/helpers/date'
import { useAnime } from '~/composables/useAnime'
import { GET_ANIME_LIST } from '~/utils/api/queries'
import { MediaSeason, MediaSort } from '~/utils/types/anilist'
import type { AnimeListResponse, GraphQLResponse } from '~/utils/types/anilist'
import AnimeGrid from '~/components/AnimeGrid.vue'

const {
  currentAnime,
  displayedAnime,
  loading,
  loadingMore,
  error,
  hasMoreToShow,
  currentCount,
  searchQuery,
  selectedSort,
  selectedSeason,
  // state management helpers
  setLoadingFlags,
  setError,
  setPage,
  applyResult,
  currentPage,
  itemsPerPage
} = useAnime()

// Navigation
const goToDetails = (id: number) => navigateTo(`/anime/${id}`)

// Handle filter changes
const handleFilterChange = () => {
  if (import.meta.client) window.scrollTo(0, 0)
}

const handleSearch = debounce(() => {
  if (import.meta.client) window.scrollTo(0, 0)
}, 500) // Reduced from 1000ms to 500ms for better responsiveness

// Reference to the AnimeGrid component
const animeGridRef = ref<InstanceType<typeof AnimeGrid> | null>(null)
// Don't store complex objects in useState - they cause serialization issues
let observer: IntersectionObserver | null = null
let scrollListener: ((event: Event) => void) | null = null

// Reset scroll position on initial mount
onBeforeMount(() => {
  if (import.meta.client) {
    window.scrollTo(0, 0)
  }
})

const setupShowMore = () => {
  // Only run on client
  if (!import.meta.client) return

  cleanupObserver()
  const loadTrigger = animeGridRef.value?.loadTrigger
  if (!loadTrigger) {
    setTimeout(setupShowMore, 100)
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting && hasMoreToShow.value && !loading.value && !loadingMore.value) {
        loadMore()
      }
    },
    { root: null, rootMargin: '200px', threshold: 0.1 }
  )

  observer.observe(loadTrigger)
  setupScrollFallback()
}

const setupScrollFallback = () => {
  // Only run on client
  if (!import.meta.client) return

  if (scrollListener) window.removeEventListener('scroll', scrollListener)
  scrollListener = () => {
    const scrollHeight = document.documentElement.scrollHeight
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      if (hasMoreToShow.value && !loading.value && !loadingMore.value) {
        loadMore()
      }
    }
  }
  window.addEventListener('scroll', scrollListener, { passive: true })
}

const cleanupObserver = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (scrollListener && import.meta.client) {
    window.removeEventListener('scroll', scrollListener)
    scrollListener = null
  }
}

// Build GraphQL variables from current state
const buildVariables = (pageNum?: number) => {
  const variables: Record<string, string | number | string[]> = {
    page: pageNum || currentPage.value,
    perPage: itemsPerPage.value,
    sort: searchQuery.value.trim()
      ? [MediaSort.SEARCH_MATCH, selectedSort.value]
      : [selectedSort.value]
  }

  if (searchQuery.value.trim()) {
    // Clean and normalize search query for better matching
    const cleanedQuery = searchQuery.value
      .trim()
      .replace(/[\u00a0\u2000-\u200b\u2028-\u2029\u3000]/g, ' ') // Replace various whitespace chars
      .replace(/\s+/g, ' ') // Normalize multiple spaces to single space

    variables.search = cleanedQuery
  }

  if (selectedSeason.value) {
    variables.season = selectedSeason.value
    const { season: currentSeason, year } = getCurrentSeason()
    variables.seasonYear =
      selectedSeason.value === 'WINTER' && currentSeason === MediaSeason.FALL ? year + 1 : year
  }

  return variables
}

// Direct API call - simplified
const fetchAnime = async (resetData: boolean) => {
  try {
    if (resetData) setPage(1)
    setLoadingFlags(resetData, !resetData)
    setError('')

    const variables = buildVariables(resetData ? 1 : undefined)

    // Direct call to our server endpoint
    const response = await $fetch<GraphQLResponse<AnimeListResponse>>('/graphql', {
      method: 'POST',
      body: {
        query: GET_ANIME_LIST,
        variables
      }
    })

    // Handle GraphQL errors
    if (response.errors && response.errors.length > 0) {
      console.error('GraphQL errors:', response.errors)
      throw error
    }

    if (!response?.data?.Page) {
      console.error('Invalid response structure:', response)
      throw error
    }

    applyResult(response.data.Page, resetData)
  } catch (e) {
    console.error('Page-level fetch failed:', e)
    setError('Failed to load anime data. Please try again.')
  } finally {
    setLoadingFlags(false, false)
  }
}

// Infinite scroll / load more now fetches at page-level
const loadMore = async () => {
  if (hasMoreToShow.value && !loading.value && !loadingMore.value) {
    // Increment page for load more
    const nextPage = Math.floor(currentAnime.value.length / 50) + 1
    setPage(nextPage)
    await fetchAnime(false)
  }
}

// Retry handler for grid component
const retryLoad = async () => {
  await fetchAnime(true)
}

// SSR Data fetching using useAsyncData - page-level
await useAsyncData('anime-initial', async () => {
  await fetchAnime(true)
  return { count: currentCount.value }
})

// Set up reactive watchers for filter changes (page-level fetch)
watch(searchQuery, async () => {
  await fetchAnime(true)
})

watch(selectedSort, async () => {
  await fetchAnime(true)
})

watch(selectedSeason, async () => {
  await fetchAnime(true)
})

onMounted(async () => {
  await nextTick()
  await nextTick()
  setupShowMore()
})

onUnmounted(() => cleanupObserver())
</script>

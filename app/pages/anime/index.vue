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
          :season-context="seasonContext"
          :loading="loading"
          @filter-change="handleFilterChange"
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
        :total-count="totalAvailable"
        @anime-click="goToDetails"
        @retry="retryLoad"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnimeFilters } from '~/composables/useAnimeFilters'
import { useAnimeListQuery } from '~/composables/useAnimeListQuery'
import AnimeGrid from '~/components/AnimeGrid.vue'

const {
  searchQuery,
  selectedSort,
  selectedSeason,
  debouncedSearchQuery,
  normalizedFilters,
  seasonContext
} = useAnimeFilters()

const animeQuery = useAnimeListQuery(normalizedFilters)
const currentAnime = animeQuery.anime
const displayedAnime = currentAnime
const loadingMore = animeQuery.isFetchingNextPage
const error = animeQuery.errorMessage
const currentCount = animeQuery.loadedCount
const totalAvailable = animeQuery.totalAvailable
const hasMoreToShow = computed(() => Boolean(animeQuery.hasNextPage.value))
const loading = computed(() => {
  return (
    animeQuery.isPending.value ||
    (animeQuery.isFetching.value && !animeQuery.isFetchingNextPage.value)
  )
})

// Navigation
const goToDetails = (id: number) => navigateTo(`/anime/${id}`)

// Handle filter changes
const handleFilterChange = () => {
  if (import.meta.client) window.scrollTo(0, 0)
}

// Reference to the AnimeGrid component
const animeGridRef = ref<InstanceType<typeof AnimeGrid> | null>(null)
// Don't store complex objects in useState - they cause serialization issues
let observer: IntersectionObserver | null = null
let scrollListener: ((event: Event) => void) | null = null
let setupTimer: ReturnType<typeof setTimeout> | null = null

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
    setupTimer = setTimeout(setupShowMore, 100)
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting && hasMoreToShow.value && !loading.value && !loadingMore.value) {
        void loadMore()
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
        void loadMore()
      }
    }
  }
  window.addEventListener('scroll', scrollListener, { passive: true })
}

const cleanupObserver = () => {
  if (setupTimer) {
    clearTimeout(setupTimer)
    setupTimer = null
  }
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (scrollListener && import.meta.client) {
    window.removeEventListener('scroll', scrollListener)
    scrollListener = null
  }
}

const loadMore = async () => {
  if (hasMoreToShow.value && !animeQuery.isFetching.value) {
    await animeQuery.fetchNextPage()
  }
}

// Retry handler for grid component
const retryLoad = async () => {
  await animeQuery.refetch()
}

onServerPrefetch(() => animeQuery.suspense())

watch(debouncedSearchQuery, handleFilterChange)
watch(animeQuery.dataUpdatedAt, async () => {
  await nextTick()
  setupShowMore()
})

onMounted(async () => {
  await nextTick()
  await nextTick()
  setupShowMore()
})

onUnmounted(() => cleanupObserver())
</script>

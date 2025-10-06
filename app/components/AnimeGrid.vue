<template>
  <div
    class="w-full relative transition-opacity duration-300"
    :class="{ 'opacity-70 pointer-events-none': loading && hasData }"
  >
    <!-- Consistent rendering for SSR/CSR hydration -->
    <div
      v-if="shouldShowLoading"
      class="flex flex-col items-center justify-center p-12 text-muted-foreground"
    >
      <Spinner class="w-10 h-10 mb-4" />
      <p>Loading anime...</p>
    </div>

    <div v-else-if="error" class="p-8 text-destructive text-center">
      <p>{{ error }}</p>
      <Button class="mt-4" @click="$emit('retry')">Retry</Button>
    </div>

    <div v-else-if="shouldShowEmpty" class="p-12 text-lg text-muted-foreground text-center">
      <p>No anime found</p>
    </div>

    <div v-else-if="shouldShowGrid" class="py-4 transition-opacity duration-300">
      <TransitionGroup
        name="anime-card"
        tag="div"
        class="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:gap-6 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:gap-8 xl:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]"
        appear
      >
        <AnimeCard
          v-for="item in anime"
          :key="item.id"
          :anime="item"
          @click="$emit('animeClick', $event)"
        />
      </TransitionGroup>
    </div>

    <div
      v-if="hasMoreToShow"
      ref="loadTrigger"
      class="p-8 text-sm text-muted-foreground text-center"
    >
      <div
        v-if="loadingMore"
        class="flex gap-2 items-center justify-center p-4 text-muted-foreground"
      >
        <Spinner class="w-5 h-5" />
        <p>Loading more anime...</p>
      </div>
      <div v-else class="p-4 border-t border-border">
        <p>Showing {{ anime.length }} of {{ totalCount }} anime</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Media } from '~/utils/types/anilist'

interface Props {
  anime: Media[]
  loading: boolean
  loadingMore?: boolean
  error: string
  hasData: boolean
  hasMoreToShow: boolean
  totalCount: number
}

interface Emits {
  animeClick: [id: number]
  retry: []
  loadMore: []
}

const props = defineProps<Props>()
defineEmits<Emits>()

// Track if we're in SSR or post-hydration for consistent rendering
const isHydrated = useState('animeGrid.isHydrated', () => false)

// Load trigger ref for intersection observer
const loadTrigger = ref<HTMLElement | null>(null)

// Mark as hydrated after mount
onMounted(() => {
  isHydrated.value = true
})

// Computed properties for consistent SSR/CSR rendering
const shouldShowLoading = computed(() => {
  // During SSR or before hydration, only show loading if we actually need to load
  if (!isHydrated.value) {
    return props.loading && !props.hasData
  }
  // After hydration, show loading normally
  return props.loading && !props.hasData
})

const shouldShowEmpty = computed(() => {
  return !props.loading && !props.error && props.anime.length === 0 && isHydrated.value
})

const shouldShowGrid = computed(() => {
  // Always show grid if we have anime data, regardless of loading state
  // This prevents layout shift during hydration
  return props.anime.length > 0
})

// Add staggered animation delays
const setAnimationDelays = () => {
  // Only run on client side
  if (!import.meta.client) return

  nextTick(() => {
    const cards = document.querySelectorAll('.anime-card')
    cards.forEach((card, index) => {
      ;(card as HTMLElement).style.setProperty('--delay', index.toString())
    })
  })
}

// Watch for anime changes to apply staggered delays
watch(
  () => props.anime,
  () => {
    if (props.anime.length > 0 && isHydrated.value) {
      setAnimationDelays()
    }
  },
  { immediate: false }
)

// Expose loadTrigger for parent component to setup intersection observer
defineExpose({
  loadTrigger
})
</script>

<template>
  <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div
      class="flex-1 w-full md:flex-[0_1_500px] md:max-w-[500px] lg:flex-[0_1_600px] lg:max-w-[600px]"
    >
      <div class="relative w-full">
        <Input
          v-model="searchModel"
          type="text"
          placeholder="Search anime..."
          class="h-9 pr-12"
          :class="{ 'border-primary': props.loading && searchModel }"
        />
        <div
          v-if="props.loading && searchModel"
          class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-primary"
        >
          <Spinner class="w-4 h-4" />
        </div>
        <Button
          v-else-if="searchModel"
          aria-label="Clear search"
          variant="ghost"
          size="icon"
          class="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-border"
          type="button"
          @click="clearSearch"
        >
          <Icon name="lucide:x" size="16" />
        </Button>
      </div>
    </div>
    <div class="flex gap-3 justify-end">
      <Select v-model="sortModel" @update:model-value="handleFilterChange">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="MediaSort.POPULARITY_DESC">Popular</SelectItem>
          <SelectItem :value="MediaSort.TRENDING_DESC">Trending</SelectItem>
          <SelectItem :value="MediaSort.SCORE_DESC">Top Rated</SelectItem>
          <SelectItem :value="MediaSort.START_DATE_DESC">Recently Released</SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="seasonModel" @update:model-value="handleFilterChange">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Season" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="season in availableSeasons" :key="season.value" :value="season.value">
            {{ season.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentSeason } from '~/utils/api/anime.api'
import { MediaSort } from '~/utils/types/anilist'

interface Props {
  searchQuery: string
  selectedSort: string // Now using string to match composable
  selectedSeason: string // Now using string to match composable
  loading?: boolean // Optional loading state
}

interface Emits {
  'update:searchQuery': [value: string]
  'update:selectedSort': [value: string]
  'update:selectedSeason': [value: string]
  filterChange: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Available seasons based on current time of year
const availableSeasons = computed(() => {
  const { season: currentSeason, year } = getCurrentSeason()
  const seasons = []

  const seasonNames = {
    WINTER: 'Winter',
    SPRING: 'Spring',
    SUMMER: 'Summer',
    FALL: 'Fall'
  } as const

  // Show seasons in chronological order: Spring, Summer, Fall
  const currentYearSeasons = ['SPRING', 'SUMMER', 'FALL'] as const
  for (const seasonKey of currentYearSeasons) {
    seasons.push({
      value: seasonKey,
      label: `${seasonNames[seasonKey]} ${year}`
    })
  }

  // Winter always shown at the end with next year
  // - If currently Winter or Fall, show next year's Winter
  if (currentSeason === 'WINTER' || currentSeason === 'FALL') {
    seasons.push({
      value: 'WINTER',
      label: `${seasonNames.WINTER} ${year + 1}`
    })
  } else {
    // Spring/Summer - show current year's Winter
    seasons.push({
      value: 'WINTER',
      label: `${seasonNames.WINTER} ${year}`
    })
  }

  return seasons
})

// Computed properties for v-model binding
const seasonModel = computed({
  get: () => props.selectedSeason,
  set: (value: string) => emit('update:selectedSeason', value)
})

const sortModel = computed({
  get: () => props.selectedSort,
  set: (value: string) => emit('update:selectedSort', value)
})

const searchModel = computed({
  get: () => props.searchQuery,
  set: (value: string) => emit('update:searchQuery', value)
})

// Event handler for filter changes
const handleFilterChange = () => {
  emit('filterChange')
}

// Clear search input
const clearSearch = () => {
  emit('update:searchQuery', '')
  emit('filterChange')
}
</script>

<template>
  <div class="search-filters">
    <div class="search-section">
      <div class="search-input-wrapper">
        <input 
          v-model="searchModel" 
          type="text" 
          placeholder="Search anime..."
          class="search-input"
          :class="{ 'is-loading': props.loading && searchModel }"
        />
        <div v-if="props.loading && searchModel" class="search-loading">
          <Icon name="lucide:loader-2" size="16" class="spin" />
        </div>
        <button 
          v-else-if="searchModel" 
          class="clear-button" 
          type="button"
          @click="clearSearch"
          aria-label="Clear search"
        >
          <Icon name="lucide:x" size="16" />
        </button>
      </div>
    </div>
    <div class="filters">
      <div class="select-wrapper">
        <select v-model="sortModel" class="filter-select" @change="handleFilterChange">
          <option :value="MediaSort.POPULARITY_DESC">Popular</option>
          <option :value="MediaSort.TRENDING_DESC">Trending</option>
          <option :value="MediaSort.SCORE_DESC">Top Rated</option>
          <option :value="MediaSort.START_DATE_DESC">Recently Released</option>
        </select>
        <Icon name="lucide:chevron-down" class="select-icon" size="16" />
      </div>
      <div class="select-wrapper">
        <select v-model="seasonModel" class="filter-select" @change="handleFilterChange">
          <!-- <option value="">All Seasons</option> -->
          <option v-for="season in availableSeasons" :key="season.value" :value="season.value">
            {{ season.label }}
          </option>
        </select>
        <Icon name="lucide:chevron-down" class="select-icon" size="16" />
      </div>
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

  // Show seasons in chronological order: Spring, Summer, Fall, Winter
  const currentYearSeasons = ['SPRING', 'SUMMER', 'FALL'] as const
  for (const seasonKey of currentYearSeasons) {
    seasons.push({
      value: seasonKey,
      label: `${seasonNames[seasonKey]} ${year}`
    })
  }

  // For Winter, show next year's Winter only if we're currently in Fall or later
  // Otherwise, Winter refers to the current year's Winter
  if (currentSeason === 'FALL') {
    // Show upcoming Winter (next year)
    seasons.push({
      value: 'WINTER',
      label: `${seasonNames.WINTER} ${year + 1}`
    })
  } else {
    // Show current year's Winter (current or past)
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

<style scoped lang="scss">
.search-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (width >= 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.search-section {
  flex: 1;
  width: 100%;

  @media (width >= 768px) {
    flex: 0 1 500px;
    max-width: 500px;
  }

  @media (width >= 1024px) {
    flex: 0 1 600px;
    max-width: 600px;
  }
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 12px 48px 12px 16px; // Add right padding for clear button
  font-size: 1rem;
  color: var(--text-color);
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  &::placeholder {
    color: var(--text-muted);
  }

  &.is-loading {
    border-color: var(--primary-color);
  }
}

.search-loading {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.clear-button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  color: var(--text-muted);
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--text-color);
    background: var(--border-color);
  }

  &:focus {
    outline: none;
    color: var(--primary-color);
  }
}

.filters {
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.select-wrapper {
  position: relative;
  display: inline-block;
}

.filter-select {
  padding: 8px 32px 8px 12px; /* Add extra right padding for icon */
  font-size: 0.9rem;
  color: var(--text-color);
  appearance: none;
  cursor: pointer;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 6px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  option {
    color: var(--text-color);
    background: var(--bg-secondary);
  }
}

.select-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none; /* Prevent icon from interfering with select clicks */
  transition: color 0.2s ease;
}

.select-wrapper:hover .select-icon {
  color: var(--text-color);
}
</style>

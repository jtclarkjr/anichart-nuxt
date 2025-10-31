<template>
  <Card
    class="overflow-hidden cursor-pointer bg-card border-border transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-primary hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:-translate-y-1 animate-[card-appear_0.4s_cubic-bezier(0.4,0,0.2,1)_forwards] p-0"
    @click="$emit('click', anime.id)"
  >
    <div class="relative aspect-[3/4] overflow-hidden group">
      <NuxtImg
        ref="imageRef"
        :src="getSafeImageUrl(anime.coverImage)"
        :alt="getDisplayTitle(anime.title)"
        :class="{ 'opacity-100': imageLoaded, 'opacity-0': !imageLoaded }"
        class="w-full h-full object-cover transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
        loading="lazy"
        preset="cover"
        @load="handleImageLoad"
        @error="handleImageError"
      />
      <div
        class="absolute inset-0 flex items-start justify-end p-2 bg-gradient-to-b from-transparent via-transparent via-60% to-black/80"
      >
        <Badge v-if="anime.averageScore" class="text-xs font-semibold text-white bg-primary">
          {{ anime.averageScore }}%
        </Badge>
      </div>
    </div>
    <CardContent class="p-3">
      <h3 class="text-sm font-semibold leading-tight text-foreground line-clamp-2 mb-2">
        {{ getDisplayTitle(anime.title) }}
      </h3>
      <div class="flex gap-2 mb-2 text-xs text-muted-foreground">
        <Badge variant="secondary" class="px-1.5 py-0.5 text-[0.75rem] bg-muted/40">
          {{ formatYear(anime.startDate) }}
        </Badge>
        <Badge
          v-if="anime.format"
          variant="secondary"
          class="px-1.5 py-0.5 text-[0.75rem] bg-muted/40"
        >
          {{ formatMediaFormat(anime.format) }}
        </Badge>
      </div>
      <div class="flex flex-wrap gap-1">
        <Badge
          v-for="genre in anime.genres.slice(0, 2)"
          :key="genre"
          class="px-1.5 py-0.5 text-[0.7rem] font-medium text-foreground bg-accent"
        >
          {{ genre }}
        </Badge>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { getDisplayTitle, getSafeImageUrl, formatYear } from '~/utils/api/anime.api'
import { formatMediaFormat } from '~/utils/helpers/format'
import type { AnimeCardProps } from './types'

defineProps<AnimeCardProps>()
defineEmits<{
  click: [id: number]
}>()

// Image loading state
const imageLoaded = ref(false)
const imageRef = ref<HTMLImageElement | null>(null)

// Handle image loading
const handleImageLoad = () => {
  imageLoaded.value = true
}

const handleImageError = () => {
  // Optionally handle image loading errors
  imageLoaded.value = true // Still show the card even if image fails
}

// Check if image is already loaded (for cached images)
onMounted(() => {
  if (imageRef.value?.complete) {
    imageLoaded.value = true
  }
})
</script>

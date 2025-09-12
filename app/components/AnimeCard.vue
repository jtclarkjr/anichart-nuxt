<template>
  <div class="anime-card" @click="$emit('click', anime.id)">
    <div class="card-image">
      <NuxtImg
        ref="imageRef"
        :src="getSafeImageUrl(anime.coverImage)"
        :alt="getDisplayTitle(anime.title)"
        :class="{ loaded: imageLoaded }"
        loading="lazy"
        preset="cover"
        @load="handleImageLoad"
        @error="handleImageError"
      />
      <div class="card-overlay">
        <div v-if="anime.averageScore" class="score">{{ anime.averageScore }}%</div>
      </div>
    </div>
    <div class="card-content">
      <h3 class="title">{{ getDisplayTitle(anime.title) }}</h3>
      <div class="meta">
        <span class="year">{{ formatYear(anime.startDate) }}</span>
        <span v-if="anime.format" class="format">{{ formatMediaFormat(anime.format) }}</span>
      </div>
      <div class="genres">
        <span v-for="genre in anime.genres.slice(0, 2)" :key="genre" class="genre-tag">
          {{ genre }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDisplayTitle, getSafeImageUrl, formatYear } from '~/utils/api/anime.api'
import { formatMediaFormat } from '~/utils/helpers/format'
import type { Media } from '~/utils/types/anilist'

interface Props {
  anime: Media
}

defineProps<Props>()
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

<style scoped lang="scss">
.anime-card {
  overflow: hidden;
  cursor: pointer;
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
  transform: translateZ(0); /* Enable hardware acceleration */

  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 8px 25px rgb(0 0 0 / 30%);
    transform: translateY(-4px) translateZ(0);
  }

  /* Smooth initial appearance */
  animation: card-appear 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(10px) translateZ(0);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateZ(0);
  }
}

.card-image {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;

  :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition:
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.3s ease;
    opacity: 0;

    &.loaded {
      opacity: 1;
    }
  }

  &:hover :deep(img) {
    transform: scale(1.05);
  }
}

.card-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 8px;
  background: linear-gradient(to bottom, transparent 0%, transparent 60%, rgb(0 0 0 / 80%) 100%);
}

.score {
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background: var(--primary-color);
  border-radius: 12px;
}

.card-content {
  padding: 12px;
}

.title {
  display: -webkit-box;
  margin: 0 0 8px;
  overflow: hidden;
  -webkit-line-clamp: 2;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary);
  -webkit-box-orient: vertical;
}

.meta {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.75rem;
  color: var(--text-muted);

  .year,
  .format {
    padding: 2px 6px;
    background: var(--surface-color);
    border-radius: 4px;
  }
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.genre-tag {
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-color);
  background: var(--accent-color);
  border-radius: 4px;
}
</style>

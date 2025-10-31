<template>
  <div class="banner-container">
    <!-- Background Image -->
    <NuxtImg
      v-if="anime.bannerImage"
      :src="anime.bannerImage"
      alt=""
      class="banner-bg"
      preset="banner"
      loading="eager"
    />

    <!-- Overlay -->
    <div class="banner-overlay" />

    <!-- Content -->
    <div class="banner-content">
      <!-- Cover Image -->
      <div class="flex-shrink-0">
        <NuxtImg
          :src="getSafeImageUrl(anime.coverImage)"
          :alt="getDisplayTitle(anime.title)"
          loading="lazy"
          width="230"
          height="345"
          format="webp"
          class="banner-cover"
        />
      </div>

      <!-- Info Section -->
      <div class="banner-info">
        <!-- Title -->
        <h1 class="banner-title">
          {{ getDisplayTitle(anime.title) }}
        </h1>

        <!-- Alternative Titles -->
        <div
          v-if="anime.title.romaji !== getDisplayTitle(anime.title)"
          class="mb-4 opacity-90 max-[480px]:mb-5"
        >
          <p v-if="anime.title.romaji" class="banner-alt-title">
            {{ anime.title.romaji }}
          </p>
          <p v-if="anime.title.native" class="banner-alt-title">
            {{ anime.title.native }}
          </p>
        </div>

        <!-- Metadata Grid -->
        <div class="banner-meta-grid">
          <BannerMetaItem label="Score" :value="formatScore(anime.averageScore)" highlighted />
          <BannerMetaItem label="Status" :value="formatStatus(anime.status)" />
          <BannerMetaItem
            v-if="anime.format"
            label="Format"
            :value="formatMediaFormat(anime.format)"
          />
          <BannerMetaItem v-if="anime.episodes" label="Episodes" :value="anime.episodes" />
          <BannerMetaItem v-if="anime.duration" label="Duration">
            {{ anime.duration }} min
          </BannerMetaItem>
        </div>

        <!-- Genres -->
        <div class="flex flex-wrap gap-2 mt-4 max-md:justify-center">
          <Badge v-for="genre in anime.genres" :key="genre" class="banner-genre-badge">
            {{ genre }}
          </Badge>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDisplayTitle, getSafeImageUrl, formatScore, formatStatus } from '~/utils/api/anime.api'
import { formatMediaFormat } from '~/utils/helpers/format'
import type { AnimeBannerProps } from './types'

defineProps<AnimeBannerProps>()
</script>

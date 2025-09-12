<template>
  <div class="banner">
    <NuxtImg
      v-if="anime.bannerImage"
      :src="anime.bannerImage"
      alt=""
      class="banner-bg"
      preset="banner"
      loading="eager"
    />
    <div class="banner-overlay"></div>
    <div class="banner-content">
      <div class="cover-image">
        <NuxtImg
          :src="getSafeImageUrl(anime.coverImage)"
          :alt="getDisplayTitle(anime.title)"
          loading="lazy"
          width="230"
          height="345"
          format="webp"
        />
      </div>
      <div class="basic-info">
        <h1 class="title">{{ getDisplayTitle(anime.title) }}</h1>
        <div v-if="anime.title.romaji !== getDisplayTitle(anime.title)" class="alt-titles">
          <p v-if="anime.title.romaji">{{ anime.title.romaji }}</p>
          <p v-if="anime.title.native">{{ anime.title.native }}</p>
        </div>
        <div class="meta-info">
          <div class="meta-item">
            <span class="label">Score:</span>
            <span class="value score">{{ formatScore(anime.averageScore) }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Status:</span>
            <span class="value">{{ formatStatus(anime.status) }}</span>
          </div>
          <div v-if="anime.format" class="meta-item">
            <span class="label">Format:</span>
            <span class="value">{{ formatMediaFormat(anime.format) }}</span>
          </div>
          <div v-if="anime.episodes" class="meta-item">
            <span class="label">Episodes:</span>
            <span class="value">{{ anime.episodes }}</span>
          </div>
          <div v-if="anime.duration" class="meta-item">
            <span class="label">Duration:</span>
            <span class="value">{{ anime.duration }} min</span>
          </div>
        </div>
        <div class="genres">
          <span v-for="genre in anime.genres" :key="genre" class="genre-tag">
            {{ genre }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDisplayTitle, getSafeImageUrl, formatScore, formatStatus } from '~/utils/api/anime.api'
import { formatMediaFormat } from '~/utils/helpers/format'
import type { Media } from '~/utils/types/anilist'

interface Props {
  anime: Media
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.banner {
  position: relative;
  display: flex;
  align-items: center;
  height: auto;
  min-height: 400px;
  padding: 2rem 0.75rem;
  overflow: hidden;
  background-color: var(--bg-secondary);

  @media (width >= 480px) {
    align-items: flex-end;
    min-height: 450px;
    padding: 2rem 1rem;
  }

  @media (width >= 768px) {
    min-height: 500px;
    padding: 2.5rem 1rem;
  }

  @media (width >= 1024px) {
    min-height: 550px;
  }

  &::before {
    position: absolute;
    inset: 0;
    pointer-events: none;
    content: '';
    background: linear-gradient(
      135deg,
      rgb(0 0 0 / 85%) 0%,
      rgb(0 0 0 / 70%) 50%,
      rgb(0 0 0 / 90%) 100%
    );
  }

  &::after {
    position: absolute;
    inset: 0;
    pointer-events: none;
    content: '';
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgb(0 0 0 / 20%) 40%,
      rgb(0 0 0 / 60%) 100%
    );
  }
}

.banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;

  :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.banner-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: rgb(0 0 0 / 40%);
}

.banner-content {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media (width >= 480px) {
    gap: 1.5rem;
  }

  @media (width >= 768px) {
    gap: 2rem;
  }

  @media (width <= 768px) {
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
    text-align: center;
  }
}

.cover-image {
  flex-shrink: 0;

  :deep(img) {
    width: 230px;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgb(0 0 0 / 60%);

    @media (width <= 480px) {
      width: 140px;
    }

    @media (width <= 768px) {
      width: 160px;
    }
  }
}

.basic-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 230px;
  color: white;

  @media (width <= 768px) {
    align-items: center;
    justify-content: center;
    min-height: auto;
  }

  @media (width <= 480px) {
    justify-content: flex-start;
    min-height: 200px;
  }
}

.title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  text-shadow: 
    2px 2px 8px rgb(0 0 0 / 90%),
    0 0 20px rgb(0 0 0 / 70%),
    0 0 40px rgb(0 0 0 / 50%);
}

.alt-titles {
  margin-bottom: 1rem;
  opacity: 0.9;

  p {
    margin: 0.25rem 0;
    font-size: 1.1rem;
    text-shadow: 
      1px 1px 4px rgb(0 0 0 / 90%),
      0 0 15px rgb(0 0 0 / 70%);
  }
}

.meta-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin: 1.5rem 0;

  @media (width <= 480px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.5rem;
    margin: 1rem 0;
  }

  @media (width <= 768px) {
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  }
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .label {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-shadow: 1px 1px 3px rgb(0 0 0 / 90%);
    opacity: 0.95;
  }

  .value {
    font-size: 1rem;
    font-weight: 500;
    text-shadow: 
      1px 1px 4px rgb(0 0 0 / 90%),
      0 0 12px rgb(0 0 0 / 60%);

    &.score {
      font-weight: 700;
      color: var(--primary-color);
    }
  }
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;

  @media (width <= 768px) {
    justify-content: center;
  }
}

.genre-tag {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
  text-shadow: 
    1px 1px 3px rgb(0 0 0 / 80%),
    0 0 8px rgb(0 0 0 / 60%);
  background: rgb(0 0 0 / 25%);
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 20px;
  backdrop-filter: blur(12px);
  transition: all 0.2s ease;

  &:hover {
    background: rgb(0 0 0 / 35%);
    transform: translateY(-2px);
  }
}
@media (width <= 480px) {
  .banner-content {
    gap: 1rem;
    padding: 0 0.75rem;
  }

  .title {
    font-size: clamp(1.4rem, 5.5vw, 2.25rem);
    margin-bottom: 0.75rem;
  }

  .alt-titles {
    margin-bottom: 1.25rem;
  }

  .meta-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1.25rem 0;
  }

  .meta-item {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .meta-item:last-child {
    border-bottom: none;
  }

  .meta-item .label {
    font-size: 0.85rem;
    margin-right: 1rem;
  }

  .meta-item .value {
    font-size: 1rem;
    text-align: right;
  }

  .genre-tag {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

@media (width <= 375px) {
  .banner {
    padding: 1.25rem 0.5rem;
  }

  .banner-content {
    gap: 0.75rem;
    padding: 0 0.5rem;
  }

  .title {
    font-size: clamp(1.3rem, 6.5vw, 2rem);
  }

  .meta-item {
    padding: 0.4rem 0;
  }

  .meta-item .label {
    font-size: 0.8rem;
  }

  .meta-item .value {
    font-size: 0.95rem;
  }

  .genre-tag {
    padding: 0.35rem 0.7rem;
    font-size: 0.78rem;
  }
}
</style>

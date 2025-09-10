<template>
  <div class="anime-details">
    <div v-if="errorMessage" class="error">
      <p>{{ errorMessage }}</p>
      <button class="retry-btn" @click="() => refreshDetails()">Retry</button>
    </div>

    <div v-else-if="anime" class="details-content">
      <AnimeBanner :anime="anime" />
      <div class="container">
        <div class="content-grid">
          <div class="main-content">
            <AnimeDescription :anime="anime" />
          </div>
          <div class="sidebar">
            <AnimeMetadata :anime="anime" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      <div class="loading-spinner" />
      <p>Loading anime details...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Media, GraphQLResponse, AnimeDetailsResponse } from '~/utils/types/anilist'
import { GET_ANIME_DETAILS } from '~/utils/api/queries'

const route = useRoute()
const idParam = computed(() => Number(route.params.id))

const { data, error, refresh } = await useAsyncData(`anime-${idParam.value}`, async () => {
  const id = idParam.value
  if (!Number.isFinite(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })

  const response = await $fetch<GraphQLResponse<AnimeDetailsResponse>>('/graphql', {
    method: 'POST',
    body: {
      query: GET_ANIME_DETAILS,
      variables: { id }
    }
  })

  if (response.errors) {
    throw createError({ 
      statusCode: 500, 
      statusMessage: response.errors[0]?.message || 'GraphQL error' 
    })
  }

  if (!response.data) {
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'No data returned from GraphQL query' 
    })
  }

  return response.data.Media
})

const anime = computed<Media | null>(() => (data.value as Media) || null)
const errorMessage = computed<string | null>(() =>
  error.value ? 'Failed to load anime details. Please try again.' : null
)

const refreshDetails = async () => {
  await refresh()
}
</script>

<style scoped lang="scss">
.anime-details {
  min-height: 100vh;
  background: var(--bg-primary);
}
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: var(--text-muted);
}
.loading .loading-spinner {
  width: 40px;
  height: 40px;
  margin-bottom: 1rem;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.error {
  padding: 3rem;
  color: #ff6b6b;
  text-align: center;
}
.error .retry-btn {
  padding: 12px 24px;
  margin-top: 1rem;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  background: var(--primary-color);
  border: none;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}
.error .retry-btn:hover {
  background: color-mix(in srgb, var(--primary-color) 80%, black);
}
.details-content .container {
  width: 100%;
  max-width: 1200px;
  padding: 0 1rem;
  margin: 0 auto;
}
.details-content .content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1.5rem 0;
}
@media (width >= 1024px) {
  .details-content .content-grid {
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
  }
}
</style>

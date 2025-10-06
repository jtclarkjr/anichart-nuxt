<template>
  <div class="min-h-screen bg-background">
    <div v-if="errorMessage" class="p-12 text-destructive text-center">
      <p>{{ errorMessage }}</p>
      <Button class="mt-4 px-6 py-3 text-base" @click="() => refreshDetails()">Retry</Button>
    </div>

    <div v-else-if="anime">
      <AnimeBanner :anime="anime" />
      <div class="w-full max-w-[1200px] px-4 mx-auto">
        <div class="grid grid-cols-1 gap-6 py-6 lg:grid-cols-[2fr_1fr] lg:gap-12">
          <div>
            <AnimeDescription :anime="anime" />
          </div>
          <div>
            <AnimeMetadata :anime="anime" />
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground"
    >
      <Spinner class="w-10 h-10 mb-4" />
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

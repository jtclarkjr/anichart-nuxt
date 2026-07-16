<template>
  <div class="min-h-screen bg-background">
    <BackToListButton />

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
import { useAnimeDetailsQuery } from '~/composables/useAnimeDetailsQuery'

const route = useRoute()
const idParam = computed(() => Number(route.params.id))

if (!Number.isInteger(idParam.value) || idParam.value <= 0) {
  throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
}

const detailsQuery = useAnimeDetailsQuery(idParam)
const anime = detailsQuery.data
const errorMessage = computed<string | null>(() =>
  detailsQuery.isError.value && !anime.value
    ? 'Failed to load anime details. Please try again.'
    : null
)

onServerPrefetch(() => detailsQuery.suspense())

const refreshDetails = async () => {
  await detailsQuery.refetch()
}
</script>

<template>
  <Card class="max-w-full h-fit p-6 bg-card/40 border-border max-[480px]:p-4">
    <CardHeader class="p-0 mb-4">
      <CardTitle class="pb-2 text-xl border-b-2 border-primary"> Information </CardTitle>
    </CardHeader>
    <CardContent class="p-0 flex flex-col gap-4">
      <MetadataItem
        v-if="anime.startDate?.year"
        label="Start Date"
        :value="formatDate(anime.startDate)"
      />

      <MetadataItem
        v-if="anime.endDate?.year"
        label="End Date"
        :value="formatDate(anime.endDate)"
      />

      <MetadataItem v-if="anime.season" label="Season">
        {{ anime.season }} {{ anime.seasonYear }}
      </MetadataItem>

      <MetadataItem v-if="anime.source" label="Source" :value="formatSource(anime.source)" />

      <MetadataItem v-if="anime.studios?.nodes?.length" label="Studio">
        {{ anime.studios.nodes.map((s) => s.name).join(', ') }}
      </MetadataItem>

      <MetadataItem v-if="anime.popularity" label="Popularity">
        #{{ anime.popularity.toLocaleString() }}
      </MetadataItem>

      <MetadataItem
        v-if="anime.favourites"
        label="Favourites"
        :value="anime.favourites.toLocaleString()"
      />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { months } from '~/utils/constants/months'
import type { Media, MediaSource } from '~/utils/types/anilist'

interface Props {
  anime: Media
}

defineProps<Props>()

const formatDate = (
  date: { year: number | null; month: number | null; day: number | null } | null
): string => {
  if (!date?.year) return 'TBA'
  if (!date.month) return date.year.toString()
  if (!date.day) return `${getMonthName(date.month)} ${date.year}`
  return `${getMonthName(date.month)} ${date.day}, ${date.year}`
}

const getMonthName = (month: number): string => {
  return months[month - 1] || 'Unknown'
}

const formatSource = (source: MediaSource | null): string => {
  if (!source) return 'Unknown'

  return source
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
</script>

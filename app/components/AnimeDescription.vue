<template>
  <!-- eslint-disable vue/no-v-html -->
  <section>
    <h2 class="pb-2 mb-6 text-2xl font-semibold text-foreground border-b-2 border-primary">
      Description
    </h2>
    <div
      class="text-base leading-[1.7] text-foreground [&_p]:mb-4 [&_p:last-child]:mb-0 [&_br]:mb-2 [&_i]:italic [&_i]:text-muted-foreground [&_b]:font-semibold [&_b]:text-primary [&_strong]:font-semibold [&_strong]:text-primary [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline"
      v-html="anime.description || 'No description available.'"
    />
  </section>
  <!-- eslint-enable vue/no-v-html -->
</template>

<script setup lang="ts">
import type { AnimeDescriptionProps } from './types'

defineProps<AnimeDescriptionProps>()
</script>

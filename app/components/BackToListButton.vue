<script setup lang="ts">
const animeListRoute = '/anime'
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 top-4 z-50 sm:top-6">
    <div class="w-full max-w-[1200px] px-4 mx-auto">
      <Button
        as-child
        variant="outline"
        class="pointer-events-auto rounded-full border-white/25 bg-black/60 text-white shadow-lg backdrop-blur-md hover:-translate-y-0.5 hover:border-white/40 hover:bg-black/75 hover:text-white focus-visible:border-white/50 focus-visible:ring-white/30 dark:bg-black/60 dark:hover:bg-black/75"
      >
        <NuxtLink :to="animeListRoute" aria-label="Back to anime list">
          <Icon name="lucide:arrow-left" size="16" />
          Back
        </NuxtLink>
      </Button>
    </div>
  </div>
</template>

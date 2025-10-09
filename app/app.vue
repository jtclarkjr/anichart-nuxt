<template>
  <div id="app" class="relative w-full min-h-screen overflow-x-hidden antialiased">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <Suspense>
        <NuxtPage />
        <template #fallback>
          <div
            class="flex flex-col items-center justify-center min-h-screen bg-background text-muted-foreground"
          >
            <Spinner class="w-12 h-12 mb-4" />
            <p class="text-base opacity-80">Loading...</p>
          </div>
        </template>
      </Suspense>
    </NuxtLayout>
    <Analytics />
  </div>
</template>

<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
// Route transition control can be added here if desired
</script>

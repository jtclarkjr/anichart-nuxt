<template>
  <div id="app">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <Suspense>
        <NuxtPage />
        <template #fallback>
          <div class="app-loading">
            <div class="loading-spinner" />
            <p>Loading...</p>
          </div>
        </template>
      </Suspense>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Route transition control can be added here if desired
</script>

<style lang="scss">
#app {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: var(--text-muted, #888);
  background: var(--bg-primary, #1a1a1a);

  .loading-spinner {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    border: 3px solid var(--border-color, #333);
    border-top: 3px solid var(--primary-color, #3b82f6);
    border-radius: 50%;
    animation: app-spin 1s linear infinite;
  }

  p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.8;
  }

  @keyframes app-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>

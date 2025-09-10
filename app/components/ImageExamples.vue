<template>
  <div class="image-examples">
    <h2>Nuxt Image Examples</h2>

    <!-- Basic usage with preset -->
    <div class="example-section">
      <h3>Cover Image (using preset)</h3>
      <NuxtImg
        src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDoj1EkAxFn.jpg"
        alt="Anime Cover"
        preset="cover"
        loading="lazy"
      />
    </div>

    <!-- Avatar with custom modifiers -->
    <div class="example-section">
      <h3>Avatar Image</h3>
      <NuxtImg
        src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDoj1EkAxFn.jpg"
        alt="Avatar"
        preset="avatar"
        loading="lazy"
      />
    </div>

    <!-- Banner with custom dimensions -->
    <div class="example-section">
      <h3>Banner Image</h3>
      <NuxtImg
        src="https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf2eO7P8DiSY.jpg"
        alt="Banner"
        preset="banner"
        loading="lazy"
      />
    </div>

    <!-- Responsive image -->
    <div class="example-section">
      <h3>Responsive Image</h3>
      <NuxtImg
        src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDoj1EkAxFn.jpg"
        alt="Responsive"
        sizes="sm:100vw md:50vw lg:400px"
        format="webp"
        loading="lazy"
      />
    </div>

    <!-- Picture element for art direction -->
    <div class="example-section">
      <h3>Picture Element (Art Direction)</h3>
      <NuxtPicture
        src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDoj1EkAxFn.jpg"
        alt="Art Direction Example"
        :img-attrs="{
          class: 'responsive-picture'
        }"
        sizes="sm:100vw md:50vw lg:400px"
        format="webp,avif"
        loading="lazy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// This component demonstrates various Nuxt Image features
</script>

<style scoped lang="scss">
.image-examples {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  h2 {
    margin-bottom: 2rem;
    color: var(--text-primary);
  }
}

.example-section {
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--card-background);
  border-radius: 8px;

  h3 {
    margin-bottom: 1rem;
    color: var(--text-secondary);
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .responsive-picture {
    width: 100%;
    height: auto;
  }
}
</style>

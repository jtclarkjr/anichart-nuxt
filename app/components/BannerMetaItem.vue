<template>
  <div class="banner-meta-item">
    <span class="banner-meta-label">
      {{ label }}
    </span>
    <span class="banner-meta-value" :class="{ 'text-primary font-bold': highlighted }">
      <slot>{{ value }}</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value?: string | number
  highlighted?: boolean
}

defineProps<Props>()
</script>

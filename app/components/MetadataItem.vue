<template>
  <div
    class="flex flex-col gap-1 min-w-0 pb-3 break-words border-b border-border last:pb-0 last:border-b-0"
  >
    <span
      class="flex-shrink-0 text-[0.85rem] font-semibold text-muted-foreground uppercase tracking-wider"
    >
      {{ label }}
    </span>
    <span class="text-[0.95rem] font-medium leading-[1.4] text-foreground hyphens-auto break-words">
      <slot>{{ value }}</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value?: string | number
}

defineProps<Props>()
</script>

import { clearNuxtState } from '#app'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAnimeFilters } from '~/composables/useAnimeFilters'

describe('useAnimeFilters', () => {
  afterEach(() => {
    vi.useRealTimers()
    clearNuxtState()
  })

  it('commits normalized search state after 500 ms', async () => {
    let filters: ReturnType<typeof useAnimeFilters> | undefined
    const TestComponent = defineComponent({
      setup() {
        filters = useAnimeFilters()
        return () => h('div')
      }
    })
    const wrapper = await mountSuspended(TestComponent)
    vi.useFakeTimers()

    if (!filters) throw new Error('Filters did not initialize')
    filters.searchQuery.value = '  Cowboy   Bebop '
    await nextTick()

    await vi.advanceTimersByTimeAsync(499)
    expect(filters.normalizedFilters.value.search).toBe('')

    await vi.advanceTimersByTimeAsync(1)
    expect(filters.normalizedFilters.value.search).toBe('Cowboy Bebop')

    wrapper.unmount()
  })
})

import { nextTick, onUnmounted, type Ref, ref, watch } from 'vue'

import type { Pattern } from './usePatterns'

export interface AnchorItem {
  id: string
  title: string
  active: boolean
}

export function useAnchors(patterns: Ref<Pattern[]>) {
  const anchors = ref<AnchorItem[]>([])
  const activeId = ref('')

  let observer: IntersectionObserver | null = null

  function buildAnchors() {
    anchors.value = patterns.value.map((p) => ({
      id: p.id,
      title: p.title,
      active: false,
    }))
  }

  function observeElements() {
    observer?.disconnect()

    const root = document.getElementById('main-content')
    observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (intersecting.length > 0) {
          const id = intersecting[0].target.id
          activeId.value = id
          anchors.value = anchors.value.map((a) => ({ ...a, active: a.id === id }))
        }
      },
      { root, rootMargin: '-56px 0px -55% 0px', threshold: 0 }
    )

    nextTick(() => {
      patterns.value.forEach((p) => {
        const el = document.getElementById(p.id)
        if (el) observer?.observe(el)
      })
    })
  }

  watch(
    () => patterns.value,
    () => {
      buildAnchors()
      observeElements()
    },
    { immediate: true }
  )

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { anchors, activeId }
}

import { inject, type Ref, watch } from 'vue'

import { type AnchorItem, useAnchors } from './useAnchors'
import type { Pattern } from './usePatterns'

export function usePageAnchors(patterns: Ref<Pattern[]>): void {
  const setAnchors = inject<(items: AnchorItem[]) => void>('setAnchors')
  const setActiveId = inject<(id: string) => void>('setActiveId')
  const { anchors, activeId } = useAnchors(patterns)
  watch(anchors, (items) => setAnchors?.(items), { immediate: true })
  watch(activeId, (id) => setActiveId?.(id), { immediate: true })
}

export function clearPageAnchors(): void {
  const setAnchors = inject<(items: AnchorItem[]) => void>('setAnchors')
  const setActiveId = inject<(id: string) => void>('setActiveId')
  setAnchors?.([])
  setActiveId?.('')
}

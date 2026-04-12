<template>
  <aside class="py-6 px-4">
    <div v-if="anchors.length" class="sticky top-20">
      <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
        On This Page
      </p>
      <nav ref="navRef">
        <ul class="space-y-1 border-l border-border">
          <li
            v-for="anchor in anchors"
            :key="anchor.id"
            :data-anchor-id="anchor.id"
          >
            <button
              class="w-full text-left text-xs px-3 py-1.5 transition-colors leading-snug"
              :class="
                anchor.active
                  ? 'text-primary font-medium border-l-2 border-primary -ml-px'
                  : 'text-muted-foreground hover:text-foreground'
              "
              @click="$emit('scroll', anchor.id)"
            >
              {{ anchor.title }}
            </button>
          </li>
        </ul>
      </nav>
    </div>
    <div v-else class="text-xs text-muted-foreground">
      Select a framework or category to see patterns here.
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { AnchorItem } from '@/composables/useAnchors'

const props = defineProps<{
  anchors: AnchorItem[]
  activeId: string
}>()

defineEmits<{ scroll: [id: string] }>()

const navRef = ref<HTMLElement | null>(null)

function getScrollParent(el: HTMLElement): HTMLElement | null {
  let cur = el.parentElement
  while (cur) {
    const oy = getComputedStyle(cur).overflowY
    if (oy === 'auto' || oy === 'scroll') return cur
    cur = cur.parentElement
  }
  return null
}

watch(
  () => props.activeId,
  async (id) => {
    if (!id) return
    await nextTick()
    const item = navRef.value?.querySelector(`[data-anchor-id="${id}"]`) as HTMLElement | null
    if (!item) return

    const container = getScrollParent(item)
    if (!container) return

    const pad = 24
    const cRect = container.getBoundingClientRect()
    const iRect = item.getBoundingClientRect()

    if (iRect.bottom + pad > cRect.bottom) {
      container.scrollBy({ top: iRect.bottom + pad - cRect.bottom, behavior: 'smooth' })
    } else if (iRect.top < cRect.top + 16) {
      container.scrollBy({ top: iRect.top - cRect.top - 16, behavior: 'smooth' })
    }
  },
)
</script>

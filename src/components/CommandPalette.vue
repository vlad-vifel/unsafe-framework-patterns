<template>
  <Teleport to="body">
    <Transition name="palette">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[12vh]"
        @click.self="close"
      >
        <div
          class="palette-panel flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-popover shadow-2xl max-h-[70vh]"
        >
          <div class="flex shrink-0 items-center gap-3 border-b border-border px-4">
            <Search class="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="Search"
              class="h-12 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              @keydown="onKeydown"
            />
          </div>

          <div ref="listRef" class="flex-1 overflow-y-auto py-2">
            <template v-if="navItems.length">
              <p class="px-4 pb-1 pt-2 text-xs font-medium text-muted-foreground">Pages</p>
              <button
                v-for="(item, i) in navItems"
                :key="item.to"
                :data-idx="i"
                class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors"
                :class="focusedIndex === i ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'"
                @click="goTo(item.to)"
                @mouseenter="focusedIndex = i"
              >
                <component :is="item.icon" class="h-4 w-4 shrink-0 text-muted-foreground" />
                <span class="flex-1 font-medium">{{ item.label }}</span>
                <ArrowRight class="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </template>

            <template v-if="fwItems.length">
              <p class="px-4 pb-1 pt-3 text-xs font-medium text-muted-foreground border-t border-border mt-1">
                Frameworks
              </p>
              <button
                v-for="(item, i) in fwItems"
                :key="item.to"
                :data-idx="navItems.length + i"
                class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors"
                :class="
                  focusedIndex === navItems.length + i ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                "
                @click="goTo(item.to)"
                @mouseenter="focusedIndex = navItems.length + i"
              >
                <span class="h-2 w-2 shrink-0 rounded-full" :class="item.dot ?? 'bg-muted-foreground'" />
                <span class="flex-1 font-medium">{{ item.label }}</span>
                <ArrowRight class="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </template>

            <template v-if="catItems.length">
              <p class="px-4 pb-1 pt-3 text-xs font-medium text-muted-foreground border-t border-border mt-1">
                Categories
              </p>
              <button
                v-for="(item, i) in catItems"
                :key="item.to"
                :data-idx="navItems.length + fwItems.length + i"
                class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors"
                :class="
                  focusedIndex === navItems.length + fwItems.length + i
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/50'
                "
                @click="goTo(item.to)"
                @mouseenter="focusedIndex = navItems.length + fwItems.length + i"
              >
                <span class="h-2 w-2 shrink-0 rounded-full bg-muted-foreground" />
                <span class="flex-1 font-medium">{{ item.label }}</span>
                <ArrowRight class="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </template>

            <template v-if="patternItems.length">
              <p class="px-4 pb-1 pt-3 text-xs font-medium text-muted-foreground border-t border-border mt-1">
                Patterns
              </p>
              <button
                v-for="(p, j) in patternItems"
                :key="p.id"
                :data-idx="allPageItems.length + j"
                class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors"
                :class="
                  focusedIndex === allPageItems.length + j ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                "
                @click="goToPattern(p)"
                @mouseenter="focusedIndex = allPageItems.length + j"
              >
                <span
                  class="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                  :class="FRAMEWORK_DOT[p.framework] ?? 'bg-muted-foreground'"
                />
                <div class="min-w-0 flex-1">
                  <p class="truncate font-medium text-foreground">{{ p.title }}</p>
                  <p class="truncate text-xs text-muted-foreground">
                    {{ frameworkLabel(p.framework) }} · {{ categoryLabel(p.category) }}
                  </p>
                </div>
                <ArrowRight class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </button>
            </template>

            <div
              v-if="query && !allPageItems.length && !patternItems.length"
              class="py-14 text-center text-sm text-muted-foreground"
            >
              No results found.
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-4 border-t border-border px-4 py-2 text-xs text-muted-foreground">
            <span class="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              navigate
            </span>
            <span class="flex items-center gap-1.5">
              <Kbd>↵</Kbd>
              select
            </span>
            <span class="flex items-center gap-1.5">
              <Kbd>Esc</Kbd>
              close
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ArrowRight, Home, Layers, LayoutList, Search, Tag } from 'lucide-vue-next'
import { type Component, computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import Kbd from '@/components/ui/kbd/Kbd.vue'
import { useCommandPalette } from '@/composables/useCommandPalette'
import { allCategories, allFrameworks, type Pattern } from '@/composables/usePatterns'
import { runSearch } from '@/composables/useSearch'
import { FRAMEWORK_DOT } from '@/constants'

interface NavItem {
  label: string
  to: string
  icon: Component
}

const { isOpen, close } = useCommandPalette()
const router = useRouter()

const query = ref('')
const focusedIndex = ref(-1)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)

const NAV: NavItem[] = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'All patterns', to: '/patterns', icon: LayoutList },
  { label: 'Frameworks', to: '/frameworks', icon: Layers },
  { label: 'Categories', to: '/categories', icon: Tag },
]

const FW_ITEMS = allFrameworks.map((fw) => ({
  label: fw.name,
  to: `/framework/${fw.id}`,
  dot: FRAMEWORK_DOT[fw.id],
}))

const CAT_ITEMS = allCategories.map((cat) => ({
  label: cat.name,
  to: `/category/${cat.id}`,
}))

function filterByQuery<T extends { label: string }>(items: T[]) {
  if (!query.value.trim()) return items
  const q = query.value.toLowerCase()
  return items.filter((item) => item.label.toLowerCase().includes(q))
}

const navItems = computed(() => filterByQuery(NAV))
const fwItems = computed(() => filterByQuery(FW_ITEMS))
const catItems = computed(() => filterByQuery(CAT_ITEMS))

const allPageItems = computed(() => [...navItems.value, ...fwItems.value, ...catItems.value])

const patternItems = computed(() => (query.value.trim() ? runSearch(query.value) : []))

const totalItems = computed(() => allPageItems.value.length + patternItems.value.length)

watch(query, () => {
  focusedIndex.value = -1
})

watch(isOpen, async (val) => {
  if (val) {
    query.value = ''
    focusedIndex.value = -1
    await nextTick()
    inputRef.value?.focus()
  }
})

function scrollToFocused() {
  nextTick(() => {
    const el = listRef.value?.querySelector(`[data-idx="${focusedIndex.value}"]`) as HTMLElement | null
    el?.scrollIntoView({ block: 'nearest' })
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    focusedIndex.value = focusedIndex.value < totalItems.value - 1 ? focusedIndex.value + 1 : 0
    scrollToFocused()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    focusedIndex.value = focusedIndex.value > 0 ? focusedIndex.value - 1 : totalItems.value - 1
    scrollToFocused()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (focusedIndex.value >= 0) {
      const i = focusedIndex.value
      if (i < allPageItems.value.length) {
        goTo(allPageItems.value[i].to)
      } else {
        goToPattern(patternItems.value[i - allPageItems.value.length])
      }
    } else if (query.value.trim()) {
      goTo(`/search?q=${encodeURIComponent(query.value.trim())}`)
    }
  } else if (e.key === 'Escape') {
    close()
  }
}

function goTo(to: string) {
  close()
  router.push(to)
}

function goToPattern(p: Pattern) {
  close()
  router.push({ name: 'pattern', params: { id: p.id }, query: { from: 'search', q: query.value } })
}

function frameworkLabel(id: string) {
  return allFrameworks.find((f) => f.id === id)?.name ?? id
}

function categoryLabel(id: string) {
  return allCategories.find((c) => c.id === id)?.name ?? id
}

function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    e.stopPropagation()
    if (isOpen.value) {
      close()
    } else {
      isOpen.value = true
    }
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalKeydown, { capture: true }))
onUnmounted(() => window.removeEventListener('keydown', onGlobalKeydown, { capture: true }))
</script>

<style scoped>
.palette-enter-active,
.palette-leave-active {
  transition: opacity 0.15s ease;
}

.palette-enter-active :deep(.palette-panel),
.palette-leave-active :deep(.palette-panel) {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.palette-enter-from,
.palette-leave-to {
  opacity: 0;
}

.palette-enter-from :deep(.palette-panel),
.palette-leave-to :deep(.palette-panel) {
  transform: translateY(-8px);
  opacity: 0;
}
</style>

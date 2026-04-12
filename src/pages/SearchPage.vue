<template>
  <div class="space-y-2">
    <template v-if="!query">
      <h1 class="text-3xl font-bold tracking-tight text-foreground">Search</h1>
      <div class="relative">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input ref="defaultInputRef" v-model="inlineQuery" type="text" placeholder="Type to search"
          class="w-full h-11 rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          @keydown.enter.prevent="submitInline" @keydown.escape="inlineQuery = ''" />
      </div>
    </template>

    <template v-else>
      <div class="space-y-1 pb-4 border-b border-border">
        <p class="text-xs text-muted-foreground uppercase tracking-widest font-medium">Search</p>
        <h1 class="text-2xl font-bold tracking-tight text-foreground">
          Results for <span class="text-primary">"{{ query }}"</span>
        </h1>
        <p class="text-sm text-muted-foreground">
          {{ patterns.length }} pattern{{ patterns.length !== 1 ? 's' : '' }} found
        </p>
      </div>

      <div v-if="patterns.length === 0" class="py-16 text-center space-y-2">
        <p class="text-muted-foreground text-sm">
          No patterns found for <strong class="text-foreground">"{{ query }}"</strong>
        </p>
        <RouterLink to="/search" class="text-primary text-sm hover:underline underline-offset-4">
          ← Clear search
        </RouterLink>
      </div>

      <div v-else>
        <PatternCard v-for="pattern in patterns" :key="pattern.id" :pattern="pattern" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch, nextTick, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Search } from 'lucide-vue-next'
import { runSearch } from '@/composables/useSearch'
import { useAnchors, type AnchorItem } from '@/composables/useAnchors'
import PatternCard from '@/components/PatternCard.vue'

const route = useRoute()
const router = useRouter()

const query = computed(() => String(route.query.q ?? ''))

const inlineQuery = ref('')
const defaultInputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (!query.value) nextTick(() => defaultInputRef.value?.focus())
})

function submitInline() {
  const q = inlineQuery.value.trim()
  if (!q) return
  router.push({ name: 'search', query: { q } })
}

const patterns = computed(() => {
  if (!query.value.trim()) return []
  return runSearch(query.value)
})

const setAnchors = inject<(items: AnchorItem[]) => void>('setAnchors')
const setActiveId = inject<(id: string) => void>('setActiveId')

const { anchors, activeId } = useAnchors(patterns)

watch(anchors, (items) => setAnchors?.(items), { immediate: true })
watch(activeId, (id) => setActiveId?.(id), { immediate: true })
</script>

<template>
  <div class="space-y-2">
    <template v-if="!query">
      <h1 class="text-3xl font-bold tracking-tight text-foreground">Search</h1>
      <button
        class="flex w-full items-center gap-3 h-11 px-4 text-sm rounded-md border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 cursor-pointer cursor-pointer"
        @click="open"
      >
        <Search class="h-4 w-4 shrink-0" />
        <span class="flex-1 text-left">Search patterns</span>
        <Kbd>{{ isMac ? '⌘' : 'Ctrl' }} + K</Kbd>
      </button>
    </template>

    <template v-else>
      <div class="space-y-1 pb-4 border-b border-border">
        <p class="text-xs text-muted-foreground uppercase tracking-widest font-medium">Search</p>
        <h1 class="text-2xl font-bold tracking-tight text-foreground">
          Results for
          <span class="text-primary">"{{ query }}"</span>
        </h1>
        <p class="text-sm text-muted-foreground">
          {{ patterns.length }} pattern{{ patterns.length !== 1 ? 's' : '' }} found
        </p>
      </div>

      <div v-if="patterns.length === 0" class="py-16 text-center space-y-2">
        <p class="text-muted-foreground text-sm">
          No patterns found for
          <strong class="text-foreground">"{{ query }}"</strong>
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
import { Search } from 'lucide-vue-next'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import PatternCard from '@/components/PatternCard.vue'
import Kbd from '@/components/ui/kbd/Kbd.vue'
import { useCommandPalette } from '@/composables/useCommandPalette'
import { usePageAnchors } from '@/composables/usePageAnchors'
import { runSearch } from '@/composables/useSearch'

const route = useRoute()
const { open } = useCommandPalette()
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)

const query = computed(() => String(route.query.q ?? ''))

const patterns = computed(() => {
  if (!query.value.trim()) return []
  return runSearch(query.value)
})

usePageAnchors(patterns)
</script>

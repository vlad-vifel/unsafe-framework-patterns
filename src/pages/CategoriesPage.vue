<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold tracking-tight text-foreground space-y-1">Categories</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <RouterLink
        v-for="cat in allCategories"
        :key="cat.id"
        :to="`/category/${cat.id}`"
        class="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
      >
        <span class="h-2 w-2 rounded-full bg-muted-foreground shrink-0 group-hover:bg-primary transition-colors" />
        <div class="min-w-0 flex-1">
          <p class="font-medium text-foreground group-hover:text-primary transition-colors">{{ cat.name }}</p>
          <p class="text-xs text-muted-foreground mt-0.5">
            {{ patternCount(cat.id) }} pattern{{ patternCount(cat.id) !== 1 ? 's' : '' }}
          </p>
        </div>
        <ArrowRight class="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import { clearPageAnchors } from '@/composables/usePageAnchors'
import { allCategories, allPatterns } from '@/composables/usePatterns'

clearPageAnchors()

function patternCount(catId: string): number {
  return allPatterns.filter((p) => p.category === catId).length
}
</script>

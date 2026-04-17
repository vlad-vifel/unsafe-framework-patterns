<template>
  <div class="space-y-2">
    <div class="space-y-2 pb-6 border-b border-border">
      <div class="flex items-center gap-2 text-muted-foreground text-sm">
        <Tag class="h-4 w-4" />
        <span>Category</span>
      </div>
      <h1 class="text-3xl font-bold tracking-tight text-foreground">
        {{ category?.name ?? categoryId }}
      </h1>
      <p class="text-sm text-muted-foreground">{{ patterns.length }} pattern{{ patterns.length !== 1 ? 's' : '' }}</p>
    </div>

    <div
      v-if="patterns.length === 0"
      class="rounded-xl border border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground"
    >
      No patterns found for
      <strong>{{ category?.name ?? categoryId }}</strong>
      yet.
    </div>

    <div>
      <PatternCard v-for="pattern in patterns" :key="pattern.id" :pattern="pattern" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Tag } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import PatternCard from '@/components/PatternCard.vue'
import { usePageAnchors } from '@/composables/usePageAnchors'
import { useCategoryPatterns } from '@/composables/usePatterns'

const route = useRoute()
const categoryId = computed(() => String(route.params.name))

const { patterns, category } = useCategoryPatterns(categoryId)

usePageAnchors(patterns)
</script>

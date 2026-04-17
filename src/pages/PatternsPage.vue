<template>
  <div>
    <div class="space-y-2 pb-6 border-b border-border">
      <h1 class="text-3xl font-bold tracking-tight text-foreground">All patterns</h1>
      <p class="text-sm text-muted-foreground">
        {{ allPatterns.length }} pattern{{ allPatterns.length !== 1 ? 's' : '' }}
      </p>
    </div>

    <div>
      <PatternCard v-for="pattern in allPatterns" :key="pattern.id" :pattern="pattern" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import PatternCard from '@/components/PatternCard.vue'
import { usePageAnchors } from '@/composables/usePageAnchors'
import { allPatterns } from '@/composables/usePatterns'

const patterns = computed(() => allPatterns)

usePageAnchors(patterns)
</script>

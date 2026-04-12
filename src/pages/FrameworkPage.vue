<template>
  <div>
    <div class="space-y-2 pb-6 border-b border-border">
      <div class="flex items-center gap-2 text-muted-foreground text-sm">
        <Layers class="h-4 w-4" />
        <span>Framework</span>
      </div>
      <h1 class="text-3xl font-bold tracking-tight text-foreground">
        {{ framework?.name ?? frameworkId }}
      </h1>
      <p class="text-sm text-muted-foreground">
        {{ patterns.length }} pattern{{ patterns.length !== 1 ? 's' : '' }}
      </p>
    </div>

    <div
      v-if="patterns.length === 0"
      class="rounded-xl border border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground"
    >
      No patterns found for <strong>{{ framework?.name ?? frameworkId }}</strong> yet.
    </div>

    <div>
      <PatternCard
        v-for="pattern in patterns"
        :key="pattern.id"
        :pattern="pattern"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFrameworkPatterns } from '@/composables/usePatterns'
import { useAnchors, type AnchorItem } from '@/composables/useAnchors'
import PatternCard from '@/components/PatternCard.vue'
import { Layers } from 'lucide-vue-next'

const route = useRoute()
const frameworkId = computed(() => String(route.params.name))

const { patterns, framework } = useFrameworkPatterns(frameworkId)

const setAnchors = inject<(items: AnchorItem[]) => void>('setAnchors')
const setActiveId = inject<(id: string) => void>('setActiveId')

const { anchors, activeId } = useAnchors(patterns)

watch(anchors, (items) => setAnchors?.(items), { immediate: true })
watch(activeId, (id) => setActiveId?.(id), { immediate: true })
</script>

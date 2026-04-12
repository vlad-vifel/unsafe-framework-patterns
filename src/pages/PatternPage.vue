<template>
  <div>
    <div v-if="!pattern" class="py-16 text-center space-y-2">
      <p class="text-muted-foreground text-sm">
        Pattern <strong class="text-foreground">"{{ patternId }}"</strong> not found.
      </p>
      <RouterLink to="/" class="text-primary text-sm hover:underline underline-offset-4 cursor-pointer">
        ← Back to home
      </RouterLink>
    </div>

    <div v-else>
      <PatternCard :pattern="pattern" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { allPatterns } from '@/composables/usePatterns'
import type { AnchorItem } from '@/composables/useAnchors'
import PatternCard from '@/components/PatternCard.vue'

const route = useRoute()

const patternId = computed(() => String(route.params.id))
const pattern = computed(() => allPatterns.find(p => p.id === patternId.value) ?? null)

const setAnchors = inject<(items: AnchorItem[]) => void>('setAnchors')
const setActiveId = inject<(id: string) => void>('setActiveId')

watch(pattern, () => {
  setAnchors?.([])
  setActiveId?.('')
}, { immediate: true })
</script>

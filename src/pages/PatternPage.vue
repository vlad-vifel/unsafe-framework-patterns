<template>
  <div>
    <div v-if="!pattern" class="py-16 text-center space-y-2">
      <p class="text-muted-foreground text-sm">
        Pattern
        <strong class="text-foreground">"{{ patternId }}"</strong>
        not found.
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
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import PatternCard from '@/components/PatternCard.vue'
import { clearPageAnchors } from '@/composables/usePageAnchors'
import { allPatterns } from '@/composables/usePatterns'

const route = useRoute()

const patternId = computed(() => String(route.params.id))
const pattern = computed(() => allPatterns.find((p) => p.id === patternId.value) ?? null)

clearPageAnchors()
</script>

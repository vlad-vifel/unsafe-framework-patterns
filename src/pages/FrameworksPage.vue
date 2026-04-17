<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold tracking-tight text-foreground space-y-1">Frameworks</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <RouterLink
        v-for="fw in allFrameworks"
        :key="fw.id"
        :to="`/framework/${fw.id}`"
        class="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
      >
        <span class="h-2.5 w-2.5 rounded-full shrink-0" :class="FRAMEWORK_DOT[fw.id] ?? 'bg-muted-foreground'" />
        <div class="min-w-0 flex-1">
          <p class="font-medium text-foreground group-hover:text-primary transition-colors">{{ fw.name }}</p>
          <p class="text-xs text-muted-foreground mt-0.5">
            {{ patternCount(fw.id) }} pattern{{ patternCount(fw.id) !== 1 ? 's' : '' }}
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
import { allFrameworks, allPatterns } from '@/composables/usePatterns'
import { FRAMEWORK_DOT } from '@/constants'

clearPageAnchors()

function patternCount(fwId: string): number {
  return allPatterns.filter((p) => p.framework === fwId).length
}
</script>

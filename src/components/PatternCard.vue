<template>
  <section
    :id="pattern.id"
    :data-pattern-anchor="isPatternPage ? undefined : ''"
    class="scroll-mt-20 border-b border-border last:border-b-0"
    :class="isPatternPage ? 'py-4' : 'py-6'"
  >
    <div class="mb-2">
      <RouterLink v-if="!isPatternPage" :to="patternHref" class="group block cursor-pointer">
        <h2 class="text-2xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
          {{ pattern.title }}
        </h2>
      </RouterLink>
      <h2 v-else class="text-2xl font-semibold tracking-tight text-foreground">
        {{ pattern.title }}
      </h2>
    </div>

    <div class="flex flex-wrap items-center gap-1.5 mb-3">
      <Badge variant="outline" :class="frameworkColor">{{ frameworkName }}</Badge>
      <Badge variant="outline">{{ categoryName }}</Badge>
    </div>

    <p class="text-sm leading-relaxed text-muted-foreground mb-4">
      {{ pattern.description }}
    </p>

    <div v-if="pattern.bad_examples.length || pattern.good_examples.length" class="space-y-4">
      <div v-if="pattern.bad_examples.length" class="flex flex-col gap-2 min-w-0">
        <div class="flex items-center gap-2">
          <ShieldOff class="text-red-500 w-4 h-4" />
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Insecure</span>
        </div>
        <CodeTabGroup :examples="pattern.bad_examples" :lang="codeLang" label="Unsafe" />
      </div>

      <div v-if="pattern.good_examples.length" class="flex flex-col gap-2 min-w-0">
        <div class="flex items-center gap-2">
          <Lock class="text-emerald-500 w-4 h-4" />
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Secure</span>
        </div>
        <CodeTabGroup :examples="pattern.good_examples" :lang="codeLang" label="Safe" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Lock, ShieldOff } from 'lucide-vue-next'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import type { Pattern } from '@/composables/usePatterns'
import { allCategories, allFrameworks } from '@/composables/usePatterns'

import CodeTabGroup from './CodeTabGroup.vue'
import Badge from './ui/badge.vue'

const props = defineProps<{ pattern: Pattern }>()

const route = useRoute()

const isPatternPage = computed(() => route.name === 'pattern')

const patternHref = computed(() => {
  const base = { name: 'pattern', params: { id: props.pattern.id } }
  if (route.name === 'framework') {
    return { ...base, query: { from: 'framework', fromId: String(route.params.name) } }
  }
  if (route.name === 'category') {
    return { ...base, query: { from: 'category', fromId: String(route.params.name) } }
  }
  if (route.name === 'search') {
    return { ...base, query: { from: 'search', q: String(route.query.q ?? '') } }
  }
  return base
})

const frameworkName = computed(
  () => allFrameworks.find((f) => f.id === props.pattern.framework)?.name ?? props.pattern.framework
)
const categoryName = computed(
  () => allCategories.find((c) => c.id === props.pattern.category)?.name ?? props.pattern.category
)

const FRAMEWORK_COLORS: Record<string, string> = {
  react: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800',
  vue: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  angular: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800',
  svelte:
    'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  general: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-400/40 dark:text-zinc-300 border-zinc-200 dark:border-zick-800',
}

const frameworkColor = computed(
  () => FRAMEWORK_COLORS[props.pattern.framework] ?? 'bg-muted text-muted-foreground border-border'
)

const codeLang = computed<string>(() => {
  if (props.pattern.lang) return props.pattern.lang
  const map: Record<string, string> = {
    react: 'tsx',
    vue: 'vue',
    angular: 'typescript',
    svelte: 'html',
    general: 'javascript',
  }
  return map[props.pattern.framework] ?? 'javascript'
})
</script>

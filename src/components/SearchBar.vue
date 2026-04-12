<template>
  <div ref="containerRef" class="relative">
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none z-10" />
      <Input
        ref="inputRef"
        v-model="localQuery"
        type="text"
        placeholder="Search"
        class="w-36 md:w-48 pl-8 pr-7 transition-[width] duration-200 shadow-none"
        @focus="open = true"
        @keydown.enter.prevent="submitSearch"
        @keydown.escape="close"
      />
      <button
        v-if="localQuery"
        class="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center
               rounded text-muted-foreground hover:text-foreground transition-colors z-10"
        @click="clearAndClose"
      >
        <X class="h-3 w-3" />
      </button>
    </div>

    <Transition name="dropdown">
      <div
        v-if="open && localQuery.trim()"
        class="absolute right-0 top-[calc(100%+6px)] z-50 w-80 rounded-xl border border-border
               bg-popover overflow-hidden"
      >
        <template v-if="previewResults.length > 0">
          <button
            v-for="p in previewResults"
            :key="p.id"
            class="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-accent transition-colors group"
            @click="goToPattern(p)"
          >
            <span
              class="mt-0.5 h-2 w-2 rounded-full shrink-0"
              :class="FRAMEWORK_DOT[p.framework] ?? 'bg-muted-foreground'"
            />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-foreground truncate leading-tight">{{ p.title }}</p>
              <p class="text-xs text-muted-foreground mt-0.5 truncate">
                {{ frameworkName(p.framework) }} · {{ categoryName(p.category) }}
              </p>
            </div>
            <ArrowRight class="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
          </button>

          <button
            v-if="allResults.length > PREVIEW_LIMIT"
            class="w-full flex items-center justify-between px-4 py-2.5 border-t border-border
                   text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
            @click="submitSearch"
          >
            <span>Show all {{ allResults.length }} results</span>
            <ArrowRight class="h-3.5 w-3.5" />
          </button>
        </template>

        <div v-else class="px-4 py-6 text-center text-sm text-muted-foreground">
          No results for <span class="font-medium text-foreground">"{{ localQuery }}"</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { Search, X, ArrowRight } from 'lucide-vue-next'
import { runSearch, searchQuery } from '@/composables/useSearch'
import { allFrameworks, allCategories, type Pattern } from '@/composables/usePatterns'
import Input from '@/components/ui/input.vue'

const PREVIEW_LIMIT = 3

const router       = useRouter()
const route        = useRoute()
const containerRef = ref<HTMLElement | null>(null)
const inputRef     = ref<InstanceType<typeof Input> | null>(null)
const open         = ref(false)
const localQuery   = ref('')

watch(localQuery, (q) => { searchQuery.value = q })

watch(() => route.fullPath, () => {
  localQuery.value = ''
  searchQuery.value = ''
  open.value = false
})

const allResults     = computed(() => runSearch(localQuery.value))
const previewResults = computed(() => allResults.value.slice(0, PREVIEW_LIMIT))

const FRAMEWORK_DOT: Record<string, string> = {
  react:   'bg-sky-400',
  vue:     'bg-emerald-400',
  angular: 'bg-red-400',
  svelte:  'bg-orange-400',
}

function frameworkName(id: string) {
  return allFrameworks.find(f => f.id === id)?.name ?? id
}
function categoryName(id: string) {
  return allCategories.find(c => c.id === id)?.name ?? id
}

function close() {
  open.value = false
  inputRef.value?.blur()
}

function clearAndClose() {
  localQuery.value = ''
  searchQuery.value = ''
  open.value = false
}

function goToPattern(p: Pattern) {
  close()
  router.push({
    name: 'pattern',
    params: { id: p.id },
    query: { from: 'search', q: localQuery.value },
  })
}

function submitSearch() {
  if (!localQuery.value.trim()) return
  close()
  router.push({ name: 'search', query: { q: localQuery.value } })
}

onClickOutside(containerRef, close)
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

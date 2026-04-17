<template>
  <div :class="cn('rounded-lg overflow-hidden border border-border relative group', props.class)">
    <div class="md:hidden flex items-center justify-between pl-4 pr-2 py-1.5 bg-muted/50 border-b border-border">
      <span class="text-xs text-muted-foreground font-mono select-none">
        {{ LANG_LABEL[props.lang!] ?? props.label ?? props.lang }}
      </span>
      <Button
        variant="ghost"
        size="sm"
        class="px-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        @click="copyCode"
      >
        <Check v-if="copied" class="h-4 w-4 text-primary" />
        <Copy v-else class="h-4 w-4" />
        {{ copied ? 'Copied!' : 'Copy' }}
      </Button>
    </div>

    <Button
      variant="ghost"
      size="icon"
      class="hidden md:flex absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
      @click="copyCode"
    >
      <Check v-if="copied" class="h-4 w-4 text-primary" />
      <Copy v-else class="h-4 w-4" />
    </Button>

    <div v-if="isLoading" class="p-4 space-y-2 animate-pulse">
      <div class="h-3.5 bg-muted rounded w-3/4" />
      <div class="h-3.5 bg-muted rounded w-1/2" />
      <div class="h-3.5 bg-muted rounded w-5/6" />
      <div class="h-3.5 bg-muted rounded w-2/3" />
    </div>

    <div v-else class="overflow-x-auto" v-html="html" />
  </div>
</template>

<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'

import { useHighlighter } from '@/composables/useHighlighter'
import { useTheme } from '@/composables/useTheme'
import { cn } from '@/lib/utils'

import Button from './ui/button/Button.vue'

const props = withDefaults(
  defineProps<{
    code: string
    lang?: string
    label?: string
    class?: string
  }>(),
  { lang: 'javascript' }
)

const LANG_LABEL: Record<string, string> = {
  javascript: 'JS',
  typescript: 'TS',
  tsx: 'TSX',
  jsx: 'JSX',
  vue: 'Vue',
  svelte: 'Svelte',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  bash: 'Bash',
  sh: 'Shell',
  yaml: 'YAML',
}

const { ensureHighlighter, highlight } = useHighlighter()
const { theme } = useTheme()

const html = ref('')
const copied = ref(false)
const isLoading = ref(true)

async function render() {
  isLoading.value = true
  await ensureHighlighter()
  html.value = highlight(props.code, props.lang!, theme.value === 'dark')
  isLoading.value = false
}

onMounted(render)
watch(() => [props.code, props.lang, theme.value], render)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // silent fail
  }
}
</script>

<style scoped>
:deep(.shiki) {
  margin: 0;
  border-radius: 0;
  border: none;
}
</style>

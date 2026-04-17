<template>
  <button
    class="flex h-9 px-3 items-center gap-2 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 cursor-pointer"
    aria-label="Open search"
    @click="open"
  >
    <Search class="h-4 w-4 shrink-0" />
    <span class="hidden text-xs sm:block">Search</span>
    <Kbd>{{ isMac ? '⌘' : 'Ctrl' }} + K</Kbd>
  </button>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

import Kbd from '@/components/ui/kbd/Kbd.vue'
import KbdGroup from '@/components/ui/kbd/KbdGroup.vue'
import { useCommandPalette } from '@/composables/useCommandPalette'

const { open } = useCommandPalette()
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)
</script>

<template>
  <Tooltip>
    <TooltipTrigger as-child>
      <Button variant="outline" size="icon" :aria-label="label" @click="toggle">
        <Sun v-if="theme === 'dark'" class="h-4 w-4" />
        <Moon v-else class="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom">{{ label }}</TooltipContent>
  </Tooltip>
</template>

<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { computed } from 'vue'

import Button from '@/components/ui/button/Button.vue'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from '@/composables/useTheme'

const { theme, toggle } = useTheme()
const label = computed(() => (theme.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'))
</script>

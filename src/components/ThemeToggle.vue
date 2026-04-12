<template>
  <Button
    variant="outline"
    size="icon"
    :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggle"
  >
    <Sun v-if="theme === 'dark'" class="h-4 w-4" />
    <Moon v-else class="h-4 w-4" />
  </Button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'
import Button from '@/components/ui/button/Button.vue';

const { theme, toggle } = useTheme()
</script>

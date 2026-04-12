<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { computed } from 'vue'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
  {
    variants: {
      variant: {
        default:     'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:   'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline:     'text-foreground border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type BadgeVariants = VariantProps<typeof badgeVariants>

const props = defineProps<{
  variant?: BadgeVariants['variant']
  class?: string
}>()

const classes = computed(() => cn(badgeVariants({ variant: props.variant }), props.class))
</script>

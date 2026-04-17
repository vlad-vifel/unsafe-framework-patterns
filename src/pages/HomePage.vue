<template>
  <div class="space-y-8">
    <h1 class="my-24 text-3xl md:text-5xl text-center font-bold tracking-tight text-foreground/70 dark:text-foreground">
      Unsafe Development Patterns
      <span class="block text-2xl md:text-4xl font-medium mt-0.5">in Modern Frontend Frameworks</span>
    </h1>

    <div class="grid grid-cols-3 gap-3">
      <RouterLink to="/patterns">
        <Card
          class="text-center gap-2 py-4 shadow-none border border-border bg-card/80 dark:bg-card/60 cursor-pointer hover:border-primary/40 hover:bg-card/60 dark:hover:bg-card/20 transition-colors"
        >
          <CardContent class="px-3 pb-0">
            <div class="text-2xl font-bold text-primary">{{ patternCount }}</div>
            <div class="text-xs text-muted-foreground dark:text-foreground mt-0.5">Patterns</div>
          </CardContent>
        </Card>
      </RouterLink>
      <RouterLink to="/frameworks">
        <Card
          class="text-center gap-2 py-4 shadow-none border border-border bg-card/80 dark:bg-card/60 cursor-pointer hover:border-primary/40 hover:bg-card/60 dark:hover:bg-card/20 transition-colors"
        >
          <CardContent class="px-3 pb-0">
            <div class="text-2xl font-bold text-primary">{{ frameworkCount }}</div>
            <div class="text-xs text-muted-foreground dark:text-foreground mt-0.5">Frameworks</div>
          </CardContent>
        </Card>
      </RouterLink>
      <RouterLink to="/categories">
        <Card
          class="text-center gap-2 py-4 shadow-none border border-border bg-card/80 dark:bg-card/60 cursor-pointer hover:border-primary/40 hover:bg-card/60 dark:hover:bg-card/20 transition-colors"
        >
          <CardContent class="px-3 pb-0">
            <div class="text-2xl font-bold text-primary">{{ categoryCount }}</div>
            <div class="text-xs text-muted-foreground dark:text-foreground mt-0.5">Categories</div>
          </CardContent>
        </Card>
      </RouterLink>
    </div>

    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <Layers class="h-3.5 w-3.5 text-muted-foreground" />
        <h2 class="text-sm font-semibold text-foreground">Browse by Framework</h2>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <RouterLink
          v-for="fw in allFrameworks"
          :key="fw.id"
          :to="`/framework/${fw.id}`"
          class="group flex items-center justify-between rounded-lg border border-border bg-card/60 px-3 py-2.5 text-sm hover:border-primary/40 hover:bg-card/20 hover:text-primary transition-colors"
        >
          <span class="font-medium">{{ fw.name }}</span>
          <ArrowRight
            class="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
          />
        </RouterLink>
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <Tag class="h-3.5 w-3.5 text-muted-foreground" />
        <h2 class="text-sm font-semibold text-foreground">Browse by Category</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <RouterLink
          v-for="cat in allCategories"
          :key="cat.id"
          :to="`/category/${cat.id}`"
          class="group flex items-center justify-between gap-2 rounded-lg border border-border bg-card/60 px-3 py-2.5 text-sm hover:border-primary/40 hover:bg-card/20 hover:text-primary transition-colors"
        >
          <span class="font-medium">{{ cat.name }}</span>
          <ArrowRight
            class="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
          />
        </RouterLink>
      </div>
    </div>

    <Card class="gap-3 py-5 bg-card/60 shadow-none">
      <CardContent class="space-y-2">
        <h2 class="text-sm font-semibold text-foreground">About This Project</h2>
        <p class="text-sm text-muted-foreground leading-relaxed">
          This project documents unsafe development patterns found in real-world applications built with popular
          JavaScript frameworks. Each pattern entry includes a description of the vulnerability, a realistic insecure
          example, and a secure alternative with best-practice guidance.
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Layers, Tag } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import { Card, CardContent } from '@/components/ui/card'
import { clearPageAnchors } from '@/composables/usePageAnchors'
import { allCategories, allFrameworks, allPatterns, allRealFrameworks } from '@/composables/usePatterns'

clearPageAnchors()

const patternCount = allPatterns.length
const frameworkCount = allRealFrameworks.length
const categoryCount = allCategories.length
</script>

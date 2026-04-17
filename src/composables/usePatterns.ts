import { computed, type ComputedRef, type Ref } from 'vue'

import categoriesData from '@/data/categories.json'
import frameworksData from '@/data/frameworks.json'
import patternsData from '@/data/patterns.json'

export interface Pattern {
  id: string
  title: string
  framework: string
  category: string
  description: string
  tags: string[]
  bad_examples: string[]
  good_examples: string[]
  lang?: string
}

export interface Framework {
  id: string
  name: string
  notFramework?: boolean
}

export interface Category {
  id: string
  name: string
}

export const allPatterns: Pattern[] = patternsData as Pattern[]
export const allFrameworks: Framework[] = frameworksData as Framework[]
export const allRealFrameworks: Framework[] = allFrameworks.filter((f) => !f.notFramework)
export const allCategories: Category[] = categoriesData as Category[]

export function useFrameworkPatterns(frameworkId: Ref<string>) {
  const patterns = computed(() => allPatterns.filter((p) => p.framework === frameworkId.value))
  const framework = computed(() => allFrameworks.find((f) => f.id === frameworkId.value))
  return { patterns, framework }
}

export function useCategoryPatterns(categoryId: Ref<string>) {
  const patterns = computed(() => allPatterns.filter((p) => p.category === categoryId.value))
  const category = computed(() => allCategories.find((c) => c.id === categoryId.value))
  return { patterns, category }
}

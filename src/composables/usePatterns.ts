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

export interface FrameworkPatternsState {
  patterns: ComputedRef<Pattern[]>
  framework: ComputedRef<Framework | undefined>
}

export interface CategoryPatternsState {
  patterns: ComputedRef<Pattern[]>
  category: ComputedRef<Category | undefined>
}

export const allPatterns: Pattern[] = patternsData as Pattern[]
export const allFrameworks: Framework[] = frameworksData as Framework[]
export const allRealFrameworks: Framework[] = allFrameworks.filter((f) => !f.notFramework)
export const allCategories: Category[] = categoriesData as Category[]

export function useFrameworkPatterns(frameworkId: Ref<string>): FrameworkPatternsState {
  const patterns = computed<Pattern[]>(() => allPatterns.filter((p) => p.framework === frameworkId.value))
  const framework = computed<Framework | undefined>(() => allFrameworks.find((f) => f.id === frameworkId.value))
  return { patterns, framework }
}

export function useCategoryPatterns(categoryId: Ref<string>): CategoryPatternsState {
  const patterns = computed<Pattern[]>(() => allPatterns.filter((p) => p.category === categoryId.value))
  const category = computed<Category | undefined>(() => allCategories.find((c) => c.id === categoryId.value))
  return { patterns, category }
}

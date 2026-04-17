<template>
  <SidebarProvider :class="['h-svh overflow-hidden', isHome && 'bg-sidebar']">
    <AppSidebar v-if="!isHome" />

    <SidebarInset :class="['overflow-hidden flex flex-col', isHome && 'md:m-2 md:rounded-xl']">
      <header class="shrink-0 flex h-12 items-center gap-2 border-b border-border px-2 md:px-3">
        <Tooltip v-if="!isHome">
          <TooltipTrigger as-child>
            <SidebarTrigger class="text-muted-foreground hover:text-foreground cursor-pointer shrink-0" />
          </TooltipTrigger>
          <TooltipContent side="bottom">Toggle sidebar</TooltipContent>
        </Tooltip>

        <RouterLink v-if="isHome" to="/" class="flex items-center gap-2 cursor-pointer group shrink-0 pl-2">
          <span class="font-semibold text-sm tracking-tight text-foreground transition-colors whitespace-nowrap">
            Unsafe Framework Patterns
          </span>
        </RouterLink>

        <Separator v-if="!isHome" orientation="vertical" class="h-4 shrink-0" />

        <template v-if="!isHome && breadcrumbs.length">
          <div class="flex-1 md:hidden" />
          <Breadcrumb class="hidden md:flex flex-1 min-w-0 pl-2 overflow-hidden">
            <BreadcrumbList class="flex-nowrap overflow-hidden">
              <template v-for="(crumb, i) in breadcrumbs" :key="`${crumb.label}-${i}`">
                <BreadcrumbItem class="min-w-0" :class="i === breadcrumbs.length - 1 ? 'overflow-hidden' : 'shrink-0'">
                  <BreadcrumbLink as-child>
                    <RouterLink
                      :to="crumb.href"
                      class="text-muted-foreground hover:text-primary text-sm cursor-pointer transition-colors"
                      :class="
                        i === breadcrumbs.length - 1
                          ? 'block truncate font-medium text-foreground/80'
                          : 'whitespace-nowrap'
                      "
                    >
                      {{ crumb.label }}
                    </RouterLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="i < breadcrumbs.length - 1" class="shrink-0" />
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </template>
        <div v-else class="flex-1" />

        <div class="flex items-center gap-1.5 shrink-0 justify-end">
          <SearchBar v-if="!isHome" />
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                as="a"
                variant="outline"
                size="icon"
                class="cursor-pointer"
                href="https://github.com/vlad-vifel/semgrep-frameworks"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
              >
                <Github class="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">View on GitHub</TooltipContent>
          </Tooltip>
          <ThemeToggle />
        </div>
      </header>

      <div class="relative flex flex-1 min-h-0 overflow-hidden">
        <main id="main-content" class="relative flex-1 overflow-y-auto min-w-0" @scroll="onMainScroll">
          <Aurora
            v-if="isHome"
            :color-stops="[brandColorLighter, brandColor, brandColorLighter]"
            :amplitude="0.5"
            :blend="0.7"
            :speed="0.7"
            :intensity="0.9"
            class="absolute top-0 pointer-events-none"
          />

          <div class="mx-auto py-6 relative" :class="isHome ? 'max-w-3xl px-6 md:px-10' : 'max-w-5xl px-4 md:px-6'">
            <RouterView />
          </div>
        </main>

        <aside
          v-if="!isHome && anchors.length > 0"
          class="hidden xl:flex xl:flex-col w-52 shrink-0 border-l border-border overflow-y-auto"
        >
          <RightSidebar :anchors="anchors" :active-id="activeId" @scroll="scrollToAnchor" />
        </aside>

        <Transition name="fade">
          <div
            v-if="showBackToTop && !isHome"
            class="absolute bottom-6 right-6 z-10 pointer-events-none"
            :class="anchors.length > 0 ? 'xl:right-[14.5rem]' : ''"
          >
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="outline"
                  size="icon"
                  class="pointer-events-auto cursor-pointer bg-background! shadow-sm"
                  aria-label="Back to top"
                  @click="scrollToTop"
                >
                  <ArrowUp class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Back to top</TooltipContent>
            </Tooltip>
          </div>
        </Transition>
      </div>

      <CommandPalette />
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { ArrowUp, Github } from 'lucide-vue-next'
import { computed, provide, ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink, RouterView, useRoute } from 'vue-router'

import AppSidebar from '@/components/AppSidebar.vue'
import Aurora from '@/components/Aurora.vue'
import CommandPalette from '@/components/CommandPalette.vue'
import RightSidebar from '@/components/RightSidebar.vue'
import SearchBar from '@/components/SearchBar.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Button from '@/components/ui/button/Button.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { AnchorItem } from '@/composables/useAnchors'
import { allCategories, allFrameworks, allPatterns } from '@/composables/usePatterns'

const anchors = ref<AnchorItem[]>([])
const activeId = ref<string>('')
const showBackToTop = ref<boolean>(false)

provide('setAnchors', (items: AnchorItem[]) => {
  anchors.value = items
})
provide('setActiveId', (id: string) => {
  activeId.value = id
})

const route = useRoute()
const isHome = computed<boolean>(() => route.name === 'home')

function asString(v: unknown): string | null {
  return typeof v === 'string' ? v : null
}

function scrollToAnchor(id: string): void {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToTop(): void {
  const el = document.getElementById('main-content')
  if (el) el.scrollTo({ top: 0, behavior: 'smooth' })
}

function onMainScroll(e: Event): void {
  const target = e.target as HTMLElement | null
  if (target) showBackToTop.value = target.scrollTop > 300
}

interface Crumb {
  label: string
  href: RouteLocationRaw
}

const breadcrumbs = computed<Crumb[]>(() => {
  if (isHome.value) return []

  if (route.name === 'patterns') {
    return [{ label: 'All patterns', href: '/patterns' }]
  }

  if (route.name === 'frameworks') {
    return [{ label: 'Frameworks', href: '/frameworks' }]
  }

  if (route.name === 'framework') {
    const id = String(route.params.name)
    const name = allFrameworks.find((f) => f.id === id)?.name ?? id
    return [
      { label: 'Frameworks', href: '/frameworks' },
      { label: name, href: `/framework/${id}` },
    ]
  }

  if (route.name === 'categories') {
    return [{ label: 'Categories', href: '/categories' }]
  }

  if (route.name === 'category') {
    const id = String(route.params.name)
    const name = allCategories.find((c) => c.id === id)?.name ?? id
    return [
      { label: 'Categories', href: '/categories' },
      { label: name, href: `/category/${id}` },
    ]
  }

  if (route.name === 'search') {
    const q = asString(route.query.q)
    return [
      { label: 'Search', href: '/search' },
      ...(q ? [{ label: `"${q}"`, href: { path: '/search', query: { q } } }] : []),
    ]
  }

  if (route.name === 'pattern') {
    const patternId = String(route.params.id)
    const pattern = allPatterns.find((p) => p.id === patternId)
    const title = pattern?.title ?? patternId
    const selfHref = { name: 'pattern', params: { id: patternId }, query: route.query }

    const from = asString(route.query.from)
    const fromId = asString(route.query.fromId)
    const q = asString(route.query.q)

    if (from === 'framework' && fromId) {
      const fwName = allFrameworks.find((f) => f.id === fromId)?.name ?? fromId
      return [
        { label: 'Frameworks', href: '/frameworks' },
        { label: fwName, href: `/framework/${fromId}` },
        { label: title, href: selfHref },
      ]
    }

    if (from === 'category' && fromId) {
      const catName = allCategories.find((c) => c.id === fromId)?.name ?? fromId
      return [
        { label: 'Categories', href: '/categories' },
        { label: catName, href: `/category/${fromId}` },
        { label: title, href: selfHref },
      ]
    }

    if (from === 'search' && q) {
      return [
        { label: 'Search', href: '/search' },
        { label: `"${q}"`, href: { path: '/search', query: { q } } },
        { label: title, href: selfHref },
      ]
    }

    return [{ label: title, href: selfHref }]
  }

  return []
})

const brandColor = '#AA3BFF'
const brandColorLighter = '#C084FF'
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

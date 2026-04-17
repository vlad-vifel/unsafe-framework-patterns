<template>
  <Sidebar variant="inset" collapsible="offcanvas" class="overflow-hidden">
    <SidebarHeader class="pb-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child class="cursor-pointer transition-colors hover:bg-sidebar-primary/10">
            <RouterLink to="/">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0"
              >
                <ShieldAlert class="size-4" />
              </div>
              <div class="flex flex-col gap-0.5 leading-none min-w-0">
                <span class="font-semibold text-sm truncate">Unsafe Patterns</span>
              </div>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent class="overflow-x-hidden" @click="closeMobileIfNeeded">
      <SidebarGroup>
        <SidebarGroupLabel as-child>
          <RouterLink
            to="/frameworks"
            class="flex items-center gap-1.5 cursor-pointer transition-colors hover:text-primary"
          >
            <Layers class="size-3.5 shrink-0" :class="isFrameworksPage && 'text-primary'" />
            <span :class="isFrameworksPage && 'text-primary'">Frameworks</span>
          </RouterLink>
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem v-for="fw in allFrameworks" :key="fw.id">
            <SidebarMenuButton
              as-child
              :class="[
                'cursor-pointer transition-colors',
                isActiveFramework(fw.id)
                  ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
                  : 'hover:bg-sidebar-primary/10 hover:text-sidebar-foreground',
              ]"
            >
              <RouterLink :to="`/framework/${fw.id}`" class="flex items-center gap-2 truncate">
                <span class="h-2 w-2 rounded-full shrink-0" :class="FRAMEWORK_DOT[fw.id] ?? 'bg-muted-foreground'" />
                <span class="truncate">{{ fw.name }}</span>
              </RouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel as-child>
          <RouterLink
            to="/categories"
            class="flex items-center gap-1.5 cursor-pointer transition-colors hover:text-primary"
          >
            <Tag class="size-3.5 shrink-0" :class="isCategoriesPage && 'text-primary'" />
            <span :class="isCategoriesPage && 'text-primary'">Categories</span>
          </RouterLink>
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem v-for="cat in allCategories" :key="cat.id">
            <SidebarMenuButton
              as-child
              :class="[
                'cursor-pointer transition-colors',
                isActiveCategory(cat.id)
                  ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
                  : 'hover:bg-sidebar-primary/10 hover:text-sidebar-foreground',
              ]"
            >
              <RouterLink :to="`/category/${cat.id}`" class="flex items-center gap-2 truncate">
                <span class="h-2 w-2 rounded-full bg-current shrink-0 opacity-60" />
                <span class="truncate">{{ cat.name }}</span>
              </RouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel as-child>
          <RouterLink
            to="/patterns"
            class="flex items-center gap-1.5 cursor-pointer transition-colors hover:text-primary"
          >
            <LayoutList class="size-3.5 shrink-0" :class="isPatternsPage && 'text-primary'" />
            <span :class="isPatternsPage && 'text-primary'">All patterns</span>
          </RouterLink>
        </SidebarGroupLabel>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>

<script setup lang="ts">
import { Layers, LayoutList, ShieldAlert, Tag } from 'lucide-vue-next'
import { computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import { allCategories, allFrameworks, allPatterns } from '@/composables/usePatterns'
import { FRAMEWORK_DOT } from '@/constants'

const route = useRoute()
const { isMobile, setOpenMobile } = useSidebar()

function closeMobileIfNeeded() {
  if (isMobile.value) setOpenMobile(false)
}

onMounted(() => {
  if (isMobile.value) setOpenMobile(false)
})

watch(
  () => route.fullPath,
  () => {
    if (isMobile.value) setOpenMobile(false)
  }
)

const isFrameworksPage = computed(() => route.name === 'frameworks')
const isCategoriesPage = computed(() => route.name === 'categories')
const isPatternsPage = computed(() => route.name === 'patterns')

function isActiveFramework(fwId: string): boolean {
  if (route.name === 'frameworks' || route.name === 'pattern') return false
  if (route.name === 'framework') return String(route.params.name) === fwId
  if (route.name === 'pattern') {
    const from = route.query.from as string | undefined
    if (from === 'framework') return (route.query.fromId as string) === fwId
    const pattern = allPatterns.find((p) => p.id === String(route.params.id))
    return pattern?.framework === fwId
  }
  return false
}

function isActiveCategory(catId: string): boolean {
  if (route.name === 'categories' || route.name === 'pattern') return false
  if (route.name === 'category') return String(route.params.name) === catId
  if (route.name === 'pattern') {
    const from = route.query.from as string | undefined
    if (from === 'category') return (route.query.fromId as string) === catId
    const pattern = allPatterns.find((p) => p.id === String(route.params.id))
    return pattern?.category === catId
  }
  return false
}
</script>

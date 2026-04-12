<template>
  <CodeBlock
    v-if="examples.length === 1"
    :code="examples[0]"
    :lang="lang"
    :label="label"
  />

  <Tabs v-else default-value="0" class="gap-0">
    <TabsList class="mb-0 rounded-b-none border border-b-0 border-border bg-muted/50 px-1 h-8">
      <TabsTrigger
        v-for="(_, i) in examples"
        :key="i"
        :value="String(i)"
        class="h-6 px-3 text-xs data-[state=active]:text-primary"
      >
        Example {{ i + 1 }}
      </TabsTrigger>
    </TabsList>

    <TabsContent
      v-for="(ex, i) in examples"
      :key="i"
      :value="String(i)"
      class="mt-0"
    >
      <CodeBlock :code="ex" :lang="lang" :label="label" class="rounded-tl-none" />
    </TabsContent>
  </Tabs>
</template>

<script setup lang="ts">
import CodeBlock from './CodeBlock.vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'

defineProps<{
  examples: string[]
  lang: string
  label: string
}>()
</script>

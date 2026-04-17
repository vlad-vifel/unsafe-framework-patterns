import Fuse from 'fuse.js'
import { ref } from 'vue'

import { allPatterns, type Pattern } from './usePatterns'

const fuseOptions: Fuse.IFuseOptions<Pattern> = {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'tags', weight: 2 },
    { name: 'id', weight: 1 },
  ],
  threshold: 0.3,
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
}

const fuse = new Fuse(allPatterns, fuseOptions)

export const searchQuery = ref('')

export function runSearch(q: string): Pattern[] {
  if (!q.trim()) return []
  return fuse.search(q.trim()).map((r) => r.item)
}

import { ref } from 'vue'
import type { Highlighter } from 'shiki'

let highlighterPromise: Promise<Highlighter> | null = null

const THEMES = ['github-dark', 'github-light'] as const
const LANGS = ['javascript', 'typescript', 'vue', 'html', 'jsx', 'tsx', 'css', 'bash', 'json'] as const

async function initHighlighter(): Promise<Highlighter> {
  const { createHighlighter } = await import('shiki')
  return createHighlighter({
    themes: [...THEMES],
    langs: [...LANGS],
  })
}

export function useHighlighter() {
  const highlighter = ref<Highlighter | null>(null)

  async function ensureHighlighter() {
    if (highlighter.value) return highlighter.value

    try {
      if (!highlighterPromise) {
        highlighterPromise = initHighlighter()
      }
      highlighter.value = await highlighterPromise
    } catch {
      highlighterPromise = null
    }

    return highlighter.value
  }

  function highlight(code: string, lang: string, isDark: boolean): string {
    const h = highlighter.value
    if (!h) return `<pre><code>${escapeHtml(code)}</code></pre>`

    const theme = isDark ? 'github-dark' : 'github-light'
    const safeLang = (LANGS as readonly string[]).includes(lang) ? lang : 'javascript'

    return h.codeToHtml(code, { lang: safeLang, theme })
  }

  return { ensureHighlighter, highlight }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

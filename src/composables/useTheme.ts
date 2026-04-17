import { type Ref,ref, watch } from 'vue'

type Theme = 'light' | 'dark'

export interface ThemeState {
  theme: Ref<Theme>
  toggle: () => void
}

const theme = ref<Theme>(
  (localStorage.getItem('theme') as Theme | null) ??
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
)

function applyTheme(t: Theme): void {
  if (t === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', t)
}

applyTheme(theme.value)

watch(theme, applyTheme)

export function useTheme(): ThemeState {
  function toggle(): void {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggle }
}

import { ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>(
  (localStorage.getItem('theme') as Theme) ??
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
)

function applyTheme(t: Theme) {
  if (t === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', t)
}

applyTheme(theme.value)

watch(theme, applyTheme)

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggle }
}

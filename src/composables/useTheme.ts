import { ref, readonly, watch } from 'vue'
import { resolveInitialTheme, THEME_STORAGE_KEY, type Theme } from '@/utils/theme'

function readStored(): string | null {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY)
  } catch {
    return null
  }
}

function initialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return resolveInitialTheme(readStored(), window.matchMedia('(prefers-color-scheme: dark)').matches)
}

// Resolved synchronously at module load — before first paint — rather than in
// onMounted, which rendered one light frame for every dark-mode visitor.
const isDark = ref(initialTheme() === 'dark')

if (typeof document !== 'undefined') {
  watch(isDark, (value) => {
    document.documentElement.classList.toggle('dark', value)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, value ? 'dark' : 'light')
    } catch {
      // Private mode or blocked storage — the toggle still works for this visit.
    }
  }, { immediate: true })
}

export function useTheme() {
  return {
    isDark: readonly(isDark),
    toggleDark: () => { isDark.value = !isDark.value }
  }
}

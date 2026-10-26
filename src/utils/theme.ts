export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme'

/**
 * Decides the theme to paint with on first render.
 *
 * `index.html` runs the same rule in an inline script before Vue boots, so a
 * dark-mode visitor no longer gets a white flash while the app mounts.
 */
export function resolveInitialTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === 'dark' || stored === 'light') return stored
  return prefersDark ? 'dark' : 'light'
}

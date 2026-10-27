// @vitest-environment jsdom
import { describe, test, expect, vi } from 'vitest'

function stubMatchMedia(prefersDark: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: prefersDark && query.includes('dark'),
    media: query,
    onchange: null,
    addListener() {}, removeListener() {},
    addEventListener() {}, removeEventListener() {},
    dispatchEvent() { return false }
  })) as unknown as typeof window.matchMedia
}

/** Re-imports the module so each case starts from a clean singleton. */
async function loadTheme({ stored = null, prefersDark = false }: { stored?: string | null; prefersDark?: boolean }) {
  vi.resetModules()
  localStorage.clear()
  if (stored !== null) localStorage.setItem('theme', stored)
  document.documentElement.className = ''
  stubMatchMedia(prefersDark)
  const { nextTick } = await import('vue')
  const { useTheme } = await import('../useTheme')
  return { useTheme, nextTick }
}

const isDarkApplied = () => document.documentElement.classList.contains('dark')

describe('useTheme — only an explicit choice is remembered', () => {
  test('stores nothing when a first-time visitor prefers light', async () => {
    await loadTheme({ prefersDark: false })
    expect(localStorage.getItem('theme')).toBeNull()
  })

  test('stores nothing when a first-time visitor prefers dark either', async () => {
    await loadTheme({ prefersDark: true })
    expect(localStorage.getItem('theme')).toBeNull()
  })

  test('remembers the theme once the visitor actually toggles', async () => {
    const { useTheme, nextTick } = await loadTheme({ prefersDark: false })
    useTheme().toggleDark()
    await nextTick()
    expect(localStorage.getItem('theme')).toBe('dark')
  })
})

describe('useTheme — the document still follows the resolved theme', () => {
  test('applies the OS preference on load', async () => {
    await loadTheme({ prefersDark: true })
    expect(isDarkApplied()).toBe(true)
  })

  test('a stored choice beats the OS preference', async () => {
    await loadTheme({ stored: 'light', prefersDark: true })
    expect(isDarkApplied()).toBe(false)
  })

  test('toggling updates the document', async () => {
    const { useTheme, nextTick } = await loadTheme({ prefersDark: false })
    useTheme().toggleDark()
    await nextTick()
    expect(isDarkApplied()).toBe(true)
  })
})

import { describe, test, expect } from 'vitest'
import { resolveInitialTheme } from '../theme'

describe('resolveInitialTheme', () => {
  test('honours an explicit stored choice over the OS preference', () => {
    expect(resolveInitialTheme('light', true)).toBe('light')
    expect(resolveInitialTheme('dark', false)).toBe('dark')
  })

  test('falls back to the OS preference when nothing is stored', () => {
    expect(resolveInitialTheme(null, true)).toBe('dark')
    expect(resolveInitialTheme(null, false)).toBe('light')
  })

  test('ignores a stored value that is not a known theme', () => {
    expect(resolveInitialTheme('banana', true)).toBe('dark')
    expect(resolveInitialTheme('', false)).toBe('light')
  })
})

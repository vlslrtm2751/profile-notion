import { describe, test, expect } from 'vitest'
import { UI, uiText, type UiKey } from '../ui'

describe('uiText', () => {
  test('returns the Korean chrome string', () => {
    expect(uiText('section.experience', 'ko')).toBe('경력')
  })

  test('returns the English chrome string', () => {
    expect(uiText('section.experience', 'en')).toBe('Experience')
  })

  test('translates the still-employed marker', () => {
    expect(uiText('experience.present', 'ko')).toBe('재직중')
    expect(uiText('experience.present', 'en')).toBe('Present')
  })

  test('falls back to the key itself so a missing string is visible, not blank', () => {
    expect(uiText('nope.not.a.key' as UiKey, 'ko')).toBe('nope.not.a.key')
  })
})

describe('UI table', () => {
  test('every key has a non-empty string in both languages', () => {
    const incomplete = Object.entries(UI).filter(
      ([, v]) => !v.ko?.trim() || !v.en?.trim()
    )
    expect(incomplete.map(([k]) => k)).toEqual([])
  })

  test('covers every section heading the page renders', () => {
    const required = [
      'section.about', 'section.skills', 'section.experience',
      'section.projects', 'section.certifications', 'section.education'
    ]
    expect(required.filter((k) => !(k in UI))).toEqual([])
  })
})

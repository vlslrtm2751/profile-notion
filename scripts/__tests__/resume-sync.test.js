import { describe, test, expect } from 'vitest'
import { withResolvedTimestamp } from '../lib/resume-sync.js'

const base = {
  meta: { updatedAt: '2026-04-02' },
  profile: { name: { ko: '이강현', en: 'Kanghyun Lee' } },
  skills: { language: ['TypeScript'] },
  experiences: [{ company: { ko: '(주)타이니피아', en: '' } }]
}

describe('withResolvedTimestamp', () => {
  test('keeps the previous updatedAt when nothing but the timestamp differs', () => {
    const existing = base
    const next = { ...structuredClone(base), meta: { updatedAt: '2026-10-26' } }

    const result = withResolvedTimestamp(existing, next, '2026-10-26')

    expect(result.meta.updatedAt).toBe('2026-04-02')
  })

  test('uses today when any content actually changed', () => {
    const existing = base
    const next = structuredClone(base)
    next.skills.language.push('JavaScript (ES6+)')

    const result = withResolvedTimestamp(existing, next, '2026-10-26')

    expect(result.meta.updatedAt).toBe('2026-10-26')
  })

  test('uses today when there is no previous resume', () => {
    const result = withResolvedTimestamp(null, structuredClone(base), '2026-10-26')

    expect(result.meta.updatedAt).toBe('2026-10-26')
  })

  test('ignores key order when comparing content', () => {
    const existing = { meta: { updatedAt: '2026-04-02' }, a: { x: 1, y: 2 } }
    const next = { meta: { updatedAt: '2026-10-26' }, a: { y: 2, x: 1 } }

    const result = withResolvedTimestamp(existing, next, '2026-10-26')

    expect(result.meta.updatedAt).toBe('2026-04-02')
  })

  test('falls back to today when the previous resume has no meta block', () => {
    const existing = { a: { x: 1 } }
    const next = { meta: { updatedAt: '2026-10-26' }, a: { x: 1 } }

    const result = withResolvedTimestamp(existing, next, '2026-10-26')

    expect(result.meta.updatedAt).toBe('2026-10-26')
  })

  test('preserves the rest of the next resume untouched', () => {
    const existing = base
    const next = structuredClone(base)
    next.skills.language = ['Rust']

    const result = withResolvedTimestamp(existing, next, '2026-10-26')

    expect(result.skills.language).toEqual(['Rust'])
  })
})

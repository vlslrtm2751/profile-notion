import { describe, test, expect } from 'vitest'
import { yearsOfExperience, countSkills } from '../stats'
import type { Experience, Skills } from '@/types/resume'

const exp = (start: string, end: string | null = null) =>
  ({ period: { start, end } }) as Experience

describe('yearsOfExperience', () => {
  test('counts full years from the earliest start to now', () => {
    expect(yearsOfExperience([exp('2023.11')], new Date('2026-10-26'))).toBe(2)
  })

  test('rolls over on the anniversary month', () => {
    expect(yearsOfExperience([exp('2023.11')], new Date('2026-11-01'))).toBe(3)
  })

  test('uses the earliest start when several jobs are listed', () => {
    const result = yearsOfExperience(
      [exp('2025.09'), exp('2023.11', '2025.08')],
      new Date('2026-10-26')
    )
    expect(result).toBe(2)
  })

  test('returns 0 when there is no experience', () => {
    expect(yearsOfExperience([], new Date('2026-10-26'))).toBe(0)
  })

  test('ignores entries whose period cannot be parsed', () => {
    expect(yearsOfExperience([exp('재직중'), exp('2023.11')], new Date('2026-10-26'))).toBe(2)
  })

  test('never returns a negative span for a future start date', () => {
    expect(yearsOfExperience([exp('2030.01')], new Date('2026-10-26'))).toBe(0)
  })
})

describe('countSkills', () => {
  test('totals every skill group', () => {
    const skills = {
      language: ['TypeScript', 'JavaScript'],
      framework: ['Vue'],
      db: ['MySQL'],
      etc: ['Git']
    } as Skills
    expect(countSkills(skills)).toBe(5)
  })

  test('returns 0 for empty groups', () => {
    expect(countSkills({ language: [], framework: [], db: [], etc: [] } as Skills)).toBe(0)
  })
})

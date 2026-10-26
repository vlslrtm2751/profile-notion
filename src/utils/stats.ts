import type { Experience, Skills } from '@/types/resume'

/** Parses a Notion period string like "2023.11" into a comparable month index. */
function toMonthIndex(period: string): number | null {
  const match = /^(\d{4})\.(\d{1,2})$/.exec(period.trim())
  if (!match) return null
  return Number(match[1]) * 12 + (Number(match[2]) - 1)
}

/**
 * Full years between the earliest listed job start and `now`.
 *
 * Replaces the hard-coded "2년+" in the hero, which would quietly go stale.
 */
export function yearsOfExperience(experiences: Experience[], now: Date): number {
  const starts = experiences
    .map((e) => toMonthIndex(e.period?.start ?? ''))
    .filter((m): m is number => m !== null)
  if (!starts.length) return 0

  const earliest = Math.min(...starts)
  const current = now.getFullYear() * 12 + now.getMonth()
  return Math.max(0, Math.floor((current - earliest) / 12))
}

/** Total number of skills across every group. */
export function countSkills(skills: Skills): number {
  return Object.values(skills).reduce((total, group) => total + (group?.length ?? 0), 0)
}

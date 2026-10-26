// @vitest-environment jsdom
import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroSection from '../HeroSection.vue'
import resumeData from '@/data/resume.json'
import type { ResumeData } from '@/types/resume'
import { yearsOfExperience, countSkills } from '@/utils/stats'

const resume = resumeData as ResumeData

describe('HeroSection stats — derived, not hard-coded', () => {
  test('shows the career length computed from the Notion data', () => {
    const years = yearsOfExperience(resume.experiences, new Date())
    expect(mount(HeroSection).text()).toContain(`${years}+`)
  })

  test('shows the real number of skills', () => {
    expect(mount(HeroSection).text()).toContain(String(countSkills(resume.skills)))
  })

  test('shows the real number of certifications', () => {
    expect(mount(HeroSection).text()).toContain(String(resume.certifications.length))
  })

  test('no longer claims a module count that exists nowhere in the data', () => {
    expect(mount(HeroSection).text()).not.toContain('22개+')
  })
})

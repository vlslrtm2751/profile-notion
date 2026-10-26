// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useLanguage } from '@/composables/useLanguage'
import AboutSection from '../AboutSection.vue'
import HeroSection from '../HeroSection.vue'
import SkillsSection from '../SkillsSection.vue'
import ExperienceSection from '../ExperienceSection.vue'

const { lang, toggleLang } = useLanguage()

beforeEach(() => {
  if (lang.value !== 'ko') toggleLang()
})

describe('AboutSection — the profile image that 404s on GitHub Pages', () => {
  test('resolves the avatar against the deploy base', () => {
    const img = mount(AboutSection).get('img')
    expect(img.attributes('src')).toBe('/profile-notion/images/logan.png')
  })

  test('resolves it the same way the hero does', () => {
    const about = mount(AboutSection).get('img').attributes('src')
    const hero = mount(HeroSection).get('img').attributes('src')
    expect(about).toBe(hero)
  })
})

describe('SkillsSection — invented proficiency numbers are gone', () => {
  test('renders no proficiency bars', () => {
    expect(mount(SkillsSection).findAll('.skill-bar-fill')).toHaveLength(0)
  })

  test('shows no percentage figures', () => {
    expect(mount(SkillsSection).text()).not.toMatch(/\d+%/)
  })

  test('still lists the skills that came from Notion', () => {
    expect(mount(SkillsSection).text()).toContain('TypeScript')
  })
})

describe('ExperienceSection — bullets must survive the English toggle', () => {
  test('renders task bullets in Korean mode', () => {
    expect(mount(ExperienceSection).findAll('li').length).toBeGreaterThan(0)
  })

  test('still renders them after switching to English', async () => {
    const wrapper = mount(ExperienceSection)
    const before = wrapper.findAll('li').length
    toggleLang()
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('li').length).toBe(before)
  })

  test('labels an ongoing job with the translated marker', async () => {
    const wrapper = mount(ExperienceSection)
    expect(wrapper.text()).toContain('재직중')
    toggleLang()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Present')
  })
})

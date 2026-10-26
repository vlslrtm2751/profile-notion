// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useLanguage } from '../useLanguage'

const { lang, toggleLang, t, tList, ui } = useLanguage()

beforeEach(() => {
  if (lang.value !== 'ko') toggleLang()
})

describe('ui — app chrome follows the toggle', () => {
  test('starts in Korean', () => {
    expect(ui('section.experience')).toBe('경력')
  })

  test('switches to English after toggling', () => {
    toggleLang()
    expect(ui('section.experience')).toBe('Experience')
  })
})

describe('t — Notion content stays readable in both modes', () => {
  test('prefers the English value when Notion supplied one', () => {
    toggleLang()
    expect(t({ ko: '이강현', en: 'Kanghyun Lee' })).toBe('Kanghyun Lee')
  })

  test('falls back to Korean when the English value is empty', () => {
    toggleLang()
    expect(t({ ko: '(주)타이니피아', en: '' })).toBe('(주)타이니피아')
  })
})

describe('tList — the bug that emptied the experience bullets in EN', () => {
  test('falls back to the Korean list when the English list is empty', () => {
    toggleLang()
    expect(tList({ ko: ['유연근무제 모듈 구현'], en: [] })).toEqual(['유연근무제 모듈 구현'])
  })

  test('uses the English list when Notion supplied one', () => {
    toggleLang()
    expect(tList({ ko: ['가'], en: ['A'] })).toEqual(['A'])
  })

  test('returns the Korean list in Korean mode', () => {
    expect(tList({ ko: ['가'], en: ['A'] })).toEqual(['가'])
  })
})

describe('document language', () => {
  test('keeps <html lang> in sync with the toggle', async () => {
    toggleLang()
    await nextTick()
    expect(document.documentElement.lang).toBe('en')

    toggleLang()
    await nextTick()
    expect(document.documentElement.lang).toBe('ko')
  })
})

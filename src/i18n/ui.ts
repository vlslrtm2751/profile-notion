/**
 * UI chrome strings.
 *
 * Scope: labels the app itself owns — navigation, section headings, badges,
 * aria-labels. Résumé content comes from Notion and is rendered as-is (see
 * `t()` in useLanguage), so it stays Korean regardless of this toggle.
 *
 * Korean values intentionally match what the page shipped before the i18n
 * refactor, so switching to a table changed no pixels in the default view.
 */
export type Lang = 'ko' | 'en'

export const UI = {
  'nav.about':              { ko: 'About',        en: 'About' },
  'nav.skills':             { ko: 'Skills',       en: 'Skills' },
  'nav.experience':         { ko: '경력',          en: 'Experience' },
  'nav.projects':           { ko: '프로젝트',      en: 'Projects' },
  'nav.certifications':     { ko: '자격증',        en: 'Certifications' },
  'nav.education':          { ko: '학력',          en: 'Education' },

  'section.about':          { ko: 'About Me',     en: 'About Me' },
  'section.skills':         { ko: 'Skills',       en: 'Skills' },
  'section.experience':     { ko: '경력',          en: 'Experience' },
  'section.projects':       { ko: '프로젝트',      en: 'Projects' },
  'section.certifications': { ko: '자격증',        en: 'Certifications' },
  'section.education':      { ko: '학력 및 교육',  en: 'Education' },

  'skills.group.language':  { ko: 'Language',            en: 'Language' },
  'skills.group.framework': { ko: 'Framework / UI',      en: 'Framework / UI' },
  'skills.group.db':        { ko: 'DB / Cloud / Tools',  en: 'DB / Cloud / Tools' },
  'skills.group.etc':       { ko: 'Collaboration',       en: 'Collaboration' },

  'experience.present':     { ko: '재직중',        en: 'Present' },
  'projects.private':       { ko: '비공개',        en: 'Private' },

  'education.academic':      { ko: '학력',          en: 'Academic' },
  'education.training':      { ko: '교육',          en: 'Training' },
  'education.military':      { ko: '병역',          en: 'Military Service' },
  'education.militaryLabel': { ko: '병역사항',      en: 'Military Service' },

  'hero.scroll':            { ko: 'Scroll',       en: 'Scroll' },

  'stat.years':             { ko: '경력 (년)',     en: 'Years' },
  'stat.skills':            { ko: '보유 기술',     en: 'Skills' },
  'stat.certifications':    { ko: '자격증',        en: 'Certifications' },

  'footer.lastUpdated':     { ko: '최종 업데이트', en: 'Last updated' },
  'footer.builtWith':       { ko: 'Built with Vue 3 + Tailwind CSS', en: 'Built with Vue 3 + Tailwind CSS' },
  'footer.syncedFrom':      { ko: 'Notion에서 자동 동기화', en: 'Auto-synced from Notion' },

  'a11y.toDark':            { ko: '다크 모드로 전환',   en: 'Switch to dark mode' },
  'a11y.toLight':           { ko: '라이트 모드로 전환', en: 'Switch to light mode' },
  'a11y.toggleMenu':        { ko: '메뉴 열기/닫기',     en: 'Toggle menu' },
  'a11y.toggleLang':        { ko: '언어 전환',          en: 'Switch language' },
  'a11y.scrollToAbout':     { ko: '소개 섹션으로 이동', en: 'Scroll to About section' },
} as const satisfies Record<string, { ko: string; en: string }>

export type UiKey = keyof typeof UI

/** Looks up a chrome string; unknown keys render as the key so gaps are visible. */
export function uiText(key: UiKey, lang: Lang): string {
  return UI[key]?.[lang] ?? key
}

import { ref, readonly, watch } from 'vue'
import { uiText, type Lang, type UiKey } from '@/i18n/ui'

export type { Lang }

const lang = ref<Lang>('ko')

// Keep the document language in step with the toggle so screen readers and
// search engines don't read English chrome as Korean.
if (typeof document !== 'undefined') {
  watch(lang, (value) => { document.documentElement.lang = value }, { immediate: true })
}

export function useLanguage() {
  function toggleLang() {
    lang.value = lang.value === 'ko' ? 'en' : 'ko'
  }

  /** Notion-sourced string: use the English value when there is one, else Korean. */
  function t(obj: { ko: string; en: string }): string {
    return obj[lang.value] || obj.ko
  }

  /** Same rule for Notion-sourced lists — an empty English list must not blank the section. */
  function tList(obj: { ko: string[]; en: string[] }): string[] {
    const value = obj[lang.value]
    return value?.length ? value : obj.ko
  }

  /** App chrome string — the only text the language toggle really translates. */
  function ui(key: UiKey): string {
    return uiText(key, lang.value)
  }

  return {
    lang: readonly(lang),
    toggleLang,
    t,
    tList,
    ui
  }
}

import { ref, readonly } from 'vue'

export type Lang = 'ko' | 'en'

const lang = ref<Lang>('ko')

export function useLanguage() {
  function toggleLang() {
    lang.value = lang.value === 'ko' ? 'en' : 'ko'
  }

  function t(obj: { ko: string; en: string }): string {
    return obj[lang.value]
  }

  return {
    lang: readonly(lang),
    toggleLang,
    t
  }
}

<template>
  <div :class="['min-h-screen', isDark ? 'dark' : '']">
    <AppHeader
      :is-dark="isDark"
      :lang="lang"
      @toggle-dark="toggleDark"
      @toggle-lang="toggleLang"
    />
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <CertificationsSection />
      <EducationSection />
    </main>
    <footer class="bg-gray-100 dark:bg-gray-900 text-center py-8 text-sm text-gray-500 dark:text-gray-400">
      <p>© 2026 이강현 · Built with Vue.js 3 + Tailwind CSS</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import AppHeader from '@/components/AppHeader.vue'
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import SkillsSection from '@/components/SkillsSection.vue'
import ExperienceSection from '@/components/ExperienceSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import CertificationsSection from '@/components/CertificationsSection.vue'
import EducationSection from '@/components/EducationSection.vue'

const { lang, toggleLang } = useLanguage()
useScrollAnimation()

const isDark = ref(false)

function toggleDark() {
  isDark.value = !isDark.value
}

watch(isDark, (val) => {
  if (val) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', val ? 'dark' : 'light')
})

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
  }
})
</script>

<template>
  <!-- Scroll progress bar -->
  <div
    class="fixed top-0 left-0 z-50 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-100"
    :style="{ width: progress + '%' }"
  />

  <header
    class="fixed top-1 left-0 right-0 z-40 transition-all duration-300"
    :class="scrolled ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur shadow-md' : 'bg-transparent'"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
      <!-- Logo -->
      <a href="#hero" class="font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        GH.
      </a>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-6">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="'#' + item.id"
          class="text-sm font-medium transition-colors duration-200 hover:text-blue-500"
          :class="activeSection === item.id
            ? 'text-blue-500'
            : 'text-gray-600 dark:text-gray-300'"
        >
          {{ item.label[lang] }}
        </a>
      </nav>

      <!-- Controls -->
      <div class="flex items-center gap-3">
        <!-- Language toggle -->
        <button
          class="text-xs font-semibold px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
          @click="$emit('toggle-lang')"
        >
          {{ lang === 'ko' ? 'EN' : 'KO' }}
        </button>

        <!-- Dark mode toggle -->
        <button
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="$emit('toggle-dark')"
        >
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
        </button>

        <!-- Mobile hamburger -->
        <button
          class="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          aria-label="Toggle menu"
          @click="menuOpen = !menuOpen"
        >
          <span
            class="block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transition-transform duration-300"
            :class="menuOpen ? 'translate-y-2 rotate-45' : ''"
          />
          <span
            class="block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transition-opacity duration-300"
            :class="menuOpen ? 'opacity-0' : ''"
          />
          <span
            class="block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transition-transform duration-300"
            :class="menuOpen ? '-translate-y-2 -rotate-45' : ''"
          />
        </button>
      </div>
    </div>

    <!-- Mobile Nav -->
    <div
      v-if="menuOpen"
      class="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 pb-4"
    >
      <a
        v-for="item in navItems"
        :key="item.id"
        :href="'#' + item.id"
        class="block py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
        :class="activeSection === item.id ? 'text-blue-500' : ''"
        @click="menuOpen = false"
      >
        {{ item.label[lang] }}
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useProgressBar } from '@/composables/useProgressBar'
import { useScrollSpy } from '@/composables/useScrollSpy'
import type { Lang } from '@/composables/useLanguage'

defineProps<{
  isDark: boolean
  lang: Lang
}>()
defineEmits<{
  'toggle-dark': []
  'toggle-lang': []
}>()

const { progress } = useProgressBar()
const { activeSection } = useScrollSpy(['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'education'])

const scrolled = ref(false)
const menuOpen = ref(false)

const navItems = [
  { id: 'about',          label: { ko: 'About',          en: 'About'          } },
  { id: 'skills',         label: { ko: 'Skills',         en: 'Skills'         } },
  { id: 'experience',     label: { ko: '경력',            en: 'Experience'     } },
  { id: 'projects',       label: { ko: '프로젝트',        en: 'Projects'       } },
  { id: 'certifications', label: { ko: '자격증',          en: 'Certifications' } },
  { id: 'education',      label: { ko: '학력',            en: 'Education'      } }
]

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <section
    id="hero"
    class="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
  >
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
    </div>

    <div class="relative z-10 px-4 max-w-3xl mx-auto">
      <!-- Avatar -->
      <div class="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-blue-500/30 shadow-xl">
        <img
          :src="profileImage"
          :alt="t(resume.profile.name)"
          class="w-full h-full object-cover"
          @error="showFallback = true"
          v-if="!showFallback"
        />
        <div
          v-else
          class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold"
        >
          {{ t(resume.profile.name).charAt(0) }}
        </div>
      </div>

      <!-- Name -->
      <h1
        class="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 opacity-0 animate-fade-in"
        style="animation: fadeIn 0.8s ease 0.2s forwards"
      >
        <span class="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {{ t(resume.profile.name) }}
        </span>
      </h1>

      <!-- Typewriter title -->
      <p class="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 h-8 font-medium">
        {{ displayText }}<span
          class="inline-block w-0.5 h-5 bg-blue-500 ml-0.5 align-middle"
          :class="showCursor ? 'opacity-100' : 'opacity-0'"
        />
      </p>

      <!-- Stats -->
      <div class="flex flex-wrap justify-center gap-6 mb-10">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="text-center opacity-0"
          style="animation: fadeIn 0.6s ease forwards"
          :style="{ animationDelay: stat.delay }"
        >
          <div class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            {{ stat.value }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Social links -->
      <div class="flex justify-center gap-4 mb-12">
        <a
          :href="resume.profile.github"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
          </svg>
          GitHub
        </a>
        <a
          :href="resume.profile.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>
        <a
          :href="'mailto:' + resume.profile.email"
          class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-blue-500 hover:text-blue-500 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email
        </a>
      </div>

      <!-- Scroll down arrow -->
      <a
        href="#about"
        class="inline-flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors animate-bounce"
        aria-label="Scroll to About section"
      >
        <span class="text-xs">Scroll</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { useTypewriter } from '@/composables/useTypewriter'
import resumeData from '@/data/resume.json'
import type { ResumeData } from '@/types/resume'

const resume = resumeData as ResumeData
const { lang, t } = useLanguage()
const showFallback = ref(false)
const profileImage = import.meta.env.BASE_URL.replace(/\/$/, '') + resume.profile.profileImage

const titleText = computed(() =>
  lang.value === 'ko'
    ? resume.profile.title.ko
    : resume.profile.title.en
)

const { displayText, showCursor } = useTypewriter(titleText.value, 60, 1000)

const stats = [
  { value: '2년+', label: lang.value === 'ko' ? '경력' : 'Experience', delay: '0.6s' },
  { value: '3개+', label: lang.value === 'ko' ? '프로젝트' : 'Projects', delay: '0.8s' },
  { value: '22개+', label: lang.value === 'ko' ? '모듈' : 'Modules', delay: '1.0s' }
]
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

<template>
  <section id="certifications" class="py-20 bg-white dark:bg-gray-950">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <h2 class="scroll-hidden text-3xl font-bold text-center mb-14">
        <span class="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {{ lang === 'ko' ? '자격증' : 'Certifications' }}
        </span>
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="cert in resume.certifications"
          :key="t(cert.name)"
          class="scroll-hidden bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
        >
          <!-- Tag badge -->
          <span
            class="self-start px-2.5 py-0.5 text-xs font-semibold rounded-full"
            :class="tagColor(cert.tag)"
          >
            {{ cert.tag }}
          </span>

          <!-- Cert name -->
          <h3 class="font-bold text-gray-900 dark:text-white text-lg leading-snug">
            {{ t(cert.name) }}
          </h3>

          <!-- Issuer -->
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t(cert.issuer) }}
          </p>

          <!-- Date -->
          <div class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-auto">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ cert.date }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'
import resumeData from '@/data/resume.json'
import type { ResumeData } from '@/types/resume'

const resume = resumeData as ResumeData
const { lang, t } = useLanguage()

const tagColorMap: Record<string, string> = {
  '개발': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'DB':   'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  '디자인': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
}

function tagColor(tag: string): string {
  return tagColorMap[tag] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
}
</script>

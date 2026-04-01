<template>
  <section id="education" class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <h2 class="scroll-hidden text-3xl font-bold text-center mb-14">
        <span class="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {{ lang === 'ko' ? '학력 및 교육' : 'Education' }}
        </span>
      </h2>

      <!-- 학력 -->
      <div class="mb-10">
        <h3 class="scroll-hidden text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
          {{ lang === 'ko' ? '학력' : 'Academic' }}
        </h3>
        <div class="space-y-4">
          <div
            v-for="edu in resume.education"
            :key="t(edu.institution)"
            class="scroll-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h4 class="font-bold text-lg text-gray-900 dark:text-white">
                  {{ t(edu.institution) }}
                </h4>
                <p class="text-blue-500 font-medium text-sm mt-0.5">{{ t(edu.major) }}</p>
                <p v-if="edu.gpa" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  GPA: {{ edu.gpa }}
                </p>
              </div>
              <span class="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {{ edu.period.start }} ~ {{ edu.period.end }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 교육 -->
      <div v-if="resume.training && resume.training.length" class="mb-10">
        <h3 class="scroll-hidden text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
          {{ lang === 'ko' ? '교육' : 'Training' }}
        </h3>
        <div class="space-y-4">
          <div
            v-for="item in resume.training"
            :key="t(item.institution)"
            class="scroll-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h4 class="font-bold text-lg text-gray-900 dark:text-white">
                  {{ t(item.institution) }}
                </h4>
                <p class="text-blue-500 font-medium text-sm mt-0.5">{{ t(item.major) }}</p>
              </div>
              <span class="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {{ item.period.start }} ~ {{ item.period.end }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 병역 -->
      <div>
        <h3 class="scroll-hidden text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
          {{ lang === 'ko' ? '병역' : 'Military Service' }}
        </h3>
        <div class="scroll-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p class="font-bold text-gray-900 dark:text-white">
                {{ lang === 'ko' ? '병역사항' : 'Military Service' }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {{ t(resume.military) }}
              </p>
            </div>
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
</script>

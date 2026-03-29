<template>
  <section id="experience" class="py-20 bg-white dark:bg-gray-950">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <h2 class="scroll-hidden text-3xl font-bold text-center mb-14">
        <span class="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {{ lang === 'ko' ? '경력' : 'Experience' }}
        </span>
      </h2>

      <!-- Timeline -->
      <div class="relative">
        <!-- Vertical line -->
        <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800 hidden md:block">
          <div class="timeline-line w-full h-full bg-gradient-to-b from-blue-500 to-purple-600" />
        </div>

        <div class="space-y-12">
          <div
            v-for="(exp, i) in resume.experiences"
            :key="i"
            class="relative"
          >
            <!-- Timeline dot -->
            <div class="absolute left-1/2 -translate-x-1/2 -translate-y-1 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-4 ring-white dark:ring-gray-950 z-10 hidden md:block" />

            <!-- Card: alternates left/right on md+ -->
            <div
              class="scroll-hidden md:w-[46%]"
              :class="[
                i % 2 === 0 ? 'slide-left-init md:mr-auto' : 'slide-right-init md:ml-auto'
              ]"
            >
              <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <!-- Header -->
                <div class="flex items-start justify-between gap-2 mb-1">
                  <h3 class="font-bold text-lg text-gray-900 dark:text-white">
                    {{ t(exp.company) }}
                  </h3>
                  <span class="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap mt-1">
                    {{ exp.period.start }} ~ {{ exp.period.end ?? (lang === 'ko' ? '재직중' : 'Present') }}
                  </span>
                </div>
                <p class="text-blue-500 text-sm font-medium mb-4">{{ t(exp.role) }}</p>

                <!-- Task list -->
                <ul class="space-y-1.5 mb-4">
                  <li
                    v-for="task in (lang === 'ko' ? exp.tasks.ko : exp.tasks.en)"
                    :key="task"
                    class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <span class="text-blue-500 mt-1 flex-shrink-0">▸</span>
                    {{ task }}
                  </li>
                </ul>

                <!-- Tech stack -->
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="tech in exp.techStack"
                    :key="tech"
                    class="px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import resumeData from '@/data/resume.json'
import type { ResumeData } from '@/types/resume'

const resume = resumeData as ResumeData
const { lang, t } = useLanguage()

onMounted(() => {
  const lineEl = document.querySelector('.timeline-line')
  if (!lineEl) return
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          lineEl.classList.add('line-visible')
          observer.disconnect()
        }
      })
    },
    { threshold: 0.1 }
  )
  observer.observe(lineEl)
})
</script>

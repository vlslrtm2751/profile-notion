<template>
  <section id="about" class="py-20 bg-white dark:bg-gray-950">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <h2 class="scroll-hidden text-3xl font-bold text-center mb-14">
        <span class="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">About Me</span>
      </h2>

      <div class="flex flex-col md:flex-row items-center gap-12">
        <!-- Profile image -->
        <div class="scroll-hidden slide-left-init flex-shrink-0">
          <div class="w-48 h-48 rounded-full overflow-hidden ring-4 ring-blue-500/20 shadow-2xl mx-auto">
            <img
              :src="resume.profile.profileImage"
              :alt="t(resume.profile.name)"
              class="w-full h-full object-cover"
              @error="showFallback = true"
              v-if="!showFallback"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-6xl font-bold"
            >
              {{ t(resume.profile.name).charAt(0) }}
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="scroll-hidden slide-right-init flex-1 text-center md:text-left">
          <h3 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            {{ t(resume.profile.name) }}
          </h3>
          <p class="text-blue-500 font-medium mb-4">{{ t(resume.profile.title) }}</p>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            {{ t(resume.profile.intro) }}
          </p>

          <!-- Contact -->
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li class="flex items-center gap-2 justify-center md:justify-start">
              <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a :href="'mailto:' + resume.profile.email" class="hover:text-blue-500 transition-colors">
                {{ resume.profile.email }}
              </a>
            </li>
            <li class="flex items-center gap-2 justify-center md:justify-start">
              <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {{ resume.profile.phone }}
            </li>
            <li class="flex items-center gap-2 justify-center md:justify-start">
              <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ t(resume.profile.location) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import resumeData from '@/data/resume.json'
import type { ResumeData } from '@/types/resume'

const resume = resumeData as ResumeData
const { t } = useLanguage()
const showFallback = ref(false)
</script>

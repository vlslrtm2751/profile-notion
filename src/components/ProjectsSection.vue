<template>
  <section id="projects" class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <h2 class="scroll-hidden text-3xl font-bold text-center mb-14">
        <span class="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {{ lang === 'ko' ? '프로젝트' : 'Projects' }}
        </span>
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in resume.projects"
          :key="t(project.name)"
          class="scroll-hidden project-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl group"
        >
          <!-- Top color bar -->
          <div class="h-1.5 bg-gradient-to-r from-blue-500 to-purple-600" />

          <div class="p-6 flex flex-col h-full">
            <!-- Name & period -->
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                {{ t(project.name) }}
              </h3>
              <span class="text-xs text-gray-400 whitespace-nowrap mt-1 flex-shrink-0">
                {{ project.period }}
              </span>
            </div>

            <!-- Description -->
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
              {{ t(project.desc) }}
            </p>

            <!-- Detail bullets -->
            <ul v-if="project.details && project.details.length" class="flex-1 space-y-1 mb-4">
              <li
                v-for="detail in project.details"
                :key="detail"
                class="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed"
              >
                <span class="mt-1 w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                {{ detail }}
              </li>
            </ul>

            <!-- Tech tags — slide up on hover -->
            <div class="flex flex-wrap gap-1.5 mb-4 overflow-hidden max-h-20 group-hover:max-h-40 transition-all duration-300">
              <span
                v-for="tech in project.techStack"
                :key="tech"
                class="px-2 py-0.5 text-xs rounded bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-transform duration-300"
              >
                {{ tech }}
              </span>
            </div>

            <!-- Links -->
            <div class="flex gap-3 mt-auto">
              <a
                v-if="project.github"
                :href="project.github"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
                GitHub
              </a>
              <span
                v-else
                class="text-xs text-gray-300 dark:text-gray-600 italic"
              >
                {{ lang === 'ko' ? '비공개' : 'Private' }}
              </span>
              <a
                v-if="project.demo"
                :href="project.demo"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-purple-500 transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Demo
              </a>
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

<template>
  <section id="skills" class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <h2 class="scroll-hidden text-3xl font-bold text-center mb-14">
        <span class="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {{ ui('section.skills') }}
        </span>
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          v-for="group in skillGroups"
          :key="group.key"
          class="scroll-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 class="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-4">
            {{ group.label }}
          </h3>
          <ul class="flex flex-wrap gap-2">
            <li
              v-for="skill in group.items"
              :key="skill"
              class="px-3 py-1 text-sm rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
            >
              {{ skill }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import resumeData from '@/data/resume.json'
import type { ResumeData } from '@/types/resume'

const resume = resumeData as ResumeData
const { ui } = useLanguage()

// Every skill here comes from Notion. The old section also drew proficiency
// bars (Vue 90%, TypeScript 80%, …) that were hard-coded in this file and
// editable nowhere — they are gone rather than quietly invented.
const skillGroups = computed(() => [
  { key: 'language',  label: ui('skills.group.language'),  items: resume.skills.language  },
  { key: 'framework', label: ui('skills.group.framework'), items: resume.skills.framework },
  { key: 'db',        label: ui('skills.group.db'),        items: resume.skills.db        },
  { key: 'etc',       label: ui('skills.group.etc'),       items: resume.skills.etc       }
])
</script>

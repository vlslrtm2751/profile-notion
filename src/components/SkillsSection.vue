<template>
  <section id="skills" class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <h2 class="scroll-hidden text-3xl font-bold text-center mb-14">
        <span class="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Skills</span>
      </h2>

      <!-- Skill Groups -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-14">
        <div
          v-for="group in skillGroups"
          :key="group.key"
          class="scroll-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 class="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-4">
            {{ group.label }}
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in group.items"
              :key="skill"
              class="px-3 py-1 text-sm rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>

      <!-- Key skill bars -->
      <div class="scroll-hidden bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
        <h3 class="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">
          {{ lang === 'ko' ? '핵심 기술 숙련도' : 'Key Skill Proficiency' }}
        </h3>
        <div class="space-y-5">
          <div
            v-for="skill in keySkills"
            :key="skill.name"
            class="skill-bar-row"
          >
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ skill.name }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ skill.level }}%</span>
            </div>
            <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full skill-bar-fill"
                :data-level="skill.level"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import resumeData from '@/data/resume.json'
import type { ResumeData } from '@/types/resume'

const resume = resumeData as ResumeData
const { lang } = useLanguage()

const skillGroups = computed(() => [
  { key: 'language',  label: 'Language',         items: resume.skills.language  },
  { key: 'framework', label: 'Framework / UI',   items: resume.skills.framework },
  { key: 'db',        label: 'DB / Cloud / Tools', items: resume.skills.db      },
  { key: 'etc',       label: 'Collaboration',    items: resume.skills.etc       }
])

const keySkills = [
  { name: 'Vue.js 3',      level: 90 },
  { name: 'TypeScript',    level: 80 },
  { name: 'Tailwind CSS',  level: 85 },
  { name: 'Vuetify 3',     level: 85 },
  { name: 'REST API',      level: 80 },
  { name: 'Figma',         level: 70 }
]

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll<HTMLElement>('.skill-bar-fill').forEach((bar) => {
            const level = bar.dataset.level ?? '0'
            bar.style.width = level + '%'
          })
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.3 }
  )

  document.querySelectorAll('.skill-bar-row').forEach((el) => observer.observe(el))
})
</script>

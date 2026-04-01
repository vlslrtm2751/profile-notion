/**
 * fetch-notion.js
 *
 * Fetches resume data from a Notion page and writes it to src/data/resume.json.
 *
 * Usage:
 *   node scripts/fetch-notion.js           -- fetch & transform
 *   node scripts/fetch-notion.js --dump    -- fetch & save raw JSON only (for debugging)
 */

import { writeFileSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'

config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = resolve(__dirname, '../src/data/resume.json')
const RAW_PATH = resolve(__dirname, '../src/data/notion-raw.json')

const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID
const DUMP_MODE = process.argv.includes('--dump')

// ─── Notion fetch helpers ─────────────────────────────────────────────────────

async function getAllBlocks(notion, blockId) {
  const blocks = []
  let cursor
  do {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    })
    for (const block of res.results) {
      if (block.has_children) {
        block._children = await getAllBlocks(notion, block.id)
      }
      blocks.push(block)
    }
    cursor = res.next_cursor
  } while (cursor)
  return blocks
}

// ─── Text helpers ─────────────────────────────────────────────────────────────

function rt(richText) {
  if (!richText || !Array.isArray(richText)) return ''
  return richText.map((t) => t.plain_text).join('')
}

function blockText(block) {
  const content = block[block.type]
  return content?.rich_text ? rt(content.rich_text) : ''
}

// ─── Profile ──────────────────────────────────────────────────────────────────

function extractProfile(pageTitle, blocks) {
  // Page title: "사용자 경험을 중시하는 프론트엔드 개발자 이강현입니다."
  const nameMatch = pageTitle.match(/([가-힣]{2,5})입니다/)
  const name = nameMatch ? nameMatch[1] : '이강현'

  // Title/role from first paragraph block
  const titleEn = blockText(blocks[0]) || 'Frontend Developer'
  // Derive Korean title from page title
  const titleKo = pageTitle.replace(`${name}입니다.`, '').trim() ||
    '사용자 경험을 중시하는 프론트엔드 개발자'

  // Callout block: GitHub + children (email, linkedin)
  const callout = blocks.find((b) => b.type === 'callout')
  let github = ''
  let email = ''
  let linkedin = ''

  if (callout) {
    // GitHub URL is stored as a mention in the callout's rich_text
    for (const segment of callout.callout.rich_text) {
      if (segment.type === 'mention' && segment.mention?.type === 'link_mention') {
        const href = segment.mention.link_mention?.href ?? ''
        if (href.includes('github.com')) github = href
      }
      // Also check plain href
      if (segment.href?.includes('github.com')) github = segment.href
    }
    // Children: email paragraph, linkedin paragraph
    for (const child of callout._children ?? []) {
      const text = blockText(child)
      if (text.toLowerCase().includes('email')) {
        const m = text.match(/[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/)
        if (m) email = m[0]
      }
      if (text.toLowerCase().includes('linked')) {
        const m = text.match(/https?:\/\/[^\s]+linkedin[^\s]*/i)
          ?? text.match(/https?:\/\/[^\s]+/)
        if (m) linkedin = m[0]
      }
    }
  }

  // Phone from "연락처: 010-xxxx-xxxx"
  let phone = ''
  let location = { ko: '', en: '' }
  for (const block of blocks) {
    const text = blockText(block)
    if (text.includes('연락처')) {
      const m = text.match(/(\d{3}-\d{3,4}-\d{4})/)
      if (m) phone = m[1]
    }
    if (text.includes('거주')) {
      location.ko = text.replace('거주', '').trim()
      location.en = location.ko
    }
  }

  // Intro from "간단한 소개." section — column_list's right column
  let introKo = ''
  const introHeadingIdx = blocks.findIndex(
    (b) => b.type === 'heading_2' && blockText(b).includes('소개')
  )
  if (introHeadingIdx >= 0) {
    for (let i = introHeadingIdx + 1; i < blocks.length; i++) {
      const b = blocks[i]
      if (b.type === 'column_list' && b._children?.length >= 2) {
        const rightCol = b._children[1]
        // Skip short greetings like "안녕하세요." and pick the first substantive paragraph
        const paragraphs = (rightCol._children ?? [])
          .filter((c) => c.type === 'paragraph')
          .map((c) => blockText(c))
          .filter((t) => t.length > 15)
        if (paragraphs.length) {
          introKo = paragraphs[0]
          break
        }
      }
    }
  }

  return {
    name: { ko: name, en: 'Ganghyun Lee' },
    title: {
      ko: titleKo,
      en: titleEn,
    },
    email,
    github,
    linkedin,
    phone,
    location,
    intro: {
      ko: introKo,
      en: '',
    },
    profileImage: '/images/logan.png',
  }
}

// ─── Skills ───────────────────────────────────────────────────────────────────

function extractSkills(blocks) {
  const skillsHeadingIdx = blocks.findIndex(
    (b) => b.type === 'heading_2' && blockText(b).includes('기술')
  )
  if (skillsHeadingIdx < 0) return {}

  // Find the column_list right after the heading
  const columnList = blocks.slice(skillsHeadingIdx + 1).find((b) => b.type === 'column_list')
  if (!columnList) return {}

  const result = { language: [], framework: [], db: [], etc: [] }
  const catMap = {
    'language': 'language',
    'frameworks': 'framework',
    'libraries': 'framework',
    'db': 'db',
    'others': 'db',
    'etc': 'etc',
  }

  for (const column of columnList._children ?? []) {
    let cat = null
    for (const child of column._children ?? []) {
      if (child.type === 'heading_3') {
        const heading = blockText(child).toLowerCase()
        cat = Object.entries(catMap).find(([k]) => heading.includes(k))?.[1] ?? 'etc'
      } else if (child.type === 'bulleted_list_item' && cat) {
        const text = blockText(child).trim()
        if (text) result[cat].push(text)
      }
    }
  }

  return result
}

// ─── Experiences ──────────────────────────────────────────────────────────────

function extractExperiences(blocks) {
  const expHeadingIdx = blocks.findIndex(
    (b) => b.type === 'heading_2' && blockText(b).includes('경력')
  )
  if (expHeadingIdx < 0) return []

  const experiences = []

  for (let i = expHeadingIdx + 1; i < blocks.length; i++) {
    const b = blocks[i]
    if (b.type === 'heading_2') break // next section
    if (b.type !== 'column_list') continue

    const [leftCol, rightCol] = b._children ?? []
    if (!leftCol || !rightCol) continue

    // Left column: heading_3 = company, paragraph[0] = role, paragraph[1] = period
    const leftBlocks = leftCol._children ?? []
    const companyKo = leftBlocks.find((c) => c.type === 'heading_3')
      ? blockText(leftBlocks.find((c) => c.type === 'heading_3'))
      : ''
    const paragraphs = leftBlocks.filter((c) => c.type === 'paragraph').map((c) => blockText(c)).filter(Boolean)
    const roleKo = paragraphs[0] ?? ''
    const periodStr = paragraphs[1] ?? ''

    // Parse period "2025.09 ~ 재직중" or "2023.11 ~ 2025.08"
    const [periodStart, periodEnd] = periodStr.split(/[~–-]/).map((s) => s.trim())
    const isCurrentJob = !periodEnd || /재직|현재|present/i.test(periodEnd)

    // Right column: quote = description, bullet items = tasks (last one may be tech stack)
    const rightBlocks = rightCol._children ?? []
    const bullets = rightBlocks.filter((c) => c.type === 'bulleted_list_item')
    const taskBullets = []
    let techStack = []

    for (const bullet of bullets) {
      const text = blockText(bullet)
      if (/^사용\s*기술[:：]/.test(text)) {
        const techPart = text.replace(/^사용\s*기술[:：]\s*/, '')
        techStack = techPart.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
      } else {
        taskBullets.push(text)
      }
    }

    experiences.push({
      company: { ko: companyKo, en: '' },
      role: { ko: roleKo, en: '' },
      period: {
        start: periodStart ?? '',
        end: isCurrentJob ? null : periodEnd ?? null,
      },
      tasks: { ko: taskBullets, en: [] },
      techStack,
    })
  }

  return experiences
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function extractProjects(blocks) {
  const projHeadingIdx = blocks.findIndex(
    (b) => b.type === 'heading_2' && blockText(b).includes('프로젝트')
  )
  if (projHeadingIdx < 0) return []

  const projects = []

  for (let i = projHeadingIdx + 1; i < blocks.length; i++) {
    const b = blocks[i]
    if (b.type === 'heading_2') break
    if (b.type !== 'column_list') continue

    const [leftCol, rightCol] = b._children ?? []
    if (!leftCol || !rightCol) continue

    const leftBlocks = leftCol._children ?? []
    const nameKo = blockText(leftBlocks.find((c) => c.type === 'heading_3') ?? {})
    const paragraphs = leftBlocks.filter((c) => c.type === 'paragraph').map((c) => blockText(c)).filter(Boolean)
    const periodStr = paragraphs[1] ?? paragraphs[0] ?? ''

    const rightBlocks = rightCol._children ?? []
    const quoteBlock = rightBlocks.find((c) => c.type === 'quote')
    const descKo = quoteBlock ? blockText(quoteBlock) : ''

    const bullets = rightBlocks.filter((c) => c.type === 'bulleted_list_item')
    const detailBullets = []
    let techStack = []

    for (const bullet of bullets) {
      const text = blockText(bullet)
      if (/^사용\s*기술[:：]/.test(text)) {
        const techPart = text.replace(/^사용\s*기술[:：]\s*/, '')
        techStack = techPart.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
      } else {
        detailBullets.push(text)
      }
    }

    projects.push({
      name: { ko: nameKo, en: '' },
      desc: { ko: descKo, en: '' },
      period: periodStr,
      details: detailBullets,
      techStack,
      github: null,
      demo: null,
    })
  }

  return projects
}

// ─── Certifications ───────────────────────────────────────────────────────────

function extractCertifications(blocks) {
  const certHeadingIdx = blocks.findIndex(
    (b) => b.type === 'heading_2' && blockText(b).includes('자격증')
  )
  if (certHeadingIdx < 0) return []

  const certs = []
  let current = null

  for (let i = certHeadingIdx + 1; i < blocks.length; i++) {
    const b = blocks[i]
    if (b.type === 'heading_2') break

    if (b.type === 'heading_3') {
      if (current) certs.push(current)
      current = { name: { ko: blockText(b), en: '' }, issuer: { ko: '', en: '' }, date: '', tag: '' }
    } else if (b.type === 'paragraph' && current) {
      const text = blockText(b).trim()
      if (!text) continue
      if (!current.issuer.ko) {
        current.issuer.ko = text
        current.issuer.en = text
      } else if (!current.date) {
        current.date = text
      } else if (!current.tag) {
        current.tag = text
      }
    }
  }
  if (current) certs.push(current)

  return certs
}

// ─── Education (학력) ─────────────────────────────────────────────────────────

function extractEducation(blocks) {
  const eduHeadingIdx = blocks.findIndex(
    (b) => b.type === 'heading_2' && blockText(b).includes('학력')
  )
  if (eduHeadingIdx < 0) return []

  const education = []

  for (let i = eduHeadingIdx + 1; i < blocks.length; i++) {
    const b = blocks[i]
    if (b.type === 'heading_2') break

    if (b.type === 'heading_3') {
      const institution = blockText(b)
      const paragraphs = []
      for (let j = i + 1; j < blocks.length; j++) {
        const next = blocks[j]
        if (next.type === 'heading_3' || next.type === 'heading_2' || next.type === 'divider') break
        if (next.type === 'paragraph') {
          const text = blockText(next).trim()
          if (text) paragraphs.push(text)
        }
      }
      const major = paragraphs[0] ?? ''
      const periodStr = paragraphs[1] ?? ''
      const gpa = paragraphs[2] ?? ''
      const [start, end] = periodStr.split(/[~–-]/).map((s) => s.trim())

      const entry = {
        institution: { ko: institution, en: '' },
        major: { ko: major, en: '' },
        period: { start: start ?? '', end: end ?? '' },
      }
      if (gpa) entry.gpa = gpa
      education.push(entry)
    }
  }

  return education
}

// ─── Training (교육) ──────────────────────────────────────────────────────────

function extractTraining(blocks) {
  const trainingHeadingIdx = blocks.findIndex(
    (b) => b.type === 'heading_2' && blockText(b).includes('교육')
  )
  if (trainingHeadingIdx < 0) return []

  const training = []

  for (let i = trainingHeadingIdx + 1; i < blocks.length; i++) {
    const b = blocks[i]
    if (b.type === 'heading_2') break
    if (b.type !== 'column_list') continue

    const [leftCol, rightCol] = b._children ?? []
    if (!leftCol) continue

    const leftBlocks = leftCol._children ?? []
    const institutionBlock = leftBlocks.find((c) => c.type === 'heading_2' || c.type === 'heading_3')
    if (!institutionBlock) continue
    const institution = blockText(institutionBlock)

    const periodPara = leftBlocks.find((c) => c.type === 'paragraph' && blockText(c).match(/\d{4}/))
    const periodStr = periodPara ? blockText(periodPara) : ''
    const [start, end] = periodStr.split(/[~–-]/).map((s) => s.trim())

    const rightBlocks = rightCol?._children ?? []
    const quoteBlock = rightBlocks.find((c) => c.type === 'quote')
    const majorText = quoteBlock ? blockText(quoteBlock) : ''

    training.push({
      institution: { ko: institution, en: '' },
      major: { ko: majorText, en: '' },
      period: { start: start ?? '', end: end ?? '' },
    })
  }

  return training
}

// ─── Military ─────────────────────────────────────────────────────────────────

function extractMilitary(blocks) {
  const militaryHeadingIdx = blocks.findIndex(
    (b) => b.type === 'heading_2' && blockText(b).includes('병역')
  )
  if (militaryHeadingIdx < 0) return null

  const parts = []
  for (let i = militaryHeadingIdx + 1; i < blocks.length; i++) {
    const b = blocks[i]
    if (b.type === 'heading_2') break
    const text = blockText(b).trim()
    if (text) parts.push(text)
  }

  // parts: ["육군 병장 제대", "만기 전역", "2018.03 ~ 2019.11"]
  const summary = parts.filter(Boolean).join(' / ')
  return { ko: summary, en: summary }
}

// ─── Main transform ───────────────────────────────────────────────────────────

function transformNotionToResume(page, blocks) {
  const pageTitle = rt(page.properties?.title?.title ?? [])

  const existing = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'))

  const profile = extractProfile(pageTitle, blocks)
  const skills = extractSkills(blocks)
  const experiences = extractExperiences(blocks)
  const projects = extractProjects(blocks)
  const certifications = extractCertifications(blocks)
  const education = extractEducation(blocks)
  const training = extractTraining(blocks)
  const military = extractMilitary(blocks)

  return {
    meta: { updatedAt: new Date().toISOString().slice(0, 10) },
    profile: { ...existing.profile, ...Object.fromEntries(Object.entries(profile).filter(([, v]) => v && (typeof v !== 'object' || Object.values(v).some(Boolean)))) },
    skills: Object.keys(skills).length ? skills : existing.skills,
    experiences: experiences.length ? experiences : existing.experiences,
    projects: projects.length ? projects : existing.projects,
    certifications: certifications.length ? certifications : existing.certifications,
    education: education.length ? education : existing.education,
    training: training.length ? training : (existing.training ?? []),
    military: military ?? existing.military,
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!NOTION_TOKEN || !NOTION_PAGE_ID) {
    console.error('[fetch-notion] NOTION_TOKEN or NOTION_PAGE_ID not set.')
    process.exit(1)
  }

  const { Client } = await import('@notionhq/client')
  const notion = new Client({ auth: NOTION_TOKEN })

  console.log('[fetch-notion] Connecting to Notion...')

  let page
  try {
    page = await notion.pages.retrieve({ page_id: NOTION_PAGE_ID })
  } catch (err) {
    console.error('[fetch-notion] Failed to retrieve page:', err.message)
    process.exit(1)
  }

  console.log('[fetch-notion] Fetching page blocks (recursive)...')
  const blocks = await getAllBlocks(notion, NOTION_PAGE_ID)

  writeFileSync(RAW_PATH, JSON.stringify({ page, blocks }, null, 2), 'utf-8')
  console.log(`[fetch-notion] Raw structure saved → ${RAW_PATH}`)

  if (DUMP_MODE) {
    console.log('[fetch-notion] --dump mode: skipping transform.')
    return
  }

  console.log('[fetch-notion] Transforming Notion data → resume.json...')
  const resume = transformNotionToResume(page, blocks)

  writeFileSync(OUTPUT_PATH, JSON.stringify(resume, null, 2), 'utf-8')
  console.log(`[fetch-notion] resume.json updated → ${OUTPUT_PATH}`)
  console.log(`  profile.name: ${resume.profile.name?.ko}`)
  console.log(`  experiences: ${resume.experiences?.length}`)
  console.log(`  projects: ${resume.projects?.length}`)
  console.log(`  certifications: ${resume.certifications?.length}`)
  console.log(`  education: ${resume.education?.length}`)
}

main().catch((err) => {
  console.error('[fetch-notion] Unexpected error:', err)
  process.exit(1)
})

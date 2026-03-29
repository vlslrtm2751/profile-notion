/**
 * fetch-notion.js
 *
 * Fetches resume data from a Notion page and writes it to src/data/resume.json.
 *
 * Prerequisites:
 *   npm install @notionhq/client
 *
 * Environment variables:
 *   NOTION_TOKEN   - Notion integration token (starts with "secret_")
 *   NOTION_PAGE_ID - ID of the Notion page containing resume data
 *
 * Usage:
 *   NOTION_TOKEN=secret_xxx NOTION_PAGE_ID=yyy node scripts/fetch-notion.js
 */

import { writeFileSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = resolve(__dirname, '../src/data/resume.json')

const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID

async function main() {
  if (!NOTION_TOKEN || !NOTION_PAGE_ID) {
    console.log('[fetch-notion] NOTION_TOKEN or NOTION_PAGE_ID not set — skipping fetch.')
    console.log('[fetch-notion] Using existing resume.json as-is.')
    return
  }

  // NOTE: Uncomment the block below once @notionhq/client is installed.
  //
  // const { Client } = await import('@notionhq/client')
  // const notion = new Client({ auth: NOTION_TOKEN })
  //
  // // Example: fetch a database or page properties
  // const page = await notion.pages.retrieve({ page_id: NOTION_PAGE_ID })
  // const blocks = await notion.blocks.children.list({ block_id: NOTION_PAGE_ID, page_size: 100 })
  //
  // // Transform Notion response into resume.json shape …
  // const resumeData = transformNotionToResume(page, blocks)
  //
  // writeFileSync(OUTPUT_PATH, JSON.stringify(resumeData, null, 2), 'utf-8')
  // console.log('[fetch-notion] resume.json updated from Notion.')

  console.log('[fetch-notion] Notion integration placeholder — no changes written.')
}

main().catch((err) => {
  console.error('[fetch-notion] Error:', err)
  process.exit(1)
})

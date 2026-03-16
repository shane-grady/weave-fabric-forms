/**
 * Capture every screen in every flow at iPhone 17 resolution (393x852).
 * Outputs 3x retina PNGs organized by flow into ./screenshots/<flow-id>/
 *
 * Prereq: npm run build -- --base ./ && npx serve dist -l 5200 --single
 * Usage: node capture-screens.mjs
 */

import { chromium } from 'playwright-core'
import { mkdirSync, existsSync } from 'fs'
import path from 'path'

const VIEWPORT = { width: 393, height: 852 }
const DEVICE_SCALE_FACTOR = 3  // 3x retina for crisp Figma exports
const BASE_URL = 'http://127.0.0.1:5200/'
const OUT_DIR = path.resolve('screenshots')
const CHROME_PATH = '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome'

async function main() {
  console.log('Connecting to', BASE_URL)

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
    ],
  })

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
  })

  const page = await context.newPage()
  page.setDefaultTimeout(30000)

  // Block external requests (Google Fonts etc.) that prevent page load
  await page.route('**/*', (route) => {
    const url = route.request().url()
    if (url.startsWith('http://127.0.0.1:5200/')) {
      return route.continue()
    }
    // Abort external requests (fonts, analytics, etc.)
    return route.abort()
  })

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

  // ── 1. Capture the Flow List (home) screen ───────────────────
  console.log('\nCapturing Flow List (home)...')
  await page.goto(BASE_URL, { waitUntil: 'commit', timeout: 30000 })
  await page.waitForSelector('.flow-card', { timeout: 15000 })
  await page.waitForTimeout(600)

  await page.screenshot({
    path: path.join(OUT_DIR, '00-flow-list-top.png'),
    fullPage: false,
  })
  console.log('  -> 00-flow-list-top.png')

  // Scroll to middle
  await page.evaluate(() => {
    const el = document.querySelector('.flow-list')
    if (el) el.scrollTop = el.scrollHeight / 2
  })
  await page.waitForTimeout(300)
  await page.screenshot({
    path: path.join(OUT_DIR, '00-flow-list-mid.png'),
    fullPage: false,
  })
  console.log('  -> 00-flow-list-mid.png')

  // Scroll to bottom
  await page.evaluate(() => {
    const el = document.querySelector('.flow-list')
    if (el) el.scrollTop = el.scrollHeight
  })
  await page.waitForTimeout(300)
  await page.screenshot({
    path: path.join(OUT_DIR, '00-flow-list-bottom.png'),
    fullPage: false,
  })
  console.log('  -> 00-flow-list-bottom.png')

  // ── 2. Capture each flow's screens ───────────────────────────
  const flowCount = await page.$$eval('.flow-card', (cards) => cards.length)
  console.log(`\nFound ${flowCount} flows.\n`)

  for (let fi = 0; fi < flowCount; fi++) {
    // Navigate back to flow list
    await page.goto(BASE_URL, { waitUntil: 'commit', timeout: 30000 })
    await page.waitForSelector('.flow-card', { timeout: 15000 })
    await page.waitForTimeout(400)

    // Get flow title
    const flowTitle = await page.$$eval('.flow-card-title', (els, idx) => els[idx]?.textContent || 'unknown', fi)
    const flowSlug = flowTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
    const flowDir = path.join(OUT_DIR, `${String(fi + 1).padStart(2, '0')}-${flowSlug}`)
    if (!existsSync(flowDir)) mkdirSync(flowDir, { recursive: true })

    console.log(`--- Flow ${fi + 1}/${flowCount}: ${flowTitle} ---`)

    // Click the flow card
    await page.$$eval('.flow-card', (cards, idx) => cards[idx].click(), fi)
    await page.waitForTimeout(500)

    let screenIdx = 0

    while (true) {
      screenIdx++
      const padded = String(screenIdx).padStart(2, '0')

      // Check completion
      const isCompletion = await page.$('.completion')

      // Build filename from question text
      let label = 'screen'
      if (isCompletion) {
        label = 'complete'
      } else {
        try {
          const qText = await page.$eval('.question, .intro-title', (el) => el.textContent)
          if (qText) {
            label = qText
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
              .slice(0, 50)
          }
        } catch {}
      }

      const filename = `${padded}-${label}.png`
      await page.screenshot({
        path: path.join(flowDir, filename),
        fullPage: false,
      })
      console.log(`  -> ${filename}`)

      if (isCompletion) break

      // Click Next
      const nextBtn = await page.$('.btn-next')
      if (!nextBtn) {
        console.log('  ! No Next button, stopping.')
        break
      }
      await nextBtn.click()
      await page.waitForTimeout(400)
    }

    console.log('')
  }

  console.log('All screenshots captured!')
  console.log(`Output: ${OUT_DIR}/`)

  await browser.close()
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})

#!/usr/bin/env node
/** Story smoke test — renders every story in a real browser and fails on any
 *  that comes up blank or logs a console error.
 *
 *  Why this and not a component-test framework: nearly every screen in this
 *  repo is a runtime-compiled Vue template string. A typo in one produces no
 *  build error and no test failure — Vue logs to the console and renders
 *  nothing, so the story is simply blank in Storybook. That is the failure mode
 *  worth automating, and it can only be caught by actually rendering.
 *
 *  Usage:
 *    node scripts/smoke-stories.mjs                  # against a running dev server
 *    node scripts/smoke-stories.mjs --url <url>      # against any Storybook
 *    node scripts/smoke-stories.mjs --filter sept-4  # only matching story ids
 *
 *  Exits non-zero on the first failing run, listing every story that failed.
 */
import { chromium } from 'playwright'

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : fallback
}

const BASE = (arg('url', process.env.SB_URL || 'http://localhost:6006')).replace(/\/$/, '')
const FILTER = arg('filter', '')
const SETTLE_MS = Number(arg('settle', 400))

/* Console noise that is not a story failure. Kept deliberately short — every
   entry here is a class of real error we have chosen to stop seeing. */
const IGNORED = [
  /favicon/i,
  /Failed to load resource.*\/index\.json/i,
]

const index = await fetch(`${BASE}/index.json`).then((r) => r.json()).catch((err) => {
  console.error(`Could not read ${BASE}/index.json — is Storybook running?\n  ${err.message}`)
  process.exit(2)
})

const ids = Object.keys(index.entries)
  .filter((id) => index.entries[id].type !== 'docs' && !id.endsWith('--docs'))
  .filter((id) => !FILTER || id.includes(FILTER))

if (!ids.length) {
  console.error(FILTER ? `No stories matched --filter ${FILTER}` : 'No stories found')
  process.exit(2)
}

console.log(`Smoke-testing ${ids.length} stories against ${BASE}\n`)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const failures = []
let done = 0

for (const id of ids) {
  const errors = []
  const onConsole = (m) => {
    if (m.type() !== 'error') return
    const text = m.text()
    if (!IGNORED.some((re) => re.test(text))) errors.push(text)
  }
  const onPageError = (e) => errors.push(`Uncaught: ${e.message}`)
  page.on('console', onConsole)
  page.on('pageerror', onPageError)

  try {
    await page.goto(`${BASE}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`,
      { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(SETTLE_MS)

    // Read the whole body: dialogs and menus teleport out of #storybook-root.
    const text = (await page.locator('body').innerText().catch(() => '')) || ''
    const html = (await page.locator('#storybook-root').innerHTML().catch(() => '')) || ''

    // A story that rendered nothing at all. Graphical stories still emit markup,
    // so the check is "no text AND essentially no DOM".
    if (text.trim().length === 0 && html.trim().length < 30) errors.push('Rendered blank')
    // The shells in the design-request folders catch a thrown setup() and show
    // this instead of a white screen; treat it as the failure it represents.
    if (text.includes('This screen failed to render')) errors.push('setup() threw — see the story')
  } catch (err) {
    errors.push(`Navigation failed: ${err.message.split('\n')[0]}`)
  }

  page.off('console', onConsole)
  page.off('pageerror', onPageError)

  done++
  if (errors.length) failures.push({ id, errors })
  if (done % 100 === 0) console.log(`  … ${done}/${ids.length} (${failures.length} failing)`)
}

await browser.close()

if (!failures.length) {
  console.log(`\n✓ ${ids.length}/${ids.length} stories rendered clean`)
  process.exit(0)
}

console.log(`\n✗ ${failures.length} of ${ids.length} stories failed\n`)
for (const f of failures) {
  console.log(`  ${f.id}`)
  for (const e of f.errors.slice(0, 3)) console.log(`     ${e.replace(/\s+/g, ' ').slice(0, 200)}`)
}
process.exit(1)

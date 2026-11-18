// Refreshes the screenshots shown inside the device frames on the Start Here
// and Design Requests overview pages.
//
//   pnpm storybook --port 6011      (in another terminal)
//   node scripts/capture-start-here.mjs [--url http://localhost:6011] [--only events,login]
//
// Each entry is a live story, so the pages never show a mock-up that has
// drifted from the library. Output: src/stories/start-here/screens/<name>.jpg
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : fallback
}
const BASE = arg('url', 'http://localhost:6011')
const ONLY = arg('only', '').split(',').filter(Boolean)
const OUT = fileURLToPath(new URL('../src/stories/start-here/screens/', import.meta.url))

const DESKTOP = { width: 1440, height: 900 }

/** name → story id (+ viewport). Desktop unless noted. EventPipe is a desktop
 *  application, so nothing is captured at phone or tablet width. */
const SHOTS = [
  // App Screens
  { name: 'events', id: 'pages-02-events--events' },
  { name: 'hotels', id: 'pages-05-hotels--hotels' },
  // Design System
  { name: 'palette', id: 'foundations-palette--all-hues' },
  // Design Requests — one per request
  { name: 'dr-single-team', id: 'design-requests-single-team-add-and-delete-prototype--full-flow' },
  { name: 'dr-team-name-qualifiers', id: 'design-requests-team-name-qualifiers-screens-registration-settings--default' },
  { name: 'dr-gb-reminders', id: 'design-requests-gb-reminder-controls-screens-02-·-registration-settings--default' },
  { name: 'dr-secondary-fees', id: 'design-requests-multiple-secondary-fees-screens-01-·-event-fees--two-fees' },
  { name: 'dr-comms-phase-2', id: 'design-requests-teams-mgmt-comms-phase-2-screens-notification-preferences--notification-preferences' },
  { name: 'dr-comms-aug-19', id: 'design-requests-aug-19-screens-notification-preferences--notification-preferences' },
  { name: 'dr-comms-phase-1', id: 'design-requests-teams-mgmt-comms-phase-1-v1-·-notifications-preferences--default' },
  { name: 'dr-des-95', id: 'design-requests-des-95-customized-page-revamp-customized-event-site-edits-072426--default' },
  // Eventpipe Labs
  { name: 'lab-ep-pay', id: 'eventpipe-labs-ep-pay-screens-02-·-dashboard--default' },
  { name: 'lab-account-v2', id: 'eventpipe-labs-account-v2-flows-01-·-sign-in--sign-in' },
  { name: 'lab-bulk-edit', id: 'eventpipe-labs-bulk-reservation-edit--reservations-list' },
  { name: 'lab-producer-portal', id: 'event-producer-portal-event-producer-portal--hotels' },
]

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch()
let failed = 0
for (const shot of SHOTS.filter((s) => !ONLY.length || ONLY.includes(s.name))) {
  const viewport = shot.viewport || DESKTOP
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
  try {
    await page.goto(`${BASE}/iframe.html?viewMode=story&id=${encodeURIComponent(shot.id)}`, { waitUntil: 'networkidle' })
    await page.waitForSelector('#storybook-root > *', { timeout: 20000 })
    await page.waitForTimeout(1200) // fonts, chart draw-in
    await page.screenshot({ path: `${OUT}${shot.name}.jpg`, type: 'jpeg', quality: 80 })
    console.log(`✓ ${shot.name}`)
  } catch (err) {
    failed += 1
    console.error(`✗ ${shot.name} (${shot.id}): ${err.message.split('\n')[0]}`)
  }
  await page.close()
}
await browser.close()
process.exit(failed ? 1 : 0)

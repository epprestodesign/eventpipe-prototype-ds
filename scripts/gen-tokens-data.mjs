// Regenerates src/stories/_tokens-data.js from the SCSS token sources so the
// Storybook Palette + Tokens reference pages always match the live system.
//
//   node scripts/gen-tokens-data.mjs
//
// - `ramps`          ← every --ds-palette-<family>-<step> in ds-palette.scss
// - `semanticGroups` ← hex + primitive label for each --ds-color-* token,
//                      resolved through ds-palette.scss. Group/name/desc
//                      structure is preserved from the existing data file.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const css = (f) => readFileSync(resolve(here, '../src/css', f), 'utf8')

// --- 1. Parse the primitive palette -------------------------------------
const paletteSrc = css('ds-palette.scss')
const ORDER = [] // preserve declaration order of families
const ramps = []
const byVar = {} // --ds-palette-red-500 -> #EF4444
const hexToLabel = {} // #EF4444 -> "Red 500"
const cap = (s) => s[0].toUpperCase() + s.slice(1)

for (const m of paletteSrc.matchAll(/--ds-palette-([a-z]+)-(\d+):\s*(#[0-9A-Fa-f]{6,8});/g)) {
  const [, family, step, hex] = m
  const H = hex.toUpperCase()
  byVar[`--ds-palette-${family}-${step}`] = H
  const label = `${cap(family)} ${step}`
  hexToLabel[H] = label
  if (!ORDER.includes(family)) { ORDER.push(family); ramps.push({ family: cap(family), steps: [] }) }
  ramps[ORDER.indexOf(family)].steps.push({ step, hex: H, varName: `--ds-palette-${family}-${step}` })
}

// --- 2. Parse semantic tokens, resolving each to a primitive ------------
// --ds-color-text-brand: var(--ds-palette-navy-900);  OR  a literal #FFFFFF
const semanticSrc = css('ds-color-tokens.scss')
const resolved = {} // "--ds-color-text-brand" -> { hex, primitive }
for (const m of semanticSrc.matchAll(/(--ds-color-[a-z0-9-]+):\s*([^;]+);/g)) {
  const varName = m[1]
  const val = m[2].trim()
  const varMatch = val.match(/var\((--ds-palette-[a-z]+-\d+)\)/)
  if (varMatch) {
    const hex = byVar[varMatch[1]]
    resolved[varName] = { hex, primitive: hexToLabel[hex] }
  } else if (/^#[0-9A-Fa-f]{6,8}$/.test(val)) {
    const H = val.toUpperCase()
    // 8-digit = transparent overlay; label it plainly
    resolved[varName] = { hex: H, primitive: H === '#FFFFFF' ? 'White' : (H.length > 7 ? 'Transparent' : H) }
  }
}
// A data-entry name ("color.text.brand" / "elevation.surface.sunken") maps to
// a --ds-color-* var. Try the direct form, then the surface alias.
const lookup = (name) => {
  const dashed = name.replaceAll('.', '-')
  return resolved[`--ds-${dashed}`] // color.* → --ds-color-*
      ?? resolved[`--ds-color-${name.split('.').slice(1).join('-')}`] // elevation.surface.sunken → --ds-color-surface-sunken
}

// --- 3. Merge into existing group/name/desc structure -------------------
const dataPath = resolve(here, '../src/stories/_tokens-data.js')
const mod = await import(dataPath + `?t=${process.hrtime.bigint()}`)
const semanticGroups = {}
let updated = 0, missing = []
for (const [group, entries] of Object.entries(mod.semanticGroups)) {
  semanticGroups[group] = entries.map((e) => {
    const r = lookup(e.name)
    if (r) { updated++; return { ...e, hex: r.hex, primitive: r.primitive } }
    missing.push(e.name); return e
  })
}

// --- 4. Emit -------------------------------------------------------------
const out =
  `// AUTO-GENERATED token data (Tailwind palette, brand = Navy).\n` +
  `// Regenerate with: node scripts/gen-tokens-data.mjs\n` +
  `export const ramps = ${JSON.stringify(ramps, null, 2)}\n\n` +
  `export const semanticGroups = ${JSON.stringify(semanticGroups, null, 2)}\n`
writeFileSync(dataPath, out)
console.log(`✓ ${ramps.length} ramps, ${updated} semantic tokens updated`)
if (missing.length) console.log('  (no SCSS match, left as-is):', missing.join(', '))

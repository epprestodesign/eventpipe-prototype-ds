/** MDX treats `{name}` in prose as JavaScript, not text. A placeholder like
 *  "Reconciliations for {event}" therefore renders whatever the global `event`
 *  happens to be at that moment: usually nothing, sometimes a browser event
 *  object, which crashes the whole docs page ("Objects are not valid as a
 *  React child"). It passed for two weeks before it broke.
 *
 *  This scans every MDX page for a bare `{identifier}` in prose and fails with
 *  the file and line. Write the placeholder as `\{event\}` (shows the braces)
 *  or put it in backticks. Imports, exports, JSX lines and code spans are
 *  skipped, so real expressions like `{ramps.map(...)}` are unaffected. */
import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))

function mdxFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return name === 'node_modules' ? [] : mdxFiles(path)
    return name.endsWith('.mdx') ? [path] : []
  })
}

/** Bare `{identifier}` (or `{a.b}`) in a prose line, outside code spans. */
export function bareExpressions(source) {
  const hits = []
  let inFence = false
  source.split('\n').forEach((line, i) => {
    if (/^\s*```/.test(line)) { inFence = !inFence; return }
    if (inFence || /^\s*(import|export|<|\/\/|\{)/.test(line)) return
    const prose = line.replace(/`[^`]*`/g, '')
    for (const m of prose.matchAll(/(?<![=\w\\])\{([A-Za-z_$][\w.$]*)\}/g)) hits.push(`${i + 1}: {${m[1]}}`)
  })
  return hits
}

describe('MDX prose', () => {
  it('flags a bare placeholder and ignores escaped or quoted ones', () => {
    expect(bareExpressions('opens **Reconciliations for {event}**')).toEqual(['1: {event}'])
    expect(bareExpressions('opens **Reconciliations for \\{event\\}**')).toEqual([])
    expect(bareExpressions('opens `Reconciliations for {event}`')).toEqual([])
    expect(bareExpressions('<Band art={art} title="Palette">x</Band>')).toEqual([])
  })

  for (const file of mdxFiles(root)) {
    it(`has no bare {expressions} in prose: ${file.slice(root.length)}`, () => {
      expect(bareExpressions(readFileSync(file, 'utf8'))).toEqual([])
    })
  }
})

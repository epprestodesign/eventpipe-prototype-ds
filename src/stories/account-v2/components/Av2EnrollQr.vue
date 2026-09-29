<script setup>
/* Av2EnrollQr — a QR *placeholder*, drawn, not fetched.
 *
 * Deliberately not a real QR code and deliberately not an image request. A
 * prototype that fetches a QR from a generator service leaks the (fake) secret
 * to a third party on every render, and a committed PNG rots the moment the
 * secret in the story changes. So the pattern is generated locally from a
 * fixed seed: it is stable across renders (no flicker between stories, no
 * visual diff churn in screenshots) and it is honestly undecodable.
 *
 * The three corner finder squares are drawn for real, because they are what
 * makes a black-and-white grid read as "a QR code" at a glance — without them
 * reviewers see noise and ask what the box is.
 */
import { computed } from 'vue'

const props = defineProps({
  /** Rendered edge length in px. The module grid scales to fit. */
  size: { type: Number, default: 180 },
  /** Modules per side. 25 is a realistic density for a TOTP otpauth:// URI. */
  modules: { type: Number, default: 25 },
})

const N = computed(() => props.modules)

/** A finder square occupies a 7×7 block at three of the four corners. */
function finderBlock(r, c) {
  const n = N.value
  const near = (v) => (v < 7 ? 0 : v >= n - 7 ? n - 7 : null)
  const br = near(r)
  const bc = near(c)
  if (br === null || bc === null) return null
  // Bottom-right has no finder in a real QR — that corner carries the
  // alignment pattern instead, which is what makes the code's rotation
  // unambiguous.
  if (br === n - 7 && bc === n - 7) return null
  return { y: r - br, x: c - bc }
}

/** The quiet ring around each finder, kept blank so the finders stay legible. */
function inFinderZone(r, c) {
  const n = N.value
  const lo = (v) => v < 8
  const hi = (v) => v >= n - 8
  return (lo(r) && lo(c)) || (lo(r) && hi(c)) || (hi(r) && lo(c))
}

const cells = computed(() => {
  const n = N.value
  // Fixed-seed LCG rather than Math.random: the same pattern every render.
  let seed = 0x5eed1e
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  const out = []
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const f = finderBlock(r, c)
      if (f) {
        const ring = f.y === 0 || f.y === 6 || f.x === 0 || f.x === 6
        const core = f.y >= 2 && f.y <= 4 && f.x >= 2 && f.x <= 4
        if (ring || core) out.push(`${r}:${c}`)
        continue
      }
      if (inFinderZone(r, c)) continue
      // Alignment pattern, bottom-right: 5×5 ring with a single centre module.
      if (r >= n - 9 && r <= n - 5 && c >= n - 9 && c <= n - 5) {
        const y = r - (n - 9)
        const x = c - (n - 9)
        const ring = y === 0 || y === 4 || x === 0 || x === 4
        if (ring || (y === 2 && x === 2)) out.push(`${r}:${c}`)
        continue
      }
      if (rnd() > 0.5) out.push(`${r}:${c}`)
    }
  }
  return out.map((k) => k.split(':').map(Number))
})
</script>

<template>
  <div class="av2qr">
    <svg
      :width="size" :height="size" :viewBox="`0 0 ${N} ${N}`"
      shape-rendering="crispEdges" role="img"
      aria-label="QR code containing your authenticator setup key">
      <rect :width="N" :height="N" class="av2qr__bg" />
      <rect v-for="([r, c]) in cells" :key="`${r}-${c}`" :x="c" :y="r" width="1" height="1" class="av2qr__mod" />
    </svg>
  </div>
</template>

<style scoped>
/* A white frame with real padding: a QR pressed against a border scans badly,
   and the framed treatment is what every authenticator setup page uses. */
.av2qr {
  display: inline-block;
  padding: 14px;
  background: var(--ds-color-surface);
  border: 1px solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
}
.av2qr svg { display: block; }

/* Filled through CSS rather than a `fill` attribute. Not because the attribute
   form fails — `fill="var(--token)"` does resolve in current Chromium, tested —
   but because Safari only began honouring custom properties in presentation
   attributes in 16.4, and a class costs nothing. */
.av2qr__bg { fill: var(--ds-color-surface); }
.av2qr__mod { fill: var(--ds-color-background-neutral-bold); }
</style>

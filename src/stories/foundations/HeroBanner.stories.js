// FOUNDATIONS / Hero Banner — full-width hero using a HOSTED background asset.
// Asset lives in the imagery repo and is served via VITE_IMAGERY_URL:
//   https://epprestodesign.github.io/presto-ds-imagery/hero/hero-banner.jpg
const BASE = (import.meta.env.VITE_IMAGERY_URL || '').replace(/\/$/, '')
const HERO = BASE ? `${BASE}/hero/hero-banner.jpg` : ''

export default {
  title: 'Foundations/Hero Banner',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
## Overview
A full-width hero banner built on a **hosted** background asset (from the
\`presto-ds-imagery\` repo), with overlaid heading, copy, and a call to action.

**Asset:** \`${HERO || 'set VITE_IMAGERY_URL'}\` — hosted alongside the rest of the
imagery, so updating it needs no design-system rebuild.

## Usage
\`\`\`html
<section class="hero" :style="{ backgroundImage: scrim + ', url(' + heroUrl + ')' }">
  <div class="hero__content"> …heading, copy, CTA… </div>
</section>
\`\`\`
Keep text in the left ~50% over a dark scrim for legibility.
` } } },
}

const scrim = 'linear-gradient(90deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.5) 45%, rgba(0,0,0,0) 80%)'
const bg = (h) => ({
  position: 'relative', backgroundColor: '#000', color: '#fff', overflow: 'hidden',
  backgroundImage: h ? `${scrim}, url(${h})` : scrim,
  backgroundSize: 'cover', backgroundPosition: 'center',
})

/** Hero with overlaid content (heading + copy + CTA). */
export const Default = {
  render: () => ({
    setup: () => ({ style: { ...bg(HERO), minHeight: '360px', display: 'flex', alignItems: 'center' }, hosted: !!HERO }),
    template: `
      <section :style="style">
        <div style="padding:0 56px; max-width:560px">
          <div class="text-overline" style="color:#5EEAD4; letter-spacing:.16em">Birdie Stays</div>
          <div class="text-h3" style="font-weight:700; line-height:1.1; margin:8px 0 12px">Find your next stay</div>
          <div class="text-body1" style="color:#D4D4D8; max-width:420px">Book hand-picked hotels with free cancellation and member rates.</div>
          <div class="q-mt-lg q-gutter-sm">
            <q-btn unelevated color="white" text-color="dark" label="Search hotels" icon="search" />
            <q-btn flat color="white" label="Explore destinations" />
          </div>
          <div v-if="!hosted" class="text-caption q-mt-lg" style="color:#A1A1AA">Set VITE_IMAGERY_URL and host the asset to load the banner.</div>
        </div>
      </section>`,
  }),
}

/** The raw asset, full-bleed (no overlay). */
export const Asset = {
  render: () => ({
    setup: () => ({ style: { ...bg(HERO), height: '300px' } }),
    template: `<div :style="style"></div>`,
  }),
}

/** Compact variant (shorter height, e.g. interior pages). */
export const Compact = {
  render: () => ({
    setup: () => ({ style: { ...bg(HERO), minHeight: '200px', display: 'flex', alignItems: 'center' } }),
    template: `
      <section :style="style">
        <div style="padding:0 40px; max-width:520px">
          <div class="text-h5" style="font-weight:700">Member deals this week</div>
          <div class="text-body2" style="color:#D4D4D8">Up to 25% off select properties.</div>
        </div>
      </section>`,
  }),
}

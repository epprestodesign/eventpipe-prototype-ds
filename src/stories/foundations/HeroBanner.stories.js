// FOUNDATIONS / Hero Banner — two hosted banner assets, one per page context.
// Assets live in the imagery repo and default to the public hosted URL so they
// render everywhere (local dev + deployed); VITE_IMAGERY_URL overrides if set.
//   Landing page  : hero/hero-banner.jpg                  (1592×400)
//   Hotel listings: hero/hotel-listings-banner_1440x200.jpg (1440×200)
const FALLBACK_BASE = 'https://epprestodesign.github.io/presto-ds-imagery'
const BASE = (import.meta.env.VITE_IMAGERY_URL || FALLBACK_BASE).replace(/\/$/, '')
const HERO_LANDING = `${BASE}/hero/hero-banner.jpg`
const HERO_LISTINGS = `${BASE}/hero/hotel-listings-banner_1440x200.jpg`

export default {
  title: 'Foundations/Hero Banner',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
## Overview
Two **hosted** hero banners, each sized for a specific page context:

| Story | Asset | Dimensions | Used on |
| --- | --- | --- | --- |
| **Landing Page** | \`hero/hero-banner.jpg\` | 1592×400 | Marketing / landing |
| **Hotel Listings** | \`hero/hotel-listings-banner_1440x200.jpg\` | 1440×200 | Search / listings results |

Assets are hosted in the \`presto-ds-imagery\` repo, so swapping artwork needs no
design-system rebuild. The Hotel Listings banner is a **background image** behind
an overlaid logo, headline, and subheadline.
` } } },
}

const scrim = 'linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5))'
const bg = (url, extra = {}) => ({
  position: 'relative', backgroundColor: '#000', color: '#fff', overflow: 'hidden',
  backgroundImage: `${scrim}, url(${url})`,
  backgroundSize: 'cover', backgroundPosition: 'center',
  display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', ...extra,
})

/** Landing page hero (1592×400) — eyebrow, heading, and copy (centered, no CTAs). */
export const LandingPage = {
  name: 'Landing Page',
  render: () => ({
    setup: () => ({ style: { ...bg(HERO_LANDING), minHeight: '400px' } }),
    template: `
      <section :style="style">
        <div style="padding:0 24px; max-width:620px">
          <div class="text-overline" style="color:#5EEAD4; letter-spacing:.16em">Presto Stays</div>
          <div class="text-h3" style="font-weight:700; line-height:1.1; margin:8px 0 12px">Find your next stay</div>
          <div class="text-body1" style="color:#D4D4D8; max-width:460px; margin:0 auto">Book hand-picked hotels with free cancellation and member rates.</div>
        </div>
      </section>`,
  }),
}

/** Hotel listings banner (1440×200) — background image with centered logo + headline + subheadline. */
export const HotelListings = {
  name: 'Hotel Listings',
  render: () => ({
    setup: () => ({ style: { ...bg(HERO_LISTINGS), width: '100%', aspectRatio: '1440 / 200' } }),
    template: `
      <section :style="style">
        <div style="padding:0 24px; max-width:760px">
          <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:8px">
            <q-icon name="golf_course" size="22px" style="color:#5EEAD4" />
            <span style="font-weight:700; letter-spacing:.02em; font-size:1.0625rem">Presto Stays</span>
          </div>
          <div class="text-h5" style="font-weight:700; line-height:1.15; margin-bottom:4px">Hotels for your tournament weekend</div>
          <div class="text-body2" style="color:#D4D4D8">Team rates, free cancellation, and stays near the fields.</div>
        </div>
      </section>`,
  }),
}

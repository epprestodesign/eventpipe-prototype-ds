/** FOUNDATIONS / Logos → the EventPipe logo and its color variants. */
import logoColor from '../../assets/logo/eventpipe-logo.svg'
import logoWhite from '../../assets/logo/eventpipe-logo-fff.svg'
import logoBlack from '../../assets/logo/eventpipe-logo-000.svg'
import partner365 from '../../assets/logo/365Logo_Horizontal.png'
import partnerTTS from '../../assets/logo/TTS-Logo-e1749152469615.png'
import partnerTraveloc from '../../assets/logo/traveloc.png'
// All partner logos dropped into the batch folder, auto-imported. The TTS logo
// there is a byte-identical duplicate of the one above, so it's filtered out.
const batchLogos = import.meta.glob('../../assets/logo/batch_070726/*.{png,jpg,jpeg}', { eager: true, import: 'default' })
const batchPartners = Object.entries(batchLogos)
  .filter(([path]) => !path.includes('TTS-Logo-e1749152469615'))
  .map(([, src]) => src)

export default {
  title: 'Foundations/Logos',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: `
## Logos
The EventPipe wordmark ships in three variants. Pick by the surface it sits on so
the mark keeps sufficient contrast.

- **Full color** — default; use on white / light surfaces (\`--ds-color-surface\`).
- **White (reversed)** — use on the dark navy chrome / sidebar
  (\`--ds-color-surface-sidebar\`, #00123D) and photography.
- **Black (mono)** — one-color contexts, print, watermarks.

Assets live in \`src/assets/logo/\`. The native artwork is 128×33 — scale
proportionally; keep clear space around it and don't recolor outside these variants.
` } },
  },
}

const chip = (label, bg, src, border) => `
  <div style="display:flex; flex-direction:column; gap:12px;">
    <div style="height:120px; display:flex; align-items:center; justify-content:center;
      background:${bg}; border-radius:12px; ${border ? 'border:1px solid var(--ds-color-border);' : ''}">
      <img src="${src}" alt="EventPipe logo — ${label}" style="width:180px; height:auto;" />
    </div>
    <div style="font-size:0.8125rem; color:var(--ds-color-text-subtle);">${label}</div>
  </div>`

export const Variants = {
  render: () => ({
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px; max-width:760px;">
        ${chip('Full color · on light', 'var(--ds-color-surface)', logoColor, true)}
        ${chip('White · on navy chrome', 'var(--ds-color-surface-sidebar)', logoWhite, false)}
        ${chip('Black · mono', 'var(--ds-color-surface)', logoBlack, true)}
      </div>`,
  }),
}

export const Sizes = {
  render: () => ({
    template: `
      <div style="display:flex; align-items:flex-end; gap:32px; flex-wrap:wrap;">
        <img src="${logoColor}" alt="EventPipe" style="width:96px; height:auto;" />
        <img src="${logoColor}" alt="EventPipe" style="width:140px; height:auto;" />
        <img src="${logoColor}" alt="EventPipe" style="width:200px; height:auto;" />
      </div>`,
  }),
}

/** Partner logos — co-brands displayed alongside EventPipe (e.g. in the org
 *  switcher, partner pages, or reports). Shown on white cards with even sizing. */
const partnerCard = (label, src) => `
  <div style="display:flex; flex-direction:column; gap:12px;">
    <div style="height:120px; display:flex; align-items:center; justify-content:center;
      background:var(--ds-color-surface); border:1px solid var(--ds-color-border); border-radius:12px; padding:20px;">
      <img src="${src}" alt="${label || 'Partner logo'}" style="max-width:100%; max-height:72px; height:auto; width:auto;" />
    </div>
    ${label ? `<div style="font-size:0.8125rem; color:var(--ds-color-text-subtle);">${label}</div>` : ''}
  </div>`

export const Partners = {
  parameters: { docs: { description: { story: 'Co-brand partner logos shown alongside EventPipe. Drop new logos into `src/assets/logo/batch_070726/` and they appear here automatically.' } } },
  render: () => ({
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:20px; max-width:920px;">
        ${partnerCard('365', partner365)}
        ${partnerCard('Team Travel Source', partnerTTS)}
        ${partnerCard('Traveloc', partnerTraveloc)}
        ${batchPartners.map((src) => partnerCard('', src)).join('')}
      </div>`,
  }),
}

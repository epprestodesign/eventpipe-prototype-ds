/** LAYOUT / Grid → Quasar grid CSS classes (.row / .col-* / q-col-gutter-*) */
export default {
  title: 'Components/Layout & Structure/Grid',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
12-column responsive grid via Quasar **CSS classes** — no component needed.
\`row\` + \`col-12 col-md-6 col-lg-4\`; gutters with \`q-col-gutter-md\`.

## When to use
- 2-D responsive layouts (dashboards, card grids). For 1-D use **Stack**.

## Breakpoints
\`col-<bp>-<n>\` where bp ∈ xs/sm/md/lg/xl. See **Foundations / Breakpoints**.

## Quasar mapping
\`Grid → Quasar grid classes\` (token/CSS system).
` } } },
}
const cell = (label) => `<div class="bg-primary text-white flex flex-center" style="height:64px;border-radius:8px">${label}</div>`
export const TwelveColumns = {
  render: () => ({ template: `
    <div class="q-col-gutter-md">
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-6">${cell('col-6')}</div>
        <div class="col-6">${cell('col-6')}</div>
      </div>
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-4">${cell('col-4')}</div>
        <div class="col-4">${cell('col-4')}</div>
        <div class="col-4">${cell('col-4')}</div>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-3" v-for="n in 4" :key="n">${cell('col-3')}</div>
      </div>
    </div>` }),
}
export const Responsive = {
  parameters: { docs: { description: { story: 'Resize the canvas: 1 col on phones → 2 on tablets → 4 on desktop.' } } },
  render: () => ({ template: `
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-lg-3" v-for="n in 4" :key="n">${cell('12 / sm-6 / lg-3')}</div>
    </div>` }),
}

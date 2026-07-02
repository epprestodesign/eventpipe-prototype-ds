// CHECKOUT EXPERIENCE / Policies / Group Block — the policies + agreement surface
// for the group-block flow. A single hotel shows one card; multiple hotels lump
// into an accordion with a per-hotel agreement checkbox, and the "Hold Group
// Block Now" CTA enables only once EVERY hotel's box is checked.
import { ref } from 'vue'
import { loadImagery } from '../../lib/imagery'
import PoliciesAgreement from '../../components/checkout/PoliciesAgreement.vue'

const useHotels = (defs) => {
  const hotels = ref(defs.map((d) => ({ name: d.name })))
  loadImagery().then((lib) => {
    hotels.value = defs.map((d) => { const arr = lib[d.cat] || lib.rooms || []; return { name: d.name, image: arr[d.seed]?.url } })
  })
  return hotels
}

export default {
  title: 'Checkout Experience/Policies/Group Block',
  component: PoliciesAgreement,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
## Policies — Group Block
The review-and-agree surface for a group block. A **single hotel** shows one
card headed by the property; **multiple hotels** collapse into an **accordion**
with an agreement checkbox **per hotel** — the **Hold Group Block Now** CTA
enables only once every hotel's policies are agreed to.
` } } },
}

const wrap = (inner, data = {}) => ({ components: { PoliciesAgreement }, setup: () => data, template: `<div style="padding:32px 24px;max-width:720px;margin:0 auto">${inner}</div>` })

/** Single hotel — one card, headed by the property, "Hold Group Block Now" CTA. */
export const SingleHotel = {
  name: 'Single Hotel',
  render: () => wrap(`<policies-agreement flow="group" :hotels="hotels" />`, { hotels: useHotels([{ name: 'Embassy Suites Chicago Downtown', cat: 'suites', seed: 0 }]) }),
}

/** Multiple hotels — accordion; each hotel has its own agreement checkbox and
 *  all must be checked before the CTA enables. */
export const MultipleHotels = {
  name: 'Multiple Hotels',
  render: () => wrap(`<policies-agreement flow="group" :hotels="hotels" />`, {
    hotels: useHotels([
      { name: 'Embassy Suites Chicago Downtown', cat: 'suites', seed: 0 },
      { name: 'The Concord Hotel', cat: 'lobby', seed: 1 },
      { name: 'Hilton Orlando Lake Buena Vista', cat: 'exterior', seed: 2 },
    ]),
  }),
}

// CHECKOUT EXPERIENCE / Policies / Book Reservation — the policies + agreement
// surface for the single-reservation flow: one "Policies" card, one agreement
// checkbox, and a "Book Now" CTA that enables once checked.
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
  title: 'Checkout Experience/Policies/Book Reservation',
  component: PoliciesAgreement,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
## Policies — Book Reservation
The review-and-agree surface for a single reservation: a **Policies** card
(HoCoBook + hotel policies), one **agreement checkbox**, and a **Book Now** CTA
that stays muted until the box is checked.
` } } },
}

const wrap = (inner, data = {}) => ({ components: { PoliciesAgreement }, setup: () => data, template: `<div style="padding:32px 24px;max-width:720px;margin:0 auto">${inner}</div>` })

/** Single reservation — generic "Policies" card, "Book Now" CTA. */
export const SingleReservation = { render: () => wrap(`<policies-agreement flow="reserve" />`) }

/** Named property — same card headed by the hotel (thumbnail + name). */
export const NamedHotel = {
  name: 'Named Hotel',
  render: () => wrap(`<policies-agreement flow="reserve" :hotels="hotels" />`, { hotels: useHotels([{ name: 'The Concord Hotel', cat: 'lobby', seed: 1 }]) }),
}

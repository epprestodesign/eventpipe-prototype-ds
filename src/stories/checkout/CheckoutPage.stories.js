// CHECKOUT EXPERIENCE / Checkout Page — Airbnb-style stepped checkout with a
// sticky order summary. Two variants: group/team hold and single reservation.
import { ref, computed } from 'vue'
import { loadImagery } from '../../lib/imagery'
import CheckoutPage from '../../components/checkout/CheckoutPage.vue'

const useHero = (category, seed) => {
  const img = ref('')
  loadImagery().then((lib) => { const arr = lib[category] || lib.rooms || []; if (arr[seed]) img.value = arr[seed].url })
  return img
}

export default {
  title: 'Checkout Experience/Checkout Page',
  component: CheckoutPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
The **Checkout Page** is the Airbnb-style "Confirm and pay" flow: a left stepped
accordion (Review order → Contact & group info → Payment → Review reservation)
beside a sticky **Order Summary**. The **Add a payment method** step uses the
Instacart-style payment dialogs. \`mode\` toggles the group-details step.
` } } },
}

/** Group / team hold checkout — includes the group-details step. */
export const GroupHold = {
  render: () => ({
    components: { CheckoutPage },
    setup() {
      const img = useHero('suites', 1)
      const cart = {
        heldSeconds: 372, taxRate: 0.12, feePerNight: 30,
        hotels: [
          { name: 'Embassy Suites Chicago Downtown', imageCategories: ['suites', 'rooms'], seed: 0, rooms: [
            { type: 'Two-Room Suite King', summary: '1 King Bed · Sleeps 4', price: 269, nights: [{ date: 'Tue, Jun 23', qty: 4, roomsLeft: 6 }, { date: 'Wed, Jun 24', qty: 1, roomsLeft: 5 }] },
            { type: 'Two-Room Suite Double', summary: '2 Queen Beds · Sleeps 4', price: 289, nights: [{ date: 'Tue, Jun 23', qty: 1, roomsLeft: 5 }, { date: 'Wed, Jun 24', qty: 1, roomsLeft: 4 }] },
          ] },
          { name: 'The Concord Hotel', imageCategories: ['lobby', 'rooms'], seed: 2, rooms: [
            { type: 'King Studio', summary: '1 King Bed · Sleeps 2', price: 165, nights: [{ date: 'Tue, Jun 23', qty: 1, roomsLeft: 6 }] },
          ] },
        ],
      }
      const summary = computed(() => ({
        image: img.value,
        title: 'Group hold',
        subtitle: 'Embassy Suites + The Concord',
        rrow1: '8 rooms · 2 hotels',
        rows: [
          { label: 'Dates', value: 'Jun 23 – 25, 2026', change: true },
          { label: 'Rooms', value: '8 rooms · 2 hotels', change: true },
        ],
        priceLines: [
          { label: 'Room charges', value: 2088 },
          { label: 'Taxes', value: 250.56 },
          { label: 'Property fees', value: 240 },
        ],
        total: 2578.56,
        note: 'Rooms held — finish before the timer ends',
      }))
      return { cart, summary }
    },
    template: `<checkout-page mode="group" :cart="cart" :summary="summary" />`,
  }),
}

/** Single reservation checkout — contact only, no group step. */
export const Reservation = {
  render: () => ({
    components: { CheckoutPage },
    setup() {
      const img = useHero('rooms', 2)
      const cart = {
        heldSeconds: 895,
        hotel: { name: 'The Concord Hotel', address: '750 Tremont St, Boston, MA 02118' },
        imageCategories: ['suites', 'rooms', 'lobby', 'pool', 'dining'], seed: 1,
        checkIn: { date: '06/23/2026', time: '4:00pm' }, checkOut: { date: '06/24/2026', time: '11:00am' }, nights: 1,
        highlights: [{ icon: 'kitchen', label: 'Kitchen' }, { icon: 'ac_unit', label: 'Air conditioning' }, { icon: 'microwave', label: 'Microwave' }],
        roomType: 'Aparthotel', bedConfig: '1 King Bed and 1 Queen Sofa Bed', sleeps: 2, amenities: [{ icon: 'wifi', label: 'Free WiFi' }],
        priceDetails: { nights: 1, rooms: 1, rate: 164.78, subtotal: 164.78, program: 'OneKeyCash applied', discount: '$26.55 off', taxes: 47.53, propertyFee: 110.0, total: 322.31 },
        roomsLeft: 1,
      }
      const summary = computed(() => ({
        image: img.value,
        title: 'The Concord Hotel',
        subtitle: 'Aparthotel · Sleeps 2',
        rating: '4.8',
        cancellation: 'Free cancellation before Jun 20, 2026.',
        rrow1: '1 room · 1 night',
        rows: [
          { label: 'Dates', value: 'Jun 23 – 24, 2026', change: true },
          { label: 'Guests', value: '2 adults', change: true },
        ],
        priceLines: [
          { label: '1 night × $164.78', value: 164.78 },
          { label: 'Taxes', value: 47.53 },
          { label: 'Property fee', value: 110 },
        ],
        total: 322.31,
        note: 'Rare find! This room is usually booked',
      }))
      return { cart, summary }
    },
    template: `<checkout-page mode="reservation" :cart="cart" :summary="summary" />`,
  }),
}

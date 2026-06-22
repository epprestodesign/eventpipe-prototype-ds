// CHECKOUT EXPERIENCE / Steps / Contact Info — step 2, both variants.
import { ref } from 'vue'
import StepContactInfo from '../../components/checkout/steps/StepContactInfo.vue'

export default {
  title: 'Checkout Experience/Steps/Contact Info',
  component: StepContactInfo,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Step 2 — variant-specific. **Group Hold** is the teams block (search/add teams + primary contact); **Reservation** is contact + guests staying.' } } },
}

const wrap = (inner, data) => ({ components: { StepContactInfo }, setup: () => data, template: `<div style="max-width:640px;margin:0 auto;padding:32px">${inner}</div>` })

export const GroupHold = { render: () => wrap(`<step-contact-info mode="group" v-model="m" />`, { m: ref({}) }) }

/**
 * Reservation — per-room **Guest Information**. Aware of the booking widget's
 * selection via `rooms` ("3 travelers, 2 rooms" → Room 1 with 2 adults, Room 2
 * with 1 adult). Each room's Additional Guests are pre-seeded from occupancy
 * (adults + children − 1 primary) and stay add/removable. Team Name and the
 * Custom Fields are event-configurable.
 */
export const Reservation = {
  render: () => wrap(
    `<step-contact-info mode="reservation" :rooms="rooms" :team-name="true" :custom-fields="customFields" v-model="m" />`,
    {
      m: ref([]),
      // From the booking widget: 3 travelers across 2 rooms.
      rooms: [{ adults: 2, children: 0 }, { adults: 1, children: 0 }],
      customFields: [
        { key: 'cf1', label: 'Custom Field 1', type: 'select', options: ['Option 1', 'Option 2', 'Option 3'], required: true },
        { key: 'cf2', label: 'Custom Field 2', type: 'text', optional: true },
      ],
    },
  ),
}

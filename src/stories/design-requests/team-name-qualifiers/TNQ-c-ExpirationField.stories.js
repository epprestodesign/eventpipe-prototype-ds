/** Team Name Qualifiers — the expiration date + time field. */
import { ref } from 'vue'
import TnqExpirationField from './components/TnqExpirationField.vue'

export default {
  title: 'Design Requests/Team Name Qualifiers/Components/Expiration Field',
  component: TnqExpirationField,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'The expiration control Registration Settings reveals under **Room Block Restrictions** and under each **Team Selection Required** checkbox: a DsInput date (calendar popup) with a clock button for the time, recorded in EST.' } },
  },
}

const field = (label, date = '', time = '') => ({
  render: () => ({
    components: { TnqExpirationField },
    setup: () => ({ label, date: ref(date), time: ref(time) }),
    template: '<tnq-expiration-field :label="label" v-model:date="date" v-model:time="time" />',
  }),
})

/** Empty, as revealed. */
export const Empty = field('Registration Requirement Expiration For Group Blocks')
/** Date and time set. */
export const Filled = field('Registration Requirement Expiration For Reservations', '01/29/2027', '05:00 PM')

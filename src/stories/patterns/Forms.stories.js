/** PATTERNS / Forms → QForm + inputs + validation (composition) */
import { ref } from 'vue'
export default {
  title: 'Browse Hotels/Forms',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
A composition pattern: layout, labeling, validation, and submission for data entry.
Here: the **guest details** step of a booking. Use one column, clear required
markers, inline errors, and a single primary submit.

## Edge cases
- **Invalid email/phone** → inline error on blur, block submit.
- **Special requests** are optional and never block confirmation.
` } } },
}
export const GuestDetails = {
  name: 'Guest Details',
  render: () => ({
    setup() {
      const name = ref(''); const email = ref(''); const phone = ref(''); const requests = ref(''); const done = ref(false)
      return { name, email, phone, requests, done, submit: () => (done.value = true) }
    },
    template: `
      <q-form @submit="submit" class="q-gutter-md" style="max-width:400px">
        <div class="text-h6">Guest details</div>
        <q-input v-model="name" outlined label="Lead guest name *" :rules="[v => !!v || 'Required']" />
        <q-input v-model="email" outlined label="Email *" type="email" hint="Confirmation is sent here" :rules="[v => /.+@.+\\..+/.test(v) || 'Enter a valid email']" />
        <q-input v-model="phone" outlined label="Phone *" mask="(###) ###-####" :rules="[v => (v && v.length>=10) || 'Enter a valid phone']" />
        <q-input v-model="requests" outlined type="textarea" label="Special requests (optional)" hint="e.g. high floor, early check-in" />
        <div><q-btn type="submit" color="primary" label="Continue to payment" /><q-btn type="reset" flat color="primary" label="Reset" class="q-ml-sm" /></div>
        <q-banner v-if="done" class="bg-positive text-white rounded-borders">Details saved — proceeding to payment.</q-banner>
      </q-form>` }),
}

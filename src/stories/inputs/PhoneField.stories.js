// INPUTS / Phone Field — text input with a country-code dropdown.
import { ref } from 'vue'
import PhoneField from '../../components/checkout/PhoneField.vue'

export default {
  title: 'Inputs/Phone Field',
  component: PhoneField,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
**Phone Field** pairs a country-code dropdown (flag + dial code) with a phone
number input. \`v-model\` holds the number; the selected code is prepended.
Promoted from the checkout contact forms so any form can reuse it.

\`\`\`html
<phone-field v-model="phone" :error="!!err" @blur="touched = true" />
\`\`\`
` } } },
}

export const Basic = {
  render: () => ({ components: { PhoneField }, setup: () => ({ v: ref('') }), template: `<div style="max-width:420px"><phone-field v-model="v" /></div>` }),
}

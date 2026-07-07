/** INPUTS / Text Area → Quasar: QInput type="textarea" (native) */
import { ref } from 'vue'
export default {
  title: 'Components/Forms/Text Area',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Multi-line text entry for longer free-form content (notes, descriptions).

## When to use
- Order notes, special requests, comments, internal memos.

## When not to use
- Short single values → **Text Field**.

## Quasar mapping
\`Text Area → QInput type="textarea"\` (a variant of the Text Field wrapper).
` } } },
}

export const Basic = {
  render: () => ({ setup: () => ({ v: ref('') }), template: `<q-input v-model="v" outlined type="textarea" label="Order notes" style="max-width:360px" />` }),
}

export const Autogrow = {
  render: () => ({ setup: () => ({ v: ref('') }), template: `<q-input v-model="v" outlined autogrow label="Auto-growing" hint="Grows as you type" style="max-width:360px" />` }),
}

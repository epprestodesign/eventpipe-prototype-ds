/** INPUTS / Text Field → Quasar: QInput (outlined). All field types & variations,
 *  outlined style. Ref: https://quasar.dev/vue-components/input#outlined */
import { ref } from 'vue'

export default {
  title: 'Components/Forms/Text Field',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Single- and multi-line text entry — the workhorse input for guest details, promo
codes, search, and more. The design system standardizes on the **outlined**
variant; every example below is outlined.

## When to use
- Short free-form values; with \`type\` for email/number/password/tel/url/search/date/time.

## When not to use
- Long text → use the **textarea** type (below). Choice from a set → **Select**.

## Accessibility
Always provide a \`label\`; surface errors with \`:rules\` / \`error\` + \`error-message\`.

## Quasar mapping
\`Text Field → QInput\` (outlined). Recommended Tier-2 wrapper: \`PrestoTextField\`.
` } } },
}

/** Basic outlined field. */
export const Basic = {
  render: () => ({ setup: () => ({ v: ref('') }), template: `<q-input v-model="v" outlined label="Guest name" style="max-width:320px" />` }),
}

/** All input TYPES — outlined. */
export const Types = {
  parameters: { docs: { description: { story: 'Every QInput `type`, outlined.' } } },
  render: () => ({
    setup: () => ({
      text: ref(''), pwd: ref(''), show: ref(false), email: ref(''), search: ref(''),
      tel: ref(''), num: ref(2), url: ref(''), date: ref('2026/06/02'), time: ref('15:00'),
      dt: ref('2026-06-02T15:00'), area: ref(''), grow: ref(''),
    }),
    template: `
      <div class="column q-gutter-md" style="max-width:340px">
        <q-input v-model="text" outlined label="Text (default)" />
        <q-input v-model="pwd" outlined :type="show ? 'text' : 'password'" label="Password">
          <template #append><q-icon :name="show ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="show=!show" /></template>
        </q-input>
        <q-input v-model="email" outlined type="email" label="Email" />
        <q-input v-model="search" outlined type="search" label="Search" debounce="300"><template #prepend><q-icon name="search" /></template></q-input>
        <q-input v-model="tel" outlined type="tel" label="Phone" />
        <q-input v-model="num" outlined type="number" label="Guests" />
        <q-input v-model="url" outlined type="url" label="Website" />
        <q-input v-model="date" outlined type="date" label="Date" stack-label />
        <q-input v-model="time" outlined type="time" label="Time" stack-label />
        <q-input v-model="dt" outlined type="datetime-local" label="Date & time" stack-label />
        <q-input v-model="area" outlined type="textarea" label="Notes (textarea)" />
        <q-input v-model="grow" outlined autogrow label="Auto-grow" hint="Grows as you type" />
      </div>`,
  }),
}

/** Labels — label, stack-label, placeholder. */
export const Labels = {
  render: () => ({ setup: () => ({ a: ref(''), b: ref(''), c: ref('') }), template: `
    <div class="column q-gutter-md" style="max-width:340px">
      <q-input v-model="a" outlined label="Floating label" />
      <q-input v-model="b" outlined stack-label label="Stacked label" />
      <q-input v-model="c" outlined label="With placeholder" placeholder="e.g. Jane Doe" stack-label />
    </div>` }),
}

/** Helpers — hint, counter + maxlength, clearable, loading. */
export const Helpers = {
  render: () => ({ setup: () => ({ a: ref(''), b: ref(''), c: ref('Clear me'), d: ref('') }), template: `
    <div class="column q-gutter-md" style="max-width:340px">
      <q-input v-model="a" outlined label="With hint" hint="We never share it" />
      <q-input v-model="b" outlined label="Counter" counter maxlength="20" />
      <q-input v-model="c" outlined label="Clearable" clearable />
      <q-input v-model="d" outlined label="Loading" loading />
    </div>` }),
}

/** Affixes — prefix, suffix, prepend/append icons & buttons. */
export const Affixes = {
  render: () => ({ setup: () => ({ a: ref(''), b: ref(''), c: ref(''), d: ref(''), e: ref('') }), template: `
    <div class="column q-gutter-md" style="max-width:340px">
      <q-input v-model="a" outlined label="Amount" prefix="$" />
      <q-input v-model="b" outlined label="Weight" suffix="kg" />
      <q-input v-model="c" outlined label="Prepend icon"><template #prepend><q-icon name="person" /></template></q-input>
      <q-input v-model="d" outlined label="Append icon"><template #append><q-icon name="event" /></template></q-input>
      <q-input v-model="e" outlined label="Append button"><template #after><q-btn round dense flat icon="send" /></template></q-input>
    </div>` }),
}

/** Validation — rules, error state. */
export const Validation = {
  render: () => ({ setup: () => ({ email: ref(''), req: ref('') }), template: `
    <div class="column q-gutter-md" style="max-width:340px">
      <q-input v-model="req" outlined label="Required *" :rules="[v => !!v || 'This field is required']" />
      <q-input v-model="email" outlined label="Email *" lazy-rules :rules="[v => /.+@.+\\..+/.test(v) || 'Enter a valid email']" />
      <q-input model-value="bad value" outlined label="Error state" error error-message="Something is wrong" />
    </div>` }),
}

/** Masks — date and phone. */
export const Masks = {
  render: () => ({ setup: () => ({ date: ref(''), phone: ref('') }), template: `
    <div class="column q-gutter-md" style="max-width:340px">
      <q-input v-model="date" outlined label="Date" mask="##/##/####" hint="MM/DD/YYYY" />
      <q-input v-model="phone" outlined label="Phone" mask="(###) ###-####" />
    </div>` }),
}

/** States — disable, readonly, dense, rounded. */
export const States = {
  render: () => ({ setup: () => ({ a: ref('') }), template: `
    <div class="column q-gutter-md" style="max-width:340px">
      <q-input model-value="Disabled" outlined label="Disabled" disable />
      <q-input model-value="Read only" outlined label="Read only" readonly />
      <q-input v-model="a" outlined dense label="Dense" />
      <q-input v-model="a" outlined rounded label="Rounded" />
    </div>` }),
}

/** Pickers — date & time in an outlined field via popup. */
export const Pickers = {
  render: () => ({ setup: () => ({ date: ref('2026/06/02'), time: ref('15:00') }), template: `
    <div class="column q-gutter-md" style="max-width:340px">
      <q-input v-model="date" outlined label="Check-in date">
        <template #append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="date" color="primary"><div class="row items-center justify-end"><q-btn v-close-popup label="Close" color="primary" flat /></div></q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input v-model="time" outlined label="Arrival time">
        <template #append>
          <q-icon name="schedule" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="time" color="primary"><div class="row items-center justify-end"><q-btn v-close-popup label="Close" color="primary" flat /></div></q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>` }),
}

/** FEEDBACK / Backdrop → Quasar: Loading plugin / QInnerLoading (composable: useBackdrop) */
import { useQuasar } from 'quasar'
import { ref } from 'vue'
export default {
  title: 'Components/Actions/Backdrop',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Dims the UI behind an overlay to block interaction during a critical wait.

## When to use
- Blocking operations (processing a payment, finalizing an order).

## When not to use
- Non-blocking waits → **Progress**/**Skeleton**.

## Quasar mapping
\`Backdrop → Loading plugin\` (global) or \`QInnerLoading\` (scoped). Wrap as \`useBackdrop()\`.
Loading plugin is registered in \`.storybook/preview.js\`.
` } } },
}
export const GlobalLoading = {
  render: () => ({
    setup() {
      const $q = useQuasar()
      const show = () => { $q.loading.show({ message: 'Processing payment…' }); setTimeout(() => $q.loading.hide(), 1800) }
      return { show }
    },
    template: `<q-btn color="primary" label="Show full-screen backdrop" @click="show" />`,
  }),
}
export const ScopedInner = {
  render: () => ({ setup: () => ({ loading: ref(true) }), template: `
    <q-card style="max-width:320px;min-height:160px" class="flex flex-center">
      <div class="text-grey">Card content</div>
      <q-inner-loading :showing="loading" color="primary" label="Loading…" />
      <q-btn class="absolute-bottom q-ma-sm" dense flat label="Toggle" @click="loading=!loading" />
    </q-card>` }),
}

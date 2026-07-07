// FEEDBACK / Modal — DsModal, the canonical centered dialog shell.
import { ref } from 'vue'
import DsModal from '../../components/DsModal.vue'

export default {
  title: 'Components/Actions/Modal',
  component: DsModal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
## Overview
**DsModal** is the design system's centered modal/dialog shell. It owns the
parts every dialog repeats — a fixed backdrop, a centered surface card,
ESC-to-close, click-outside-to-close, body scroll-lock, a header with a close
button, and a full-screen collapse on mobile — so feature dialogs only describe
their content. It teleports to \`<body>\`, so it's immune to parent stacking
contexts.

Adopted by **AvailabilityDialog**, **AllFiltersDialog**, and the **Hotel Map →
Map Dialog** pattern.

**Props:** \`modelValue\` (v-model), \`title\`, \`subtitle\`, \`size\`
(\`sm | md | lg | xl | fullscreen\`), \`headerAlign\` (\`left | center\`),
\`persistent\`, \`flush\`, \`hideHeader\`, \`hideClose\`, \`zIndex\`.
**Slots:** default (body), \`#header\` (replace the title block), \`#footer\`
(sticky footer bar; receives \`{ close }\`).
` } } },
}

const trigger = `
  <button type="button" @click="open = true" style="display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--ds-color-border-bold);border-radius:10px;background:var(--ds-color-surface);color:var(--ds-color-text);font-weight:600;cursor:pointer;font-family:inherit">Open modal</button>`

const frame = (inner) => `<div style="min-height:100vh;background:var(--ds-palette-neutral-100);padding:40px">${trigger}${inner}</div>`

/** Basic modal — title + body, default `md` size. */
export const Default = {
  render: () => ({
    components: { DsModal },
    setup: () => ({ open: ref(true) }),
    template: frame(`
      <ds-modal v-model="open" title="Cancel reservation?" size="sm">
        <p style="margin:0;color:var(--ds-color-text-subtle);line-height:1.5">This frees the held rooms back into inventory. You can rebook later, but the current rate isn't guaranteed.</p>
      </ds-modal>`),
  }),
}

/** With a sticky footer — the `#footer` slot receives `{ close }` so actions can
 *  dismiss the modal without wiring their own state. */
export const WithFooter = {
  render: () => ({
    components: { DsModal },
    setup: () => ({ open: ref(true) }),
    template: frame(`
      <ds-modal v-model="open" title="Filters" header-align="center" size="md">
        <p style="margin:0 0 12px;color:var(--ds-color-text-subtle);line-height:1.5">Body content scrolls; the header and footer stay pinned.</p>
        <div v-for="n in 8" :key="n" style="padding:16px 0;border-top:1px solid var(--ds-color-border);color:var(--ds-color-text)">Filter section {{ n }}</div>
        <template #footer="{ close }">
          <button type="button" @click="close" style="background:none;border:0;font:inherit;font-weight:700;text-decoration:underline;text-underline-offset:3px;color:var(--ds-color-text);cursor:pointer">Clear all</button>
          <button type="button" @click="close" style="height:48px;padding:0 24px;border:0;border-radius:var(--ds-radius-md);background:var(--ds-color-background-brand-bold);color:#fff;font:inherit;font-weight:600;cursor:pointer">Show 248 results</button>
        </template>
      </ds-modal>`),
  }),
}

/** `size="lg"` with a subtitle in the header. */
export const LargeWithSubtitle = {
  render: () => ({
    components: { DsModal },
    setup: () => ({ open: ref(true) }),
    template: frame(`
      <ds-modal v-model="open" title="Availability" subtitle="Hilton Orlando · 4 room types" size="lg">
        <div style="height:320px;display:flex;align-items:center;justify-content:center;color:var(--ds-color-text-subtle);border:1px dashed var(--ds-color-border);border-radius:var(--ds-radius-md)">Wide content area</div>
      </ds-modal>`),
  }),
}

/** `persistent` — backdrop click and ESC are ignored; the user must use an
 *  explicit control to dismiss. */
export const Persistent = {
  render: () => ({
    components: { DsModal },
    setup: () => ({ open: ref(true) }),
    template: frame(`
      <ds-modal v-model="open" title="Processing payment…" size="sm" persistent>
        <p style="margin:0;color:var(--ds-color-text-subtle);line-height:1.5">Backdrop and ESC are disabled while this is open. Provide an explicit action to close it.</p>
        <button type="button" @click="open = false" style="margin-top:16px;height:44px;padding:0 20px;border:0;border-radius:var(--ds-radius-md);background:var(--ds-color-background-brand-bold);color:#fff;font:inherit;font-weight:600;cursor:pointer">Done</button>
      </ds-modal>`),
  }),
}

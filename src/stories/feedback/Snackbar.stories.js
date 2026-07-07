import { useQuasar } from 'quasar'

/**
 * FEEDBACK / Snackbar  →  Quasar: Notify plugin  (imperative, not a component)
 *
 * Requires the Notify plugin registered as an app-level provider:
 *   app.use(Quasar, { plugins: { Notify } })   // see .storybook/preview.js
 * Call via const $q = useQuasar(); $q.notify({ ... })
 */
const meta = {
  title: 'Components/Feedback & Status/Snackbar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview
**Snackbar** shows a brief, non-blocking message about an app process —
usually after an action (saved, deleted, error). In Quasar this is the
**Notify plugin**, called imperatively rather than rendered as a component.

## Setup (app-level provider — required)
\`\`\`js
import { Quasar, Notify } from 'quasar'
app.use(Quasar, { plugins: { Notify } })
\`\`\`
Already wired in \`.storybook/preview.js\`.

## Usage
\`\`\`js
import { useQuasar } from 'quasar'
const $q = useQuasar()
$q.notify({ type: 'positive', message: 'Saved', position: 'top' })
\`\`\`

| Option | Notes |
| --- | --- |
| \`type\` | \`positive\` / \`negative\` / \`warning\` / \`info\` / \`ongoing\` |
| \`message\` / \`caption\` | Title and secondary line |
| \`position\` | \`top\`, \`bottom\`, \`top-right\`, … |
| \`timeout\` | ms; \`0\` = sticky until dismissed |
| \`actions\` | Buttons, e.g. an Undo handler or \`{ icon: 'close' }\` |
| \`progress\` | Show a timeout progress bar |

## UX guidance
- Keep messages short and action-oriented ("Project deleted").
- Offer **Undo** for destructive actions instead of a confirm dialog when possible.
- Use \`negative\` for failures and let them linger (longer/no timeout).
- One snackbar at a time per outcome — don't stack duplicates.

## Do / Don't
- ✅ Confirm successful actions briefly.
- ✅ Provide Undo where reversible.
- ❌ Don't put critical, must-read info only in a snackbar (it auto-dismisses).
- ❌ Don't use for validation errors tied to a field — show inline instead.

## Quasar mapping
\`Snackbar → Notify plugin\` (imperative). Not a component — no QSnackbar exists.
`,
      },
    },
  },
}
export default meta

/** Basic example — a neutral snackbar using the DS style. */
export const Basic = {
  render: () => ({
    setup() {
      const $q = useQuasar()
      const notify = () => $q.notify({ message: 'This is a snackbar', classes: 'ds-toast ds-toast--default', position: 'top' })
      return { notify }
    },
    template: `<q-btn unelevated no-caps color="primary" label="Show snackbar" @click="notify" />`,
  }),
}

/** Semantic states — the shared DS hue convention (same as Alert & Toast). */
export const Types = {
  render: () => ({
    setup() {
      const $q = useQuasar()
      const fire = (variant, message, icon) => $q.notify({ message, icon, classes: `ds-toast ds-toast--${variant}`, position: 'top' })
      return { fire }
    },
    template: `
      <div class="q-gutter-sm">
        <q-btn unelevated no-caps color="primary" label="Success" @click="fire('success','Saved successfully','check_circle')" />
        <q-btn unelevated no-caps color="primary" label="Info" @click="fire('info','Heads up','info')" />
        <q-btn unelevated no-caps color="primary" label="Warning" @click="fire('warning','Check your input','warning')" />
        <q-btn unelevated no-caps color="primary" label="Error" @click="fire('error','Something went wrong','error')" />
      </div>`,
  }),
}

/** Variants — with an Undo action, and a sticky message with progress. */
export const Variants = {
  render: () => ({
    setup() {
      const $q = useQuasar()
      const undo = () =>
        $q.notify({
          message: 'Item deleted',
          color: 'dark',
          position: 'bottom',
          timeout: 4000,
          progress: true,
          actions: [{ label: 'Undo', color: 'yellow', handler: () => {} }],
        })
      const sticky = () =>
        $q.notify({
          type: 'ongoing',
          message: 'Uploading… (sticky)',
          position: 'top',
          timeout: 0,
          actions: [{ icon: 'close', color: 'white', round: true, handler: () => {} }],
        })
      return { undo, sticky }
    },
    template: `
      <div class="q-gutter-sm">
        <q-btn color="primary" label="With Undo" @click="undo" />
        <q-btn outline color="primary" label="Sticky + dismiss" @click="sticky" />
      </div>`,
  }),
}

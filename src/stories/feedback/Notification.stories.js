// FEEDBACK / Notification — DsNotification.vue. A rich notification "card"
// (featured icon + title + description + actions + close) in the Untitled-UI mold.
// Use inline for stacked notification lists / in-page callouts, or as the content
// of a floating toast. For brief imperative confirmations, see Toast (Quasar Notify).
import { ref } from 'vue'
import DsNotification from '../../components/DsNotification.vue'

export default {
  title: 'Components/Feedback & Status/Notification',
  component: DsNotification,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'success', 'info', 'warning', 'error'] },
    title: { control: 'text' },
    description: { control: 'text' },
    icon: { control: 'text' },
    featuredIcon: { control: 'boolean' },
    closable: { control: 'boolean' },
    flat: { control: 'boolean' },
  },
  args: {
    variant: 'success',
    title: 'Changes saved',
    description: 'Your booking site customizations are now live for attendees.',
    featuredIcon: true,
    closable: true,
    flat: false,
  },
  parameters: { docs: { description: { component: `
## Overview
A **Notification** is a richer sibling of the [Toast](?path=/docs/components-feedback-status-toast--docs):
a card with a **featured icon**, a **title**, supporting **description** text, an
optional row of **actions**, and a **close** button — the Untitled-UI notification
pattern. Reach for it when a plain one-line toast isn't enough.

## Usage
\`\`\`vue
<ds-notification
  variant="success"
  title="Changes saved"
  description="Your booking site customizations are now live."
  @close="dismiss"
>
  <template #actions>
    <q-btn flat no-caps dense color="primary" label="View site" />
    <q-btn flat no-caps dense color="grey-7" label="Dismiss" @click="dismiss" />
  </template>
</ds-notification>
\`\`\`

## When to use which
| Need | Use |
| --- | --- |
| One-line, auto-dismiss confirmation | **Toast** (Quasar Notify) |
| Title + description + actions | **Notification** (this) |
| Persistent, full-width page-level message | **Banner** |

## Variants
\`default\` · \`success\` · \`info\` · \`warning\` · \`error\` — tinted with the same
semantic DS tokens as Alerts and Toast.
` } } },
}

/** Interactive — drive it from the Controls panel. */
export const Playground = {
  render: (args) => ({
    components: { DsNotification },
    setup: () => ({ args }),
    template: `
      <div style="padding:24px; max-width:480px;">
        <ds-notification v-bind="args">
          <template #actions>
            <q-btn flat no-caps dense color="primary" label="View site" />
            <q-btn flat no-caps dense color="grey-7" label="Dismiss" />
          </template>
        </ds-notification>
      </div>`,
  }),
}

/** All five color variants, stacked. */
export const Variants = {
  render: () => ({
    components: { DsNotification },
    setup: () => ({
      items: [
        { variant: 'default', title: 'Heads up', description: 'Here’s a quick update about your event.' },
        { variant: 'success', title: 'Changes saved', description: 'Your customizations are now live for attendees.' },
        { variant: 'info', title: 'New rates available', description: 'Fresh room rates were found for your dates.' },
        { variant: 'warning', title: 'Double-check your details', description: 'Some fields look incomplete before publishing.' },
        { variant: 'error', title: 'Couldn’t save changes', description: 'Something went wrong. Please try again.' },
      ],
    }),
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; padding:24px; max-width:480px;">
        <ds-notification v-for="i in items" :key="i.variant" v-bind="i" />
      </div>`,
  }),
}

/** With an action row (Untitled-UI "with buttons" pattern). */
export const WithActions = {
  render: () => ({
    components: { DsNotification },
    template: `
      <div style="padding:24px; max-width:480px;">
        <ds-notification variant="default" icon="delete_outline"
          title="Display Image 2 deleted"
          description="“landing-display-2.png” and its redirect URL were removed from your booking site.">
          <template #actions>
            <q-btn flat no-caps dense color="primary" label="Undo" />
            <q-btn flat no-caps dense color="grey-7" label="Dismiss" />
          </template>
        </ds-notification>
      </div>`,
  }),
}

/** Title only / description only / no featured icon — minimal configurations. */
export const Minimal = {
  render: () => ({
    components: { DsNotification },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; padding:24px; max-width:480px;">
        <ds-notification variant="success" title="Saved" :featured-icon="false" description="" />
        <ds-notification variant="info" title="" description="Just so you know — rates refresh every hour." />
        <ds-notification variant="default" title="Flat, embedded style" description="No shadow — for placing inside an already-bordered surface." flat :closable="false" />
      </div>`,
  }),
}

/** As a floating toast — the DsNotification card rendered in a fixed bottom-right
 *  stack, each auto-dismissing after a timeout. (Quasar Notify only renders text/
 *  HTML, so to float an actual component we teleport it ourselves.) */
export const AsToast = {
  render: () => ({
    components: { DsNotification },
    setup() {
      const toasts = ref([])
      let seq = 0
      const dismiss = (id) => { toasts.value = toasts.value.filter((t) => t.id !== id) }
      const fire = (opts) => {
        const id = ++seq
        toasts.value.push({ id, ...opts })
        setTimeout(() => dismiss(id), opts.timeout || 6000)
      }
      const fireDelete = () => fire({
        variant: 'default', icon: 'delete_outline', title: 'Display Image 2 deleted',
        description: '“landing-display-2.png” and its redirect URL were removed.', undo: true,
      })
      return { toasts, dismiss, fire, fireDelete }
    },
    template: `
      <div style="padding:24px; display:flex; gap:12px; flex-wrap:wrap;">
        <q-btn unelevated no-caps color="primary" label="Success toast"
          @click="fire({ variant:'success', title:'Changes saved', description:'Your customizations are now live.' })" />
        <q-btn unelevated no-caps color="primary" label="Info toast"
          @click="fire({ variant:'info', title:'New rates available', description:'Fresh room rates were found for your dates.' })" />
        <q-btn outline no-caps color="negative" label="Delete toast (with Undo)" @click="fireDelete" />

        <teleport to="body">
          <div style="position:fixed; right:24px; bottom:24px; z-index:9999; display:flex; flex-direction:column; gap:12px;">
            <ds-notification v-for="t in toasts" :key="t.id"
              :variant="t.variant" :icon="t.icon" :title="t.title" :description="t.description"
              @close="dismiss(t.id)">
              <template v-if="t.undo" #actions>
                <q-btn flat no-caps dense color="primary" label="Undo" @click="dismiss(t.id)" />
              </template>
            </ds-notification>
          </div>
        </teleport>
      </div>`,
  }),
}

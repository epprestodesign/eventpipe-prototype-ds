/** DES-207 / Components / Notification Row → DsListItem + Checkbox + actions (library only). */
import { ref } from 'vue'
import DsListItem from '../../components/DsListItem.vue'

export default {
  title: 'Design Requests/🟢 DES-207 Communications | Email Template Editor/Components/Notification Row',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'A single notification-template row: **List Item** (title + wrapping description) with a trailing **Checkbox** (Send Email) plus an action — either an **Edit** button or a **vertical 3-dot menu**. Rows get generous internal padding (24px horizontal / ~20px vertical) via a per-row wrapper, so nothing sits on the edge.' } } },
}

const ROWS = [
  { title: 'STP - Welcome Email', desc: 'This email requests a pickup report.', send: true },
  { title: 'STP - Compliance Reminder - Early Stage', desc: 'This email reminds non-compliant teams about their STP requirement; the cadence and tone here are designed to be encouraging rather than punitive.', send: true },
  { title: 'STP - Previously Compliant Notice', desc: 'This email notifies a team that was previously meeting its Stay-to-Play requirement but has since fallen out of compliance — it summarizes the current shortfall, the criteria that must be met, and the deadline before penalties apply.', send: false },
]

/** Action = Edit button. Descriptions run 1 / 2 / 3 lines to prove wrapping + padding. */
export const WithEditButton = {
  render: () => ({
    components: { DsListItem },
    setup: () => ({ rows: ref(JSON.parse(JSON.stringify(ROWS))) }),
    template: `
      <div style="max-width:900px; border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg); overflow:hidden;">
        <template v-for="(r, i) in rows" :key="r.title">
          <q-separator v-if="i > 0" />
          <div style="padding:8px 28px;">
            <ds-list-item :title="r.title" :subtitle="r.desc" :bordered="false">
              <template #trailing>
                <div class="row items-center no-wrap q-gutter-xl">
                  <q-checkbox v-model="r.send" color="primary" />
                  <q-btn unelevated no-caps color="primary" label="Edit" />
                </div>
              </template>
            </ds-list-item>
          </div>
        </template>
      </div>`,
  }),
}

/** Action = vertical 3-dot (kebab) menu instead of the Edit button. */
export const WithKebabMenu = {
  render: () => ({
    components: { DsListItem },
    setup: () => ({ rows: ref(JSON.parse(JSON.stringify(ROWS))) }),
    template: `
      <div style="max-width:900px; border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg); overflow:hidden;">
        <template v-for="(r, i) in rows" :key="r.title">
          <q-separator v-if="i > 0" />
          <div style="padding:8px 28px;">
            <ds-list-item :title="r.title" :subtitle="r.desc" :bordered="false">
              <template #trailing>
                <div class="row items-center no-wrap q-gutter-lg">
                  <q-checkbox v-model="r.send" color="primary" />
                  <q-btn flat round dense icon="more_vert" color="grey-8">
                    <q-menu anchor="bottom right" self="top right">
                      <q-list style="min-width:180px">
                        <q-item clickable v-close-popup><q-item-section avatar><q-icon name="edit" /></q-item-section><q-item-section>Edit template</q-item-section></q-item>
                        <q-item clickable v-close-popup><q-item-section avatar><q-icon name="visibility" /></q-item-section><q-item-section>Preview</q-item-section></q-item>
                        <q-separator />
                        <q-item clickable v-close-popup><q-item-section avatar><q-icon name="undo" /></q-item-section><q-item-section>Revert to default</q-item-section></q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </template>
            </ds-list-item>
          </div>
        </template>
      </div>`,
  }),
}

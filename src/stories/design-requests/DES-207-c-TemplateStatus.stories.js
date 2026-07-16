/** DES-207 / Components / Template Status → default-vs-custom indicator options (library only). */
import DsListItem from '../../components/DsListItem.vue'

export default {
  title: 'Design Requests/DES-207 Communications | Email Template Editor/Components/Template Status',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'Five ways to show whether a row uses the **System Default** template or a **Custom** (edited) one. All composed from Badge / Button / Dropdown / Icon — pick one for the page.' } } },
}

const row = (title, statusRight) => `
  <div style="padding:10px 28px;">
    <ds-list-item title="${title}" subtitle="Reservation confirmation sent to the guest." :bordered="false">
      <template #trailing><div class="row items-center no-wrap q-gutter-md">${statusRight}</div></template>
    </ds-list-item>
  </div>`

export const Options = {
  render: () => ({
    components: { DsListItem },
    template: `
      <div class="column q-gutter-lg" style="max-width:900px;">

        <div>
          <div class="text-caption text-grey-7 q-mb-xs">Option A — Status badge next to Edit</div>
          <div style="border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg); overflow:hidden;">
            ${row('Reservation Confirmation', '<q-badge color="grey-4" text-color="dark" class="q-px-sm q-py-xs">System Default</q-badge><q-btn unelevated no-caps color="primary" label="Edit" />')}
            <q-separator />
            ${row('Hotel Confirmation', '<q-badge color="primary" class="q-px-sm q-py-xs">Custom</q-badge><q-btn unelevated no-caps color="primary" label="Edit" />')}
          </div>
        </div>

        <div>
          <div class="text-caption text-grey-7 q-mb-xs">Option B — Edit + Undo (revert) button when custom</div>
          <div style="border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg); overflow:hidden;">
            ${row('Reservation Confirmation', '<q-btn unelevated no-caps color="primary" label="Edit" />')}
            <q-separator />
            ${row('Hotel Confirmation', '<q-btn outline round dense color="primary" icon="undo"><q-tooltip>Revert to system default</q-tooltip></q-btn><q-btn unelevated no-caps color="primary" label="Edit" />')}
          </div>
        </div>

        <div>
          <div class="text-caption text-grey-7 q-mb-xs">Option C — Edit dropdown with "Revert to default"</div>
          <div style="border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg); overflow:hidden;">
            ${row('Hotel Confirmation', '<q-btn-dropdown split unelevated no-caps color="primary" label="Edit"><q-list><q-item clickable v-close-popup><q-item-section>Edit template</q-item-section></q-item><q-item clickable v-close-popup><q-item-section class="text-negative">Revert to default</q-item-section></q-item></q-list></q-btn-dropdown>')}
          </div>
        </div>

        <div>
          <div class="text-caption text-grey-7 q-mb-xs">Option D — Text label</div>
          <div style="border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg); overflow:hidden;">
            ${row('Reservation Confirmation', '<span class="text-grey-7">Using: <span class="text-weight-bold text-grey-9">System Default</span></span><q-btn unelevated no-caps color="primary" label="Edit" />')}
            <q-separator />
            ${row('Hotel Confirmation', '<span class="text-grey-7">Using: <span class="text-weight-bold text-primary">Custom</span></span><q-btn unelevated no-caps color="primary" label="Edit" />')}
          </div>
        </div>

        <div>
          <div class="text-caption text-grey-7 q-mb-xs">Option E — Status dot</div>
          <div style="border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg); overflow:hidden;">
            ${row('Reservation Confirmation', '<span class="row items-center q-gutter-xs text-grey-7"><q-icon name="circle" size="10px" color="grey-5" />Default</span><q-btn unelevated no-caps color="primary" label="Edit" />')}
            <q-separator />
            ${row('Hotel Confirmation', '<span class="row items-center q-gutter-xs text-grey-8"><q-icon name="circle" size="10px" color="primary" />Custom</span><q-btn unelevated no-caps color="primary" label="Edit" />')}
          </div>
        </div>

      </div>`,
  }),
}

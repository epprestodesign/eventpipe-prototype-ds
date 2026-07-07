/** BASE COMPONENTS / Dropdown → QBtnDropdown + QMenu (action/menu dropdown). */
export default {
  title: 'Components/Actions/Dropdown',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
A button that opens a menu of actions or options. Distinct from **Select** (a
form field): use Dropdown for *actions* (Edit ▾, More ▾), Select for *values*.
Split-button form matches the "Update Event ▾" CTA.
` } } },
}

export const Menu = {
  render: () => ({ template: `
    <q-btn-dropdown color="primary" no-caps label="Actions">
      <q-list>
        <q-item clickable v-close-popup><q-item-section avatar><q-icon name="edit" /></q-item-section><q-item-section>Edit</q-item-section></q-item>
        <q-item clickable v-close-popup><q-item-section avatar><q-icon name="content_copy" /></q-item-section><q-item-section>Duplicate</q-item-section></q-item>
        <q-separator />
        <q-item clickable v-close-popup class="text-negative"><q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section><q-item-section>Delete</q-item-section></q-item>
      </q-list>
    </q-btn-dropdown>` }),
}

export const SplitButton = {
  parameters: { docs: { description: { story: 'Primary action + a dropdown of alternates ("Update Event ▾").' } } },
  render: () => ({ template: `
    <q-btn-dropdown split color="primary" no-caps label="Update Event">
      <q-list>
        <q-item clickable v-close-popup><q-item-section>Update &amp; notify hotel</q-item-section></q-item>
        <q-item clickable v-close-popup><q-item-section>Update &amp; close</q-item-section></q-item>
        <q-item clickable v-close-popup><q-item-section>Save as draft</q-item-section></q-item>
      </q-list>
    </q-btn-dropdown>` }),
}

export const ContextMenu = {
  parameters: { docs: { description: { story: 'A bare icon trigger opening a QMenu (row overflow ⋯).' } } },
  render: () => ({ template: `
    <q-btn flat round dense icon="more_horiz">
      <q-menu anchor="bottom right" self="top right">
        <q-list style="min-width:160px">
          <q-item clickable v-close-popup><q-item-section>View</q-item-section></q-item>
          <q-item clickable v-close-popup><q-item-section>Edit</q-item-section></q-item>
          <q-item clickable v-close-popup class="text-negative"><q-item-section>Delete</q-item-section></q-item>
        </q-list>
      </q-menu>
    </q-btn>` }),
}

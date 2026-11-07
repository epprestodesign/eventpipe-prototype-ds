import StdAddUpdateTeamsButton from './components/StdAddUpdateTeamsButton.vue'
import { ticketDecorator, docText } from './_components'

export default {
  title: 'Design Requests/Single-Team Add and Delete/Components/Add-Update Teams Button',
  component: StdAddUpdateTeamsButton,
  tags: ['autodocs', 'STA-1', 'ENG2-111'],
  decorators: [ticketDecorator('STA-1')],
  parameters: { layout: 'padded', docs: { description: { component: docText('The Registration Data Uploader button relabeled **Add/Update Teams** with a dropdown arrow — the same pattern as Export. Options: **Upload registration data** (the current uploader, unchanged) and **Add single team**. No role gating.', 'STA-1') } } },
}

export const Default = {
  render: () => ({ components: { StdAddUpdateTeamsButton }, template: '<std-add-update-teams-button />' }),
}
/** Beside Export, as on the Compliance page. */
export const BesideExport = {
  name: 'Beside Export',
  render: () => ({
    components: { StdAddUpdateTeamsButton },
    template: `<div class="row q-gutter-sm">
      <q-btn-dropdown outline no-caps color="primary" label="Export" dropdown-icon="expand_more"><q-list><q-item clickable v-close-popup><q-item-section>Export to CSV</q-item-section></q-item></q-list></q-btn-dropdown>
      <std-add-update-teams-button />
    </div>`,
  }),
}

/** ACTIONS / Action Menu → DsActionMenu (QBtn + QMenu) */
import DsActionMenu from '../../components/DsActionMenu.vue'

export default {
  title: 'Components/Actions/Action Menu',
  component: DsActionMenu,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
The **⋮** overflow button and the menu of actions behind it — row actions in
tables, secondary actions in page headers.

## One size
Always **40×40**, the design system's standard control height, so it lines up
with the buttons beside it and is identical on every screen. There is
deliberately **no size prop**.

## Items
\`[{ label, icon?, danger?, disabled?, dividerBefore?, copy?, confirm? }]\`

- \`copy: 'TXN-2026-16006'\` copies the text and toasts "Copied …".
- \`confirm: { title, message, okLabel }\` asks first; the item is only selected
  on OK. Use it for anything destructive, together with \`danger: true\`
  (red label, red OK button) and usually \`dividerBefore: true\`.

Picking an item emits \`select(item)\` and dispatches a bubbling
\`ds-action-select\` DOM event, so a page can handle every menu on it in one place.

## Accessibility
Icon-only, so \`label\` is required ("Actions for TXN-2026-16006"). The button has
\`aria-haspopup="menu"\` and \`aria-expanded\`; the list is a \`menu\` of
\`menuitem\`s; arrow keys move, Enter picks, Escape closes and returns focus.
` } } },
}

const ROW_ITEMS = [
  { label: 'View details', icon: 'visibility' },
  { label: 'Copy transaction ID', icon: 'content_copy', copy: 'TXN-2026-16006' },
  { label: 'Download receipt', icon: 'receipt_long' },
  { label: 'Refund payment', icon: 'undo', danger: true, dividerBefore: true,
    confirm: { title: 'Refund $1,359.00?', message: 'Elena Fischer will be refunded to their Visa ending 8821. This can’t be undone.', okLabel: 'Refund' } },
]

/** A row's actions. Destructive items sit last, below a divider, in red, and confirm first. */
export const Default = {
  args: { label: 'Actions for TXN-2026-16006', items: ROW_ITEMS },
  render: (args) => ({ components: { DsActionMenu }, setup: () => ({ args }), template: '<ds-action-menu v-bind="args" />' }),
}

/** Next to 40px header buttons it is the same height — the reason it is 40×40. */
export const InPageHeader = {
  name: 'In a page header',
  render: () => ({
    components: { DsActionMenu },
    setup: () => ({ items: [
      { label: 'Duplicate invoice', icon: 'content_copy' },
      { label: 'Copy invoice number', icon: 'tag', copy: 'INV-2026-0406' },
      { label: 'Void invoice', icon: 'block', danger: true, dividerBefore: true,
        confirm: { title: 'Void INV-2026-0406?', message: 'The customer can no longer pay it. This can’t be undone.', okLabel: 'Void invoice' } },
    ] }),
    template: `
      <div style="display:flex; align-items:center; gap:10px;">
        <q-btn outline no-caps color="primary" icon="file_download" label="Download PDF" style="padding:0 16px;" />
        <q-btn outline no-caps color="primary" icon="notifications" label="Send Reminder" style="padding:0 16px;" />
        <ds-action-menu label="More invoice actions" :items="items" />
      </div>`,
  }),
}

/** In a dense table the button keeps its size — rows fit it, not the other way round. */
export const InATable = {
  name: 'In a table',
  render: () => ({
    components: { DsActionMenu },
    setup: () => ({
      rows: [
        { id: 'TXN-2026-16006', name: 'Elena Fischer', amount: '$1,359.00' },
        { id: 'TXN-2026-15993', name: 'Noah Klein', amount: '$730.00' },
        { id: 'TXN-2026-15980', name: 'Jordan Alvarez', amount: '$804.00' },
      ],
      columns: [
        { name: 'id', label: 'Transaction', field: 'id', align: 'left' },
        { name: 'name', label: 'Customer', field: 'name', align: 'left' },
        { name: 'amount', label: 'Amount', field: 'amount', align: 'right' },
        { name: 'actions', label: '', field: () => '', align: 'right', style: 'width:64px' },
      ],
      itemsFor: (id) => [
        { label: 'View details', icon: 'visibility' },
        { label: 'Copy transaction ID', icon: 'content_copy', copy: id },
        { label: 'Refund payment', icon: 'undo', danger: true, dividerBefore: true, confirm: { title: `Refund ${id}?`, okLabel: 'Refund' } },
      ],
    }),
    template: `
      <q-table class="ds-table" :rows="rows" :columns="columns" row-key="id" flat bordered hide-bottom style="max-width:720px;">
        <template #body-cell-actions="props">
          <q-td :props="props"><ds-action-menu :label="'Actions for ' + props.row.id" :items="itemsFor(props.row.id)" /></q-td>
        </template>
      </q-table>`,
  }),
}

/** Disabled items stay visible (so people learn the action exists) but can't be picked. */
export const WithDisabledItem = {
  name: 'With a disabled item',
  args: { label: 'Actions for DSP-52721', items: [
    { label: 'View dispute', icon: 'visibility' },
    { label: 'Submit evidence', icon: 'upload_file', disabled: true },
    { label: 'Accept dispute', icon: 'gavel', danger: true, dividerBefore: true, confirm: { title: 'Accept this dispute?', okLabel: 'Accept' } },
  ] },
  render: Default.render,
}

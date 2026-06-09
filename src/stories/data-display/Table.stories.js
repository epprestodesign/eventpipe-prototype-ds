/** DATA DISPLAY / Table → Quasar: QTable (native; wrap as PrestoTable later) */
import { ref } from 'vue'
const columns = [
  { name: 'guest', label: 'Guest', field: 'guest', align: 'left', sortable: true },
  { name: 'room', label: 'Room', field: 'room', align: 'left', sortable: true },
  { name: 'checkin', label: 'Check-in', field: 'checkin', align: 'left', sortable: true },
  { name: 'nights', label: 'Nights', field: 'nights', align: 'center', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'total', label: 'Total', field: 'total', align: 'right', sortable: true },
]
const rows = [
  { guest: 'Ada Lovelace', room: 'Deluxe King', checkin: 'Jun 2', nights: 4, status: 'Confirmed', total: '$756' },
  { guest: 'Alan Turing', room: 'Twin/Double', checkin: 'Jun 3', nights: 2, status: 'Confirmed', total: '$298' },
  { guest: 'Grace Hopper', room: 'Ocean Suite', checkin: 'Jun 5', nights: 3, status: 'Pending', total: '$987' },
  { guest: 'Katherine Johnson', room: 'Family Room', checkin: 'Jun 6', nights: 5, status: 'Cancelled', total: '$1,120' },
]
export default {
  title: 'Data Display/Table',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Tabular data with sorting, selection, and pagination. In a booking platform: the
reservations list for guests' trips and host/admin management.

## When to use
- Multi-column records that need scanning, sorting, or bulk actions (reservations).

## When not to use
- Simple single-column rows → **List**.

## Quasar mapping
\`Table → QTable\` (native). Recommended wrapper \`PrestoTable\`; advanced recipes in
**Patterns / Data Tables**.
` } } },
}
export const Basic = {
  render: () => ({ setup: () => ({ columns, rows }), template: `<q-table title="Reservations" :rows="rows" :columns="columns" row-key="guest" flat bordered style="max-width:760px" />` }),
}
export const WithStatusChips = {
  render: () => ({ setup: () => ({ columns, rows, selected: ref([]) }), template: `
    <q-table title="Reservations" :rows="rows" :columns="columns" row-key="guest" selection="multiple"
      v-model:selected="selected" flat bordered :pagination="{ rowsPerPage: 5 }" style="max-width:820px">
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-chip dense text-color="white"
            :color="props.value==='Confirmed'?'positive':props.value==='Pending'?'warning':'negative'">{{ props.value }}</q-chip>
        </q-td>
      </template>
    </q-table>` }),
}

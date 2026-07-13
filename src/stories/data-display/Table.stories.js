/** DATA DISPLAY / Table → Quasar: QTable (native; wrap as EpTable later) */
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
  title: 'Components/Layout & Structure/Table',
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
\`Table → QTable\` (native). Recommended wrapper \`EpTable\`; advanced recipes in
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

/** EventPipe data table — brand-blue header, row selection, zebra rows
 *  (the "Select Reservations to Move" table). Apply `class="ds-table"`. */
const epColumns = [
  { name: 'guest', label: 'Guest Name', field: 'guest', align: 'left' },
  { name: 'hotel', label: 'Hotel', field: 'hotel', align: 'left' },
  { name: 'pipe', label: 'Pipe ID', field: 'pipe', align: 'left' },
  { name: 'block', label: 'Group Block ID', field: 'block', align: 'left' },
  { name: 'team', label: 'Team', field: 'team', align: 'left' },
  { name: 'org', label: 'Organization', field: 'org', align: 'left' },
  { name: 'checkin', label: 'Check In', field: 'checkin', align: 'left' },
  { name: 'nights', label: 'Nights', field: 'nights', align: 'left' },
]
const epRows = [
  { guest: 'John Smith', hotel: 'The Summit Lodge Denver.', pipe: 'R-01337893', block: 'G-00081615', team: 'Engineering', org: 'Acme Corp', checkin: 'Thu, 05/01/2025', nights: 3 },
  { guest: 'Emily Johnson', hotel: 'Pinnacle Hotel Denver.', pipe: 'R-01337912', block: 'G-00081623', team: 'Product', org: 'Acme Corp', checkin: 'Fri, 05/02/2025', nights: 2 },
  { guest: 'Michael Brown', hotel: 'Mountain View Inn Denver.', pipe: 'R-01337925', block: 'G-00081634', team: 'Product', org: 'Acme Corp', checkin: 'Sat, 05/03/2025', nights: 2 },
  { guest: 'Sarah Davis', hotel: 'Skyline Suites Denver.', pipe: 'R-01337941', block: 'G-00081645', team: 'Product', org: 'Acme Corp', checkin: 'Sun, 05/04/2025', nights: 3 },
  { guest: 'David Wilson', hotel: 'Alpine Retreat Denver.', pipe: 'R-01337956', block: 'G-00081652', team: 'Engineering', org: 'Acme Corp', checkin: 'Mon, 05/05/2025', nights: 1 },
  { guest: 'Ashley Martinez', hotel: 'Canyon Crest Hotel Denver.', pipe: 'R-01337968', block: 'G-00081667', team: 'Engineering', org: 'Acme Corp', checkin: 'Tue, 05/06/2025', nights: 1 },
]
export const EventPipe = {
  parameters: { docs: { description: { story: 'Brand-blue header + row selection + zebra rows via `class="ds-table"`.' } } },
  render: () => ({ setup: () => ({ epColumns, epRows, selected: ref([epRows[0], epRows[1]]) }), template: `
    <q-table class="ds-table" :rows="epRows" :columns="epColumns" row-key="pipe" selection="multiple"
      v-model:selected="selected" flat hide-bottom :pagination="{ rowsPerPage: 0 }" />` }),
}

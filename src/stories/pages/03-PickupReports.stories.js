/** PAGES / 03 Pickup Reports → table list archetype, recreated from production. */
import { ref } from 'vue'
import { page } from './_shell'
import DsPageToolbar from '../../components/DsPageToolbar.vue'
import DsStatus from '../../components/DsStatus.vue'

export default { title: 'Pages/03 Pickup Reports', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

const columns = [
  { name: 'hotel', label: 'Hotel Name', field: 'hotel', align: 'left', sortable: true },
  { name: 'event', label: 'Event Name', field: 'event', align: 'left', sortable: true },
  { name: 'status', label: 'Pickup Report Status', field: 'status', align: 'left', sortable: true },
  { name: 'endDate', label: 'Event End Date', field: 'endDate', align: 'left', sortable: true },
  { name: 'invoice', label: 'Invoice #', field: 'invoice', align: 'left', sortable: true },
  { name: 'currency', label: 'Currency', field: 'currency', align: 'left', sortable: true },
  { name: 'amount', label: 'Total Amount Earned', field: 'amount', align: 'left', sortable: true },
]
const rows = [
  { hotel: 'Hilton Garden Inn Portland Airport', event: 'AT | Bend FC Clash of the Boarder 6/26-28 | Jessica - Hilton Garden Inn Portland Airport', status: 'Approved', endDate: 'Sun, 06/28/2026', invoice: '', currency: 'USD', amount: '$ 479.78' },
  { hotel: 'Fairfield Inn & Suites Portland Airport', event: 'AT | Bend FC Clash of the Boarder 6/26-28 | Jessica - Fairfield Inn & Suites Portland Airport', status: 'Approved', endDate: 'Sun, 06/28/2026', invoice: '', currency: 'USD', amount: '$ 582.05' },
  { hotel: 'DoubleTree by Hilton Hotel Vancouver', event: 'AT | Bend FC Clash of the Boarder 6/26-28 | Jessica - DoubleTree by Hilton Hotel Vancouver', status: 'Approved', endDate: 'Sun, 06/28/2026', invoice: '', currency: 'USD', amount: '$ 925.00' },
  { hotel: 'Courtyard by Marriott Portland Airport', event: 'AT | Bend FC Clash of the Boarder 6/26-28 | Jessica - Courtyard by Marriott Portland Airport', status: 'Approved', endDate: 'Sun, 06/28/2026', invoice: '', currency: 'USD', amount: '$ 469.35' },
  { hotel: 'Best Western Plus Vancouver Mall Dr. Hotel & Suites', event: 'AT | Bend FC Clash of the Boarder 6/26-28 | Jessica - Best Western Plus Vancouver Mall Dr. Hotel & Suites', status: 'Approved', endDate: 'Sun, 06/28/2026', invoice: '', currency: 'USD', amount: '$ 706.40' },
  { hotel: 'La Quinta Inn & Suites by Wyndham Salem OR', event: 'AT | Bend FC Capitol Cup - 6/26-28 | Jessica - La Quinta Inn & Suites by Wyndham Salem OR', status: 'Approved', endDate: 'Sun, 06/28/2026', invoice: '', currency: 'USD', amount: '$ 109.50' },
  { hotel: 'Home2 Suites by Hilton Salem', event: 'AT | Bend FC Capitol Cup - 6/26-28 | Jessica - Home2 Suites by Hilton Salem', status: 'Approved', endDate: 'Sun, 06/28/2026', invoice: '', currency: 'USD', amount: '$ 471.24' },
  { hotel: 'Hampton Inn & Suites Salem, OR', event: 'AT | Bend FC Capitol Cup - 6/26-28 | Jessica - Hampton Inn & Suites Salem, OR', status: 'Approved', endDate: 'Sun, 06/28/2026', invoice: '', currency: 'USD', amount: '$ 304.92' },
  { hotel: 'Courtyard Raleigh North / Triangle Town Center', event: 'Carolina Clash 2026', status: 'Approved', endDate: 'Sun, 06/21/2026', invoice: '', currency: 'USD', amount: '$ 1,236.80' },
  { hotel: 'Renaissance Hotels Raleigh North Hills', event: 'Carolina Clash 2026', status: 'Approved', endDate: 'Sun, 06/21/2026', invoice: '', currency: 'USD', amount: '$ 1,177.26' },
  { hotel: 'Hampton Inn Raleigh-Capital Blvd. North', event: 'Carolina Clash 2026', status: 'Sent', endDate: 'Sun, 06/21/2026', invoice: '', currency: 'USD', amount: '$ 0.00' },
  { hotel: 'Hilton Garden Inn Raleigh/Crabtree Valley', event: 'Carolina Clash 2026', status: 'Approved', endDate: 'Sun, 06/21/2026', invoice: '', currency: 'USD', amount: '$ 95.32' },
  { hotel: 'Fairfield Inn & Suites Raleigh Capital Blvd./I-540', event: 'Carolina Clash 2026', status: 'Approved', endDate: 'Sun, 06/21/2026', invoice: '', currency: 'USD', amount: '$ 714.90' },
  { hotel: 'Home2 Suites by Hilton Raleigh North I-540', event: 'Carolina Clash 2026', status: 'Sent', endDate: 'Sun, 06/21/2026', invoice: '', currency: 'USD', amount: '$ 0.00' },
  { hotel: 'Hampton Inn & Suites Raleigh Midtown', event: 'Carolina Clash 2026', status: 'Approved', endDate: 'Sun, 06/21/2026', invoice: '', currency: 'USD', amount: '$ 140.88' },
  { hotel: 'Marriott Raleigh Crabtree Valley', event: 'Carolina Clash 2026', status: 'Approved', endDate: 'Sun, 06/21/2026', invoice: '', currency: 'USD', amount: '$ 1,213.05' },
  { hotel: 'Hilton Garden Inn Raleigh Capital Blvd I-540', event: 'Carolina Clash 2026', status: 'Approved', endDate: 'Sun, 06/21/2026', invoice: '', currency: 'USD', amount: '$ 543.86' },
  { hotel: 'DoubleTree Raleigh Midtown', event: 'Carolina Clash 2026', status: 'Approved', endDate: 'Sun, 06/21/2026', invoice: '', currency: 'USD', amount: '$ 471.03' },
  { hotel: 'Courtyard Raleigh Midtown', event: 'Carolina Clash 2026', status: 'Approved', endDate: 'Sun, 06/21/2026', invoice: '', currency: 'USD', amount: '$ 182.24' },
]

export const PickupReports = page({
  active: 'pickup',
  components: { DsPageToolbar, DsStatus },
  setup: () => ({ columns, rows, filter: ref('Mon, 07/07/2025 - Tue, 07/07/2026') }),
  slot: `
    <div style="padding:24px 28px 0; background:var(--ds-color-surface);">
      <ds-page-toolbar title="Pickup Reports">
        <template #search>
          <q-input outlined dense placeholder="Search" style="max-width:520px" hide-bottom-space>
            <template #append><q-icon name="search" /></template>
          </q-input>
        </template>
        <template #actions>
          <q-btn outline no-caps color="primary" label="Filter" />
          <q-btn outline no-caps color="primary" label="Export" />
        </template>
        <template #filters>
          <span class="text-grey-7">Filtered by:</span>
          <q-chip removable dense color="grey-3" text-color="dark">{{ filter }}</q-chip>
        </template>
      </ds-page-toolbar>
    </div>

    <div style="padding:20px 28px 28px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <q-table class="ds-table" :rows="rows" :columns="columns" row-key="hotel" flat hide-bottom :pagination="{ rowsPerPage: 0 }">
        <template #body-cell-hotel="props">
          <q-td :props="props"><a href="#" class="text-primary" style="text-decoration:none; font-weight:700;" @click.prevent>{{ props.value }}</a></q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props"><ds-status :label="props.value" :tone="props.value === 'Sent' ? 'info' : ''" /></q-td>
        </template>
      </q-table>
    </div>`,
})

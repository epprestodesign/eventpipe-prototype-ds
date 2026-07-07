/** PAGES / 08 Room Types → table list archetype, recreated from production. */
import { ref } from 'vue'
import { page } from './_shell'
import DsPageToolbar from '../../components/DsPageToolbar.vue'

export default { title: 'Pages/08 Room Types', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

const columns = [
  { name: 'status', label: '', field: 'status', align: 'center' },
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'description', label: 'Description', field: 'description', align: 'left', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

const names = [
  'Double Bed with Double Sleeper Sofa',
  'Double Bed with Full Sleeper Sofa',
  'Double Bed',
  'Two Double Beds with Full Sleeper Sofa',
  'Two Double Beds',
  'Three Double Beds',
  'Four Double Beds',
  'Full Bed',
  'Two Full Beds with Full Sleeper Sofa',
  'Two Full Beds',
  'King Bed and Double Bed',
  'King Bed and Two Double Beds',
  'King Bed and Double Bed with Full Sleeper Sofa',
  'King Bed and Queen Bed with Full Sleeper Sofa',
  'King Bed',
  'King Bed and Two Double Beds with Queen Sleeper Sofa',
  'King Bed with Queen Sleeper Sofa',
  'King Bed with Single Sleeper Sofa',
  'King Bed and Queen Bed',
  'King Bed and Two Queen Beds',
]
const rows = names.map((name) => ({ name, description: `This ${name} room is a great choice for your stay.` }))

export const RoomTypes = page({
  active: 'room-types',
  components: { DsPageToolbar },
  setup: () => ({ columns, rows, pageNo: ref(2) }),
  slot: `
    <div style="padding:24px 28px 0; background:var(--ds-color-surface);">
      <ds-page-toolbar title="Room Types" :count="860">
        <template #search>
          <q-input outlined dense placeholder="Search" style="max-width:520px" hide-bottom-space>
            <template #append><q-icon name="search" /></template>
          </q-input>
        </template>
        <template #actions>
          <q-btn unelevated no-caps color="primary" label="New Room Type" />
        </template>
      </ds-page-toolbar>
    </div>

    <div style="padding:20px 28px 28px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <q-table class="ds-table" :rows="rows" :columns="columns" row-key="name" flat hide-bottom :pagination="{ rowsPerPage: 0 }">
        <template #body-cell-status="props">
          <q-td :props="props">
            <span style="display:inline-block; width:9px; height:9px; border-radius:50%; background:var(--ds-color-background-success-bold);"></span>
          </q-td>
        </template>
        <template #body-cell-name="props">
          <q-td :props="props"><a href="#" class="text-primary" style="text-decoration:none; font-weight:700;" @click.prevent>{{ props.value }}</a></q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <div class="row items-center justify-end no-wrap q-gutter-sm">
              <q-btn outline no-caps dense color="primary" label="See More" padding="4px 12px" />
              <q-btn flat round dense icon="more_horiz" color="grey-7" />
            </div>
          </q-td>
        </template>
      </q-table>
      <div class="flex flex-center q-mt-lg">
        <q-pagination v-model="pageNo" :max="43" direction-links boundary-links :max-pages="7" color="primary" />
      </div>
    </div>`,
})

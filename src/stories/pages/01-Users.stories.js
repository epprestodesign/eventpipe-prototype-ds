/** PAGES / 01 Users → table list archetype, recreated from production. */
import { ref } from 'vue'
import { page } from './_shell'
import DsPageToolbar from '../../components/DsPageToolbar.vue'
import DsStatus from '../../components/DsStatus.vue'

export default { title: 'Pages/01 Users', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

const columns = [
  { name: 'name', label: 'User Name', field: 'name', align: 'left', sortable: true },
  { name: 'title', label: 'Job Title', field: 'title', align: 'left', sortable: true },
  { name: 'email', label: 'Email Address', field: 'email', align: 'left', sortable: true },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' },
  { name: 'type', label: 'User Type', field: 'type', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]
const rows = [
  { name: 'Alice Kiangoi', title: '-', email: 'alice@eventpipe.com', phone: '(111) 111-1111', type: 'EP Admin', status: 'Active' },
  { name: 'Amber Gray', title: 'Accounting', email: 'amber@eventpipe.com', phone: '(111) 111-1111', type: 'EP Admin', status: 'Invitation Expired' },
  { name: 'Andrew Wallace', title: 'CSM', email: 'andrew.wallace@eventpipe.com', phone: '(111) 111-1111', type: 'EP Admin', status: 'Active' },
  { name: 'Ben Lancaster', title: 'Sales', email: 'ben@eventpipe.com', phone: '(111) 111-1111', type: 'EP Admin', status: 'Active' },
  { name: 'Beverly Driscoll', title: 'EventPipe', email: 'beverly@eventpipe.com', phone: '(111) 111-1111', type: 'EP Admin', status: 'Active' },
  { name: 'Brandon Hollmann', title: 'SVP', email: 'brandon@eventpipe.com', phone: '(512) 468-3632', type: 'EP Admin', status: 'Active' },
  { name: 'Charlie Addesa', title: 'Intern', email: 'charlie@eventpipe.com', phone: '(999) 888-7777', type: 'EP Admin', status: 'Active' },
  { name: 'Christina Grimes', title: 'Customer Success Specialist', email: 'christina@eventpipe.com', phone: '(111) 111-1111', type: 'EP Admin', status: 'Active' },
]

export const Users = page({
  active: 'users',
  components: { DsPageToolbar, DsStatus },
  setup: () => ({ columns, rows, tab: ref('ep'), pageNo: ref(1) }),
  slot: `
    <div style="padding:24px 28px 0; background:var(--ds-color-surface);">
      <ds-page-toolbar title="Ep Users" :count="20">
        <template #search>
          <q-input outlined dense placeholder="Search" style="max-width:520px" hide-bottom-space>
            <template #append><q-icon name="search" /></template>
          </q-input>
        </template>
        <template #actions>
          <q-btn unelevated no-caps color="primary" label="Add New User" />
        </template>
        <template #tabs>
          <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left" class="text-grey-7">
            <q-tab name="ep" label="EP Users" />
            <q-tab name="admin" label="Admin Users" />
            <q-tab name="hotel" label="Hotel Users" />
            <q-tab name="eventco" label="EventCo Users" />
          </q-tabs>
        </template>
      </ds-page-toolbar>
    </div>

    <div style="padding:20px 28px 28px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <q-table class="ds-table" :rows="rows" :columns="columns" row-key="name" flat hide-bottom :pagination="{ rowsPerPage: 0 }">
        <template #body-cell-name="props">
          <q-td :props="props"><a href="#" class="text-primary" style="text-decoration:none; font-weight:600;" @click.prevent>{{ props.value }}</a></q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props"><ds-status :label="props.value" /></q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props"><q-btn flat round dense icon="more_horiz" color="grey-7" /></q-td>
        </template>
      </q-table>
      <div class="flex flex-center q-mt-lg">
        <q-pagination v-model="pageNo" :max="3" direction-links boundary-links :max-pages="6" color="primary" />
      </div>
    </div>`,
})

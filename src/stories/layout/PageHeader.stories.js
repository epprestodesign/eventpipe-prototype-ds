/** APPLICATION COMPONENTS / Page Header → DsPageHeader + DsInfoGrid + Tabs. */
import { ref } from 'vue'
import DsPageHeader from '../../components/DsPageHeader.vue'
import DsInfoGrid from '../../components/DsInfoGrid.vue'

export default {
  title: 'App Chrome/Page Header',
  component: DsPageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: `
## Overview
The record/page header: an optional **breadcrumb**, a **title** with an optional
status **badge** and right-aligned **CTAs**, plus slots for a metadata grid
(**Info Grid**) and a **tab** bar. Built as separate pieces — compose the info
grid and tabs per screen.

Recreates the "BJNC 2025 – Inventory Request" header.
` } } },
}

const META = [
  { label: 'Created by:', value: 'Justin Girard' },
  { label: 'Hotel Name:', value: 'Best Western Plus Normandy Inn & Suites' },
  { label: 'Event Name:', value: 'USAV Boys Junior National Championships (BJNC)' },
  { label: 'Assigned to:', value: 'Josh Silverberg' },
  { label: 'Hotel Contact:', value: "R'Donn Robinson (test@test.com)" },
  { label: 'Event Start Date:', value: 'Fri, 04/11/2025' },
  { label: 'Request Created:', value: 'Tue, 04/01/2025 09:45 AM EST' },
  { label: 'Pipe ID:', value: 'PIPE-355872' },
  { label: 'Event End Date:', value: 'Sun, 04/13/2025' },
  { label: 'Request ID:', value: 'R-00081527' },
  { label: 'Group Block ID:', value: 'GB-BJNC-NORMANDY-01' },
  { label: 'Watchers:', value: '2 users' },
]

export const RecordHeader = {
  render: () => ({
    components: { DsPageHeader, DsInfoGrid },
    setup: () => ({ meta: META, tab: ref('details') }),
    template: `
      <ds-page-header title="BJNC 2025 – Best Western Plus Normandy – Inventory Request"
        badge="Approved by Hotel" badge-color="positive">
        <template #breadcrumb>
          <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2">
            <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
            <q-breadcrumbs-el label="Inventory Requests" />
            <q-breadcrumbs-el label="REQUEST # R-00081527" class="text-grey-6" />
          </q-breadcrumbs>
        </template>
        <template #actions>
          <q-btn outline no-caps color="primary" label="Duplicate" />
          <q-btn unelevated no-caps color="primary" label="Edit" />
        </template>
        <template #meta><ds-info-grid :items="meta" min-col-width="320px" label-width="120px" /></template>
        <template #tabs>
          <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left" class="text-grey-7">
            <q-tab name="details" label="Request Details" />
            <q-tab name="notes" label="Notes" />
            <q-tab name="activity" label="Activity Log" />
          </q-tabs>
        </template>
      </ds-page-header>`,
  }),
}

export const WithSaveActions = {
  render: () => ({
    components: { DsPageHeader },
    template: `
      <ds-page-header title="Edit Refund Policy">
        <template #breadcrumb>
          <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2">
            <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
            <q-breadcrumbs-el label="Events" />
            <q-breadcrumbs-el label="Inventory Testing" />
            <q-breadcrumbs-el label="Refund Policy" class="text-grey-6" />
          </q-breadcrumbs>
        </template>
        <template #actions>
          <q-btn outline no-caps color="primary" label="Discard Changes" />
          <q-btn unelevated no-caps color="primary" label="Save" />
        </template>
        <template #meta><p class="text-grey-7 q-mb-none">All fields marked with * are required to save the event.</p></template>
      </ds-page-header>`,
  }),
}

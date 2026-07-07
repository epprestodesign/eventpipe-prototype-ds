/** BASE COMPONENTS / Button Group → Quasar QBtnGroup. */
import { ref } from 'vue'

export default {
  title: 'Components/Actions/Button Group',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
A set of related actions or a segmented toggle, joined into a single control.
Uses QBtnGroup; the DS flattens elevation and adds a light divider between items.
` } } },
}

export const Actions = {
  render: () => ({ template: `
    <q-btn-group outline>
      <q-btn outline no-caps color="primary" icon="edit" label="Edit" />
      <q-btn outline no-caps color="primary" icon="content_copy" label="Duplicate" />
      <q-btn outline no-caps color="primary" icon="archive" label="Archive" />
    </q-btn-group>` }),
}

export const SegmentedToggle = {
  render: () => ({ setup: () => ({ view: ref('list') }), template: `
    <q-btn-group>
      <q-btn no-caps :color="view==='list'?'primary':'grey-3'" :text-color="view==='list'?'white':'dark'" icon="list" label="List" @click="view='list'" />
      <q-btn no-caps :color="view==='board'?'primary':'grey-3'" :text-color="view==='board'?'white':'dark'" icon="grid_view" label="Board" @click="view='board'" />
      <q-btn no-caps :color="view==='calendar'?'primary':'grey-3'" :text-color="view==='calendar'?'white':'dark'" icon="calendar_month" label="Calendar" @click="view='calendar'" />
    </q-btn-group>` }),
}

/** COMPONENTS / Actions / Popover → QMenu hosting interactive content. */
import { ref } from 'vue'

export default {
  title: 'Components/Actions/Popover',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
A **Popover** — an anchored overlay that (unlike a Tooltip) can hold *interactive*
content: a mini-form, a filter, or a set of controls. Built on QMenu anchored to
a trigger. For a simple action list use **Dropdown**; for hover hints use
**Tooltip**.
` } } },
}

export const FilterPopover = {
  render: () => ({
    setup: () => ({ team: ref('Any'), org: ref(''), teams: ['Any', 'Engineering', 'Product', 'Design'] }),
    template: `
      <q-btn outline no-caps color="primary" icon="filter_list" label="Filters">
        <q-menu anchor="bottom left" self="top left" :offset="[0,6]">
          <div style="padding:16px; width:260px;" class="column q-gutter-sm">
            <div style="font-weight:700;">Filter requests</div>
            <q-select v-model="team" :options="teams" outlined dense label="Team" hide-bottom-space />
            <q-input v-model="org" outlined dense label="Organization" hide-bottom-space />
            <div class="row justify-end q-gutter-sm q-mt-sm">
              <q-btn flat no-caps color="primary" label="Reset" v-close-popup />
              <q-btn unelevated no-caps color="primary" label="Apply" v-close-popup />
            </div>
          </div>
        </q-menu>
      </q-btn>`,
  }),
}

export const InfoPopover = {
  render: () => ({
    template: `
      <span class="row inline items-center q-gutter-xs">
        Pipe ID
        <q-icon name="info" size="16px" color="grey-6" class="cursor-pointer">
          <q-menu anchor="bottom middle" self="top middle" :offset="[0,6]">
            <div style="padding:12px 14px; max-width:240px;" class="text-body2">The unique pipeline identifier for this inventory request.</div>
          </q-menu>
        </q-icon>
      </span>`,
  }),
}

/** References — the two screens Scott opens either side of the walkthrough.
 *
 *  Neither changes under this request. They are here so the folder reads as the
 *  same journey he recorded — Events list → event record → Edit Event / the
 *  Registration tab — and so anyone reviewing the concepts can see where the
 *  new controls sit in the product rather than judging two cards in isolation.
 *
 *  Rebuilt from the 09/04 capture: his event, his hotels, his numbers.
 */
import { ref } from 'vue'
import { gbrPage, eventHeader, EVENT, HOTELS } from './_gbr'
import DsThumbnail from '../../../../components/DsThumbnail.vue'
import hotelA from '../../../../assets/hotel/exterior.jpg'
import hotelB from '../../../../assets/hotel/lobby.jpg'

export default {
  title: 'Design Requests/GB Reminder Controls/Sept 10/References/Context Screens',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The Events list and the event record (Hotels tab) as they appear in Scott\'s 09/04 capture. Unchanged by this request — context for the two screens that do change.' } },
  },
}

const stat = (value, label) => `
  <div style="text-align:center; min-width:120px;">
    <div style="font-size:1.375rem; font-weight:500; color:var(--ds-color-text);">${value}</div>
    <div style="font-size:0.8125rem; color:var(--ds-color-text-subtle); margin-top:2px;">${label}</div>
  </div>`

/* ------------------------------------------------------------------ Events */

const EVENTS_LIST = `
  <div style="padding:24px 32px 56px; background:var(--ds-color-surface-sunken); min-height:100%;">
    <div class="row items-center no-wrap q-mb-md" style="gap:16px;">
      <div style="font-size:1.375rem; font-weight:700; color:var(--ds-color-text); flex:none;">Events ( 1 )</div>
      <q-input v-model="search" outlined dense hide-bottom-space placeholder="Search" style="width:270px; flex:none;" />
      <div class="row items-center no-wrap" style="gap:8px; flex:none;">
        <span style="color:var(--ds-color-text-subtle); font-size:0.875rem;">Sort By:</span>
        <q-select v-model="sort" :options="['Earliest Start Date','Latest Start Date','Name']"
          outlined dense hide-bottom-space dropdown-icon="expand_more" style="width:210px;" />
      </div>
      <q-space />
      <q-btn outline no-caps color="primary" label="Filter" style="flex:none;" />
      <q-btn unelevated no-caps color="primary" label="New Event" icon-right="arrow_drop_down" style="flex:none;" />
    </div>

    <div class="row items-center no-wrap q-mb-md" style="gap:10px;">
      <span style="color:var(--ds-color-text-subtle); font-size:0.875rem;">Filter by:</span>
      <q-chip removable v-model="favoritesFilter" color="grey-3" text-color="grey-9" label="Favorites" />
    </div>

    <q-card flat bordered>
      <q-card-section style="padding:22px 26px;">
        <div class="row items-start no-wrap" style="gap:24px;">
          <ds-thumbnail size="xl" fit="contain" :src="logo" />

          <div style="min-width:0; flex:1;">
            <div class="row items-center no-wrap" style="gap:10px;">
              <a href="#" class="text-primary" style="text-decoration:underline; font-size:1.0625rem; font-weight:700;" @click.prevent>{{ evt.name }}</a>
              <q-chip dense clickable color="positive" text-color="white" icon-right="expand_more" :label="evt.status" />
            </div>
            <div style="color:var(--ds-color-text-subtle); font-size:0.875rem; margin:2px 0 8px;">{{ evt.cityState }}</div>
            <div style="display:grid; grid-template-columns:auto 1fr; gap:3px 10px; font-size:0.8125rem; max-width:520px;">
              <span style="font-weight:700;">Event Producer:</span><span>{{ evt.producer }}</span>
              <span style="font-weight:700;">Start/End Dates:</span><span>{{ evt.dates }}</span>
              <span style="font-weight:700;">Earliest Group Release Date:</span><span>{{ evt.earliestGroupRelease }}</span>
              <span style="font-weight:700;">Latest Hotel Cutoff:</span><span>{{ evt.latestHotelCutoff }}</span>
            </div>
          </div>

          <div style="flex:none;">
            <div class="row items-center justify-end q-mb-sm" style="gap:6px;">
              <q-icon name="star" size="17px" color="amber-7" />
              <span class="text-primary" style="font-size:0.8125rem;">Favorite</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:14px 8px;">
              ${stat('{{ evt.availableOnPeak }}', 'Available on Peak')}
              ${stat('0', 'Total Reservations')}
              ${stat('0', 'Unconf. Reservations')}
              ${stat('0', 'Nights Booked')}
              ${stat('0', 'Total Group Blocks')}
              ${stat('0', 'Pending Changes/Cxls')}
            </div>
          </div>

          <q-btn flat round dense icon="more_horiz" color="grey-7" style="flex:none;" />
        </div>
      </q-card-section>
    </q-card>
  </div>`

export const EventsList = gbrPage({
  active: 'events',
  components: { DsThumbnail },
  setup: () => ({
    evt: EVENT,
    logo: hotelA,
    search: ref(''),
    sort: ref('Earliest Start Date'),
    favoritesFilter: ref(true),
  }),
  slot: EVENTS_LIST,
})
EventsList.storyName = 'Events list'

/* ------------------------------------------------------------- Event record */

const EVENT_DETAIL = `
  ${eventHeader}
  <div style="padding:20px 32px 56px; background:var(--ds-color-surface-sunken); min-height:100%;">
    <div class="row items-center no-wrap q-mb-md" style="gap:12px;">
      <q-select v-model="inventoryView" :options="['Inventory','Contracts','Rates']"
        outlined dense hide-bottom-space dropdown-icon="expand_more" style="width:170px; flex:none;" />
      <q-space />
      <q-btn unelevated no-caps color="primary" label="New RFP" style="flex:none;" />
      <q-btn unelevated no-caps color="primary" label="Add Hotels" style="flex:none;" />
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section style="padding:20px 8px;">
        <div class="row items-center justify-around no-wrap">
          ${stat('{{ evt.availableOnPeak }}', 'Available Rooms on Peak')}
          <q-separator vertical />
          ${stat('0', 'Total Reservations')}
          <q-separator vertical />
          ${stat('0', 'Total Nights Booked')}
          <q-separator vertical />
          ${stat('0', 'Individual Reservations')}
          <q-separator vertical />
          ${stat('0', 'Group Blocks')}
          <q-separator vertical />
          ${stat('0/0', 'Group Pickup')}
        </div>
      </q-card-section>
    </q-card>

    <div class="row items-center no-wrap q-mb-md" style="gap:16px;">
      <div style="font-size:1.0625rem; font-weight:700; color:var(--ds-color-text); flex:none;">Hotels List</div>
      <q-input v-model="hotelSearch" outlined dense hide-bottom-space placeholder="Search" style="width:270px;">
        <template #append><q-icon name="search" color="grey-6" /></template>
      </q-input>
    </div>

    <q-card v-for="(h, hi) in hotels" :key="h.name" flat bordered class="q-mb-md">
      <q-card-section style="padding:18px 22px;">
        <div class="row items-center no-wrap" style="gap:20px;">
          <ds-thumbnail size="80px" fit="cover" :src="hi === 0 ? photoA : photoB" />
          <div style="min-width:0; flex:1;">
            <div class="row items-center no-wrap" style="gap:10px;">
              <a href="#" class="text-primary" style="text-decoration:none; font-weight:700;" @click.prevent>{{ h.name }}</a>
              <q-chip dense clickable :color="h.statusColor" text-color="white" icon-right="expand_more" :label="h.status" />
            </div>
            <div style="color:var(--ds-color-text-subtle); font-size:0.8125rem; margin-top:2px;">{{ h.address }}</div>
            <div style="display:grid; grid-template-columns:auto 1fr; gap:2px 8px; font-size:0.8125rem; margin-top:4px; max-width:430px;">
              <span style="font-weight:700;">Hotel Phone:</span><span>{{ h.phone }}</span>
              <span style="font-weight:700;">Earliest Group Release Date:</span><span>{{ h.release }}</span>
              <span style="font-weight:700;">Hotel Cutoff Date:</span><span>{{ h.cutoff }}</span>
            </div>
          </div>
          <div style="flex:none; display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:8px 4px;">
            ${stat('-/-', 'Ind/Groups')}
            ${stat('-/-', 'Group Pickup')}
            ${stat('-/-', 'Actual/Available')}
            ${stat('-', 'Nights Booked')}
          </div>
          <q-btn flat round dense icon="more_horiz" color="grey-7" style="flex:none;" />
        </div>
      </q-card-section>
    </q-card>
  </div>`

export const EventDetail = gbrPage({
  active: 'events',
  components: { DsThumbnail },
  setup: () => ({
    evt: EVENT,
    hotels: HOTELS,
    photoA: hotelA,
    photoB: hotelB,
    tab: ref('hotels'),
    inventoryView: ref('Inventory'),
    hotelSearch: ref(''),
  }),
  slot: EVENT_DETAIL,
})
EventDetail.storyName = 'Event record · Hotels tab'

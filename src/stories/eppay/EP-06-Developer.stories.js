/** EP Pay / Screens / 06 · Developer.
 *
 *  Four panels behind one tab bar — API Keys, Webhooks, Event Logs, IP
 *  Allowlist — laid out as the four 09/28 Developer captures
 *  (references/092826/…-developer-…png) arrange them, and painted from the
 *  design system rather than from those captures.
 *
 *  Three decisions worth stating:
 *
 *  1. The tab bar is live, and all four panels are in the one template. Each
 *     story only sets which tab opens. Four separate screens would have meant
 *     four copies of the chrome and a tab bar that did nothing — and the point
 *     of a prototype is that you can click it.
 *
 *  2. The bar is a `q-tabs` inside `epHeader()`, which is where Teams Mgmt
 *     Comms Phase 2 puts a tab bar: under the page title, in the same white
 *     header card. It was a row of hand-styled `<button>`s painting their own
 *     brand-filled active state until 2026-09-29.
 *
 *  3. Secrets are handled the way the real screen must: the secret key renders
 *     masked and the "Reveal" button is what unmasks it, so a screenshot of
 *     this story never contains a key-shaped string presented as live. The
 *     value is fabricated regardless.
 */
import { ref, computed } from 'vue'
import { epPage, epCard, epHeader, statusChip, EP_CAPTION, EP_H2, EP_PAGE } from './_eppay'
import DsSearch from '../../components/DsSearch.vue'

export default {
  title: 'EP Pay/Screens/06 · Developer',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The merchant\'s integration surface: API keys, webhook endpoints, the delivery log for recent events, and the IP allowlist that guards the secret key. The tab bar is clickable.' } },
  },
}

/* ---------------------------------------------------------------------------
 * Fixtures — local to this screen.
 * ------------------------------------------------------------------------- */

const TABS = [
  { key: 'keys', label: 'API Keys' },
  { key: 'webhooks', label: 'Webhooks' },
  { key: 'logs', label: 'Event Logs' },
  { key: 'ips', label: 'IP Allowlist' },
]

const KEYS = [
  { name: 'Publishable key', note: 'For your website or app', token: 'pk_live_51NxQ8rT2eVpaYk3Lm9WcB4sHd', secret: false, used: 'Aug 20, 2026', created: 'Feb 18, 2026' },
  { name: 'Secret key', note: 'For your server only', token: 'sk_live_9Qv2RdM7ktZpXb1A4Xa9', secret: true, used: 'Aug 20, 2026', created: 'Feb 18, 2026' },
]

const ENDPOINTS = [
  {
    url: 'https://api.yourhousingcompany.com/webhooks/eventpipe',
    added: 'Added Mar 3, 2026',
    events: ['payment.succeeded', 'payment.refunded', 'dispute.created'],
    enabled: true,
  },
]

const EVENTS = [
  { event: 'payment.succeeded', id: 'evt_1NT6J0', status: 'Failed', code: '500 Server error', when: 'Aug 20, 2026 · 4:52 PM' },
  { event: 'payment.succeeded', id: 'evt_1NDQL09V', status: 'Succeeded', code: '200 OK', when: 'Aug 20, 2026 · 1:55 PM' },
  { event: 'payment.refunded', id: 'evt_1NRGCU0Q', status: 'Succeeded', code: '200 OK', when: 'Aug 20, 2026 · 11:59 AM' },
  { event: 'payment.failed', id: 'evt_1N1564NRL', status: 'Succeeded', code: '200 OK', when: 'Aug 20, 2026 · 11:04 AM' },
  { event: 'dispute.created', id: 'evt_1N1IVWHIG', status: 'Failed', code: '500 Server error', when: 'Aug 20, 2026 · 8:00 AM' },
  { event: 'payout.paid', id: 'evt_1N1WLOB9B', status: 'Succeeded', code: '200 OK', when: 'Aug 20, 2026 · 5:57 AM' },
  { event: 'payment.succeeded', id: 'evt_1N2ABG506', status: 'Succeeded', code: '200 OK', when: 'Aug 20, 2026 · 4:55 AM' },
  { event: 'customer.created', id: 'evt_1N2O17YR1', status: 'Succeeded', code: '200 OK', when: 'Aug 20, 2026 · 1:44 AM' },
  { event: 'dispute.updated', id: 'evt_1N31QZSHW', status: 'Succeeded', code: '200 OK', when: 'Aug 19, 2026 · 11:34 PM' },
  { event: 'payout.failed', id: 'evt_1N3FGRM8R', status: 'Succeeded', code: '200 OK', when: 'Aug 19, 2026 · 10:25 PM' },
]
/** The log is paged; the account's full count is what the footer reports. */
const EVENT_TOTAL = 34

const ALLOWED = [
  { address: '203.0.113.24', description: 'Production server', added: 'Mar 3, 2026' },
  { address: '198.51.100.0/24', description: 'Office network', added: 'Apr 14, 2026' },
]

/* ---------------------------------------------------------------------------
 * Table columns. Every panel's table is a `q-table class="ds-table"`, which is
 * what paints the brand header and the zebra rows — the same component and the
 * same class as every other table in the platform. Sorting is off: these are
 * short, chronological lists, and the captures show no sort affordance.
 * ------------------------------------------------------------------------- */

/** The trailing column each capture ends on: an "edit columns" pencil in the
 *  header, and the row's own controls beneath it. */
const ACTIONS_COL = { name: 'actions', label: '', field: () => '', align: 'right' }

const KEY_COLUMNS = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'token', label: 'Token', field: 'token', align: 'left' },
  { name: 'used', label: 'Last used', field: 'used', align: 'left' },
  { name: 'created', label: 'Created', field: 'created', align: 'left' },
  ACTIONS_COL,
]

const ENDPOINT_COLUMNS = [
  { name: 'url', label: 'Endpoint URL', field: 'url', align: 'left' },
  { name: 'events', label: 'Subscribed Events', field: (row) => row.events.length, align: 'left' },
  { name: 'status', label: 'Status', field: 'enabled', align: 'left' },
  ACTIONS_COL,
]

const EVENT_COLUMNS = [
  { name: 'event', label: 'Event', field: 'event', align: 'left' },
  { name: 'id', label: 'Event ID', field: 'id', align: 'left' },
  { name: 'delivery', label: 'Delivery', field: 'status', align: 'left' },
  { name: 'when', label: 'Date & Time', field: 'when', align: 'left' },
  ACTIONS_COL,
]

const ALLOWED_COLUMNS = [
  { name: 'address', label: 'Address', field: 'address', align: 'left' },
  { name: 'description', label: 'Description', field: 'description', align: 'left' },
  { name: 'added', label: 'Added', field: 'added', align: 'left' },
  ACTIONS_COL,
]

/* ---------------------------------------------------------------------------
 * Markup
 * ------------------------------------------------------------------------- */

const MONO = 'font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:0.875rem;'

/** The pencil the captures put at the right end of every header row. Written
 *  once: four tables carry it, and it is the same control in all four. */
const EDIT_COLUMNS_HEADER = `
  <template #header-cell-actions="props">
    <q-th :props="props" style="width:56px;">
      <q-btn flat dense square icon="edit" color="white" size="sm" aria-label="Edit columns" />
    </q-th>
  </template>`

/** The four attributes every table here shares, so a change to the table
 *  treatment is made once. `rows`/`columns`/`row-key` are per table. */
const TABLE_ATTRS = 'class="ds-table" flat bordered :pagination="{ rowsPerPage: 0 }"'

const TAB_BAR = `
  <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left"
    class="text-grey-7" style="margin:0 -8px;">
    <q-tab v-for="t in tabs" :key="t.key" :name="t.key" :label="t.label" />
  </q-tabs>`

const keysPanel = `
  <div v-if="tab === 'keys'">
    ${epCard(`
      <div style="${EP_H2}">Standard Keys</div>
      <p style="margin:0 0 18px; color:var(--ds-color-text);">
        These keys let your systems call the EventPipe Pay API. The publishable key is safe in a
        browser or app; keep the secret key on your server.
      </p>

      <q-table ${TABLE_ATTRS} hide-bottom :rows="keys" :columns="keyColumns" row-key="name">
        ${EDIT_COLUMNS_HEADER}
        <template #body-cell-name="props">
          <q-td :props="props">
            <div style="font-weight:500;">{{ props.row.name }}</div>
            <div style="${EP_CAPTION}">{{ props.row.note }}</div>
          </q-td>
        </template>
        <template #body-cell-token="props">
          <q-td :props="props">
            <code style="${MONO} background:var(--ds-color-surface-sunken); border:1px solid var(--ds-color-border); border-radius:var(--ds-radius-sm); padding:6px 10px;">{{ shown(props.row) }}</code>
          </q-td>
        </template>
        <template #body-cell-used="props">
          <q-td :props="props" style="${EP_CAPTION}">{{ props.value }}</q-td>
        </template>
        <template #body-cell-created="props">
          <q-td :props="props" style="${EP_CAPTION}">{{ props.value }}</q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props" style="white-space:nowrap;">
            <q-btn v-if="props.row.secret" outline no-caps color="grey-9" class="q-mr-sm" style="font-weight:700;"
              :label="revealed ? 'Hide' : 'Reveal'" @click="revealed = !revealed" />
            <q-btn outline no-caps color="grey-9" label="Copy" class="q-mr-sm" style="font-weight:700;" />
            <q-btn v-if="props.row.secret" outline no-caps color="negative" label="Roll Key" style="font-weight:700;" />
          </q-td>
        </template>
      </q-table>`)}
  </div>`

const webhooksPanel = `
  <div v-if="tab === 'webhooks'">
    ${epCard(`
      <div class="row items-center no-wrap q-mb-md">
        <div style="${EP_H2} margin-bottom:0;">Endpoints</div>
        <q-space />
        <q-btn unelevated no-caps color="primary" label="Add Endpoint" style="padding:0 22px; font-weight:700;" />
      </div>
      <p style="margin:0 0 18px; color:var(--ds-color-text);">
        EventPipe Pay sends an HTTPS POST to each enabled endpoint whenever an event it subscribes to happens.
      </p>

      <q-table ${TABLE_ATTRS} hide-bottom :rows="endpoints" :columns="endpointColumns" row-key="url">
        ${EDIT_COLUMNS_HEADER}
        <template #body-cell-url="props">
          <q-td :props="props">
            <div>{{ props.row.url }}</div>
            <div style="${EP_CAPTION}">{{ props.row.added }}</div>
          </q-td>
        </template>
        <template #body-cell-events="props">
          <q-td :props="props">
            <div>{{ props.row.events.length }} events</div>
            <div style="${MONO} ${EP_CAPTION} line-height:1.5;">{{ props.row.events.join(', ') }}</div>
          </q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-toggle v-model="props.row.enabled" color="primary" :label="props.row.enabled ? 'Enabled' : 'Disabled'" />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn outline dense color="grey-6" icon="more_vert" size="sm" aria-label="Endpoint actions" />
          </q-td>
        </template>
      </q-table>`)}
  </div>`

const logsPanel = `
  <div v-if="tab === 'logs'">
    ${epCard(`
      <div style="${EP_H2}">Recent Events</div>

      <div class="row items-center no-wrap q-mb-md">
        <div style="width:330px;">
          <ds-search v-model="q" placeholder="Search events" :results="suggestions" />
        </div>
        <!-- A segmented three-way filter. Left as buttons: the library has no
             segmented control, and QBtnToggle paints a solid brand slab that
             would outweigh the Add/Next actions on the same screen. -->
        <div style="display:flex; gap:2px; border:1px solid var(--ds-color-border); border-radius:var(--ds-radius-md); padding:3px; margin-left:16px;">
          <button v-for="d in deliveries" :key="d" type="button"
            :aria-pressed="delivery === d" :style="segStyle(delivery === d)"
            @click="delivery = d">{{ d }}</button>
        </div>
      </div>

      <q-table ${TABLE_ATTRS} :hide-bottom="events.length > 0"
        :rows="events" :columns="eventColumns" row-key="id"
        no-data-label="No events match this filter.">
        ${EDIT_COLUMNS_HEADER}
        <template #body-cell-event="props">
          <q-td :props="props" style="${MONO}">{{ props.value }}</q-td>
        </template>
        <template #body-cell-id="props">
          <q-td :props="props" style="${MONO} ${EP_CAPTION}">{{ props.value }}</q-td>
        </template>
        <template #body-cell-delivery="props">
          <q-td :props="props">
            <span :style="chipStyle(props.value)">{{ props.value }}</span>
            <div style="${EP_CAPTION} margin-top:4px;">{{ props.row.code }}</div>
          </q-td>
        </template>
        <template #body-cell-when="props">
          <q-td :props="props" style="${EP_CAPTION}">{{ props.value }}</q-td>
        </template>
      </q-table>

      <div class="row items-center q-pt-md">
        <div style="${EP_CAPTION}">{{ logFooter }}</div>
        <q-space />
        <q-btn flat no-caps color="grey-6" label="Previous" disable class="q-mr-sm" />
        <q-btn outline no-caps color="primary" label="Next" />
      </div>`)}
  </div>`

const ipsPanel = `
  <div v-if="tab === 'ips'">
    ${epCard(`
      <div style="${EP_H2}">Allowed Addresses</div>
      <p style="margin:0 0 18px; color:var(--ds-color-text);">
        Only requests from these addresses can use your secret key. With the list empty, requests are
        accepted from any address.
      </p>

      <div class="row items-center no-wrap q-gutter-md q-mb-lg">
        <q-input v-model="newAddress" outlined dense hide-bottom-space style="flex:1.4;"
          placeholder="203.0.113.24 or 203.0.113.0/24" aria-label="IP address or CIDR range" />
        <q-input v-model="newDescription" outlined dense hide-bottom-space style="flex:1;"
          placeholder="Description (optional)" aria-label="Description" />
        <q-btn unelevated no-caps color="primary" label="Add Address"
          style="padding:0 20px; font-weight:700;" @click="addAddress" />
      </div>

      <q-table ${TABLE_ATTRS} :hide-bottom="allowed.length > 0"
        :rows="allowed" :columns="allowedColumns" row-key="address"
        no-data-label="No addresses yet — requests are accepted from anywhere.">
        ${EDIT_COLUMNS_HEADER}
        <template #body-cell-address="props">
          <q-td :props="props" style="${MONO}">{{ props.value }}</q-td>
        </template>
        <template #body-cell-added="props">
          <q-td :props="props" style="${EP_CAPTION}">{{ props.value }}</q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense color="negative" icon="delete_outline" size="sm"
              :aria-label="'Remove ' + props.row.address" @click="removeAddress(props.row)" />
          </q-td>
        </template>
      </q-table>`)}
  </div>`

const SLOT = `
  <div style="${EP_PAGE}">
    ${epHeader('Developer', { tabs: TAB_BAR })}
    ${keysPanel}
    ${webhooksPanel}
    ${logsPanel}
    ${ipsPanel}
  </div>`

/* ---------------------------------------------------------------------------
 * State
 * ------------------------------------------------------------------------- */

function state(initialTab) {
  const tab = ref(initialTab)
  const revealed = ref(false)
  const q = ref('')
  const delivery = ref('All')
  const allowed = ref(ALLOWED.map((a) => ({ ...a })))
  const newAddress = ref('')
  const newDescription = ref('')

  const events = computed(() => {
    const needle = q.value.trim().toLowerCase()
    return EVENTS.filter((e) => {
      if (delivery.value !== 'All' && e.status !== delivery.value) return false
      return !needle || e.event.toLowerCase().includes(needle) || e.id.toLowerCase().includes(needle)
    })
  })

  /* Unfiltered the log is page 1 of 34; filtered it is only what is on screen,
     so the footer must not keep quoting the account total. */
  const filtering = computed(() => delivery.value !== 'All' || !!q.value.trim())

  return {
    // Copied into a ref so the Enabled toggle is live and the fixture stays put.
    tabs: TABS, tab, keys: KEYS, endpoints: ref(ENDPOINTS.map((e) => ({ ...e }))),
    allowed, newAddress, newDescription,
    revealed, q, delivery, deliveries: ['All', 'Succeeded', 'Failed'], events,

    keyColumns: KEY_COLUMNS,
    endpointColumns: ENDPOINT_COLUMNS,
    eventColumns: EVENT_COLUMNS,
    allowedColumns: ALLOWED_COLUMNS,

    segStyle: (on) => [
      'padding:8px 18px; border:0; cursor:pointer; border-radius:var(--ds-radius-sm); font-size:0.9375rem; font-weight:500;',
      on
        ? 'background:var(--ds-color-background-brand-bold); color:var(--ds-color-text-inverse); font-weight:700;'
        : 'background:transparent; color:var(--ds-color-text);',
    ].join(' '),

    chipStyle: statusChip,

    /* Masked until Reveal. The mask keeps the prefix, which is the part that
       tells you which key you are looking at. */
    shown: (k) => (k.secret && !revealed.value
      ? `${k.token.slice(0, 8)}${'•'.repeat(12)}${k.token.slice(-4)}`
      : k.token),

    logFooter: computed(() => (filtering.value
      ? `Showing ${events.value.length} of ${EVENT_TOTAL} events`
      : `Showing 1–${events.value.length} of ${EVENT_TOTAL} events`)),

    suggestions: computed(() => events.value.slice(0, 6)
      .map((e) => ({ id: e.id, label: e.event, sublabel: `${e.id} · ${e.code}` }))),

    /* Guarded rather than disabled: the capture shows the button solid, and a
       CTA that greys out before anyone has typed reads as broken. */
    addAddress: () => {
      if (!newAddress.value.trim()) return
      allowed.value.push({
        address: newAddress.value,
        description: newDescription.value || '—',
        added: 'Sep 28, 2026',
      })
      newAddress.value = ''
      newDescription.value = ''
    },
    removeAddress: (a) => { allowed.value = allowed.value.filter((x) => x.address !== a.address) },
  }
}

const screen = (tab) => epPage({
  active: 'developer',
  components: { DsSearch },
  setup: () => state(tab),
  slot: SLOT,
})

/** The publishable and secret keys. **Reveal** unmasks the secret. */
export const ApiKeys = screen('keys')
ApiKeys.storyName = 'API Keys'

/** Where EP Pay posts events, and which events each endpoint subscribes to. */
export const Webhooks = screen('webhooks')

/** The delivery log — the tab a merchant opens when an integration breaks. */
export const EventLogs = screen('logs')
EventLogs.storyName = 'Event Logs'

/** The addresses allowed to use the secret key. Add and remove both work. */
export const IpAllowlist = screen('ips')
IpAllowlist.storyName = 'IP Allowlist'

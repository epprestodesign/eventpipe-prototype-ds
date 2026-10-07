/** Team Name Qualifiers — Registration Settings (the event Registration tab).
 *
 *  Reskinned from the 2026-10-07 captures onto the design system. The screen is
 *  live: every checkbox and dropdown drives the states the captures show, so a
 *  reviewer can reach each one from Default. The named stories open directly on
 *  each captured state.
 *
 *  Rules, from the captures:
 *  - Room Block Restrictions on → "Restriction Expiration" (date + time, EST).
 *  - Group Block / Reservation Booking – Team Selection Required on → each
 *    reveals its own "Registration Requirement Expiration" field.
 *  - Both Team Selection Required on → Hide Team List is disabled (with an info
 *    tooltip) and Team Name Qualifiers becomes "Not applicable".
 *  - Team Name Qualifiers is collapsed by default; picking fields highlights
 *    them and shows how a manually entered team name will read.
 *  - Compliance is shown while Compliance Tracking is on.
 */
import { reactive, ref, computed } from 'vue'
import { Notify } from 'quasar'
import DsSelect from '../../../components/DsSelect.vue'
import DsInput from '../../../components/DsInput.vue'
import DsLink from '../../../components/DsLink.vue'
import DsField from '../../../components/DsField.vue'
import DsConfirmDialog from '../../../components/DsConfirmDialog.vue'
import TnqQualifierPanel from './components/TnqQualifierPanel.vue'
import TnqExpirationField from './components/TnqExpirationField.vue'
import { tnqPage, eventHeader, EVENT, teamListLocked } from './_tnq'

export default {
  title: 'Design Requests/Team Name Qualifiers/Screens/Registration Settings',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The event **Registration** tab with **Team Name Qualifiers** added to Booking Site Behavior, rebuilt on the design system from the 2026-10-07 captures. Everything is live — start at **Default** and use the checkboxes, or open a named state directly.' } },
  },
}

const CARD = 'margin-bottom:20px;'
const SECTION_TITLE = 'color:var(--ds-color-text-brand); font-size:1.125rem; line-height:1.4; font-weight:600; letter-spacing:normal; margin:0 0 20px;'
const STACK = 'display:flex; flex-direction:column; gap:14px;'

const info = (tip) => `<q-icon name="info_outline" size="16px" color="grey-6" class="q-ml-xs" tabindex="0" aria-label="${tip}"><q-tooltip max-width="280px">${tip}</q-tooltip></q-icon>`

const registrationData = `
  <q-card flat bordered style="${CARD}">
    <q-card-section class="q-pa-lg">
      <h2 style="${SECTION_TITLE}">Registration Data and Usage</h2>
      <div class="row items-end q-col-gutter-lg q-mb-md">
        <div style="width:320px;"><ds-select v-model="f.entity" label="Registered Entity" required :options="['Team','Organization']" /></div>
        <div><q-checkbox v-model="f.groupByOrg" dense color="primary" label="Group by organization on booking site" style="min-height:40px;" /></div>
      </div>
      <div style="${STACK}">
        <q-checkbox v-model="f.complianceTracking" dense color="primary" label="Compliance Tracking" />
        <q-checkbox v-model="f.roomBlockRestrictions" dense color="primary" label="Room Block Restrictions" />
        <tnq-expiration-field v-if="f.roomBlockRestrictions" label="Restriction Expiration"
          v-model:date="f.restrictionDate" v-model:time="f.restrictionTime" />
      </div>
    </q-card-section>
  </q-card>`

const bookingSite = `
  <q-card flat bordered style="${CARD}">
    <q-card-section class="q-pa-lg">
      <h2 style="${SECTION_TITLE}">Booking Site Behavior</h2>
      <div style="${STACK}">
        <div class="row items-center no-wrap">
          <q-checkbox v-model="f.groupBlockTeamRequired" dense color="primary" label="Group Block Booking – Team Selection Required" />
          ${info('Bookers must pick a team from the registered team list when creating a group block.')}
        </div>
        <tnq-expiration-field v-if="f.groupBlockTeamRequired" label="Registration Requirement Expiration For Group Blocks"
          v-model:date="f.groupBlockDate" v-model:time="f.groupBlockTime" />

        <div class="row items-center no-wrap">
          <q-checkbox v-model="f.reservationTeamRequired" dense color="primary" label="Reservation Booking – Team Selection Required" />
          ${info('Guests must pick a team from the registered team list when making a reservation.')}
        </div>
        <tnq-expiration-field v-if="f.reservationTeamRequired" label="Registration Requirement Expiration For Reservations"
          v-model:date="f.reservationDate" v-model:time="f.reservationTime" />

        <div class="row items-center no-wrap">
          <q-checkbox :model-value="locked ? false : f.hideTeamList" :disable="locked" dense color="primary" label="Hide Team List"
            @update:model-value="(v) => f.hideTeamList = v" />
          <template v-if="locked">${info('Unavailable while team selection is required for both group blocks and reservations — every guest picks from the team list.')}</template>
        </div>

        <tnq-qualifier-panel v-model="f.qualifiers" :open="qualifiersOpen" :not-applicable="locked"
          @refresh="notify('Custom fields are up to date')" />
      </div>
    </q-card-section>
  </q-card>`

const eventIds = `
  <q-card flat bordered style="${CARD}">
    <q-card-section class="q-pa-lg">
      <h2 style="${SECTION_TITLE}">Registration System Event ID(s)</h2>
      <div v-for="(id, i) in f.eventIds" :key="i" class="row items-center no-wrap q-gutter-sm q-mb-sm" style="max-width:420px;">
        <ds-input v-model="f.eventIds[i]" placeholder="Event ID" :aria-label="'Registration system event ID ' + (i + 1)" style="flex:1;" />
        <q-btn flat round dense icon="delete_outline" color="grey-7" :aria-label="'Remove event ID ' + (i + 1)" @click="f.eventIds.splice(i, 1)" />
      </div>
      <ds-link href="#add-event-id" @click.prevent="f.eventIds.push('')">+ Add A Registration System Event ID</ds-link>
    </q-card-section>
  </q-card>`

const compliance = `
  <q-card v-if="f.complianceTracking" flat bordered style="${CARD}">
    <q-card-section class="q-pa-lg">
      <h2 style="${SECTION_TITLE}">Compliance</h2>
      <div class="row q-col-gutter-lg items-end">
        <div>
          <ds-field label="Local Team Venue Distance">
            <div class="row no-wrap q-gutter-sm">
              <div style="width:110px;"><ds-input v-model="f.venueDistance" type="number" aria-label="Local team venue distance" /></div>
              <div style="width:96px;"><ds-select v-model="f.distanceUnit" :options="['mi','km']" aria-label="Distance unit" /></div>
            </div>
          </ds-field>
        </div>
        <div style="width:240px;"><ds-select v-model="f.complianceCriteria" label="Compliance Criteria" required :options="['Reservations','Room Nights']" /></div>
        <div style="width:240px;"><ds-select v-model="f.complianceFormula" label="Formula" required :options="['Hard Count','Percentage']" /></div>
      </div>
      <div class="q-mt-lg" style="width:150px;"><ds-input v-model="f.complianceAmount" type="number" label="Amount" required /></div>
    </q-card-section>
  </q-card>`

const restrictions = `
  <q-card flat bordered style="${CARD}">
    <q-card-section class="q-pa-lg">
      <h2 style="${SECTION_TITLE}">Restrictions</h2>
      <div class="row q-col-gutter-lg items-end">
        <div style="width:240px;"><ds-select v-model="f.restrictionCriteria" label="Restriction Criteria" required :options="['Room Nights Per Event']" /></div>
        <div style="width:240px;"><ds-select v-model="f.restrictionFormula" label="Formula" required :options="['Hard Count','Percentage']" /></div>
        <div style="width:150px;"><ds-input v-model="f.restrictionAmount" type="number" label="Amount" required /></div>
      </div>
    </q-card-section>
  </q-card>`

const management = `
  <q-card flat bordered style="${CARD}">
    <q-card-section class="q-pa-lg">
      <h2 style="${SECTION_TITLE}">Registration Management</h2>
      <div class="row items-center no-wrap q-gutter-xl">
        <div style="max-width:520px;">
          <div style="font-weight:700; margin-bottom:4px;">Delete All Registrations</div>
          <div style="line-height:1.5;">This action will permanently delete <strong>ALL</strong> registration and compliance data that has been uploaded for this event. This cannot be reversed.</div>
        </div>
        <q-btn outline no-caps color="negative" label="Delete" style="flex:none;" @click="confirmDelete = true" />
      </div>
    </q-card-section>
  </q-card>
  <ds-confirm-dialog v-model="confirmDelete" destructive title="Delete all registrations?"
    message="All registration and compliance data uploaded for this event will be permanently deleted. This cannot be reversed."
    confirm-label="Delete all" cancel-label="Cancel" @confirm="notify('All registrations deleted')" />`

const SLOT = `
  ${eventHeader}
  <div style="padding:24px 32px 56px; background:var(--ds-color-surface-sunken); min-height:100%;">
    <div class="row items-center q-mb-md">
      <h1 style="margin:0; font-size:1.375rem; line-height:1.3; font-weight:600; letter-spacing:normal; color:var(--ds-color-text);">Registration Settings</h1>
      <q-space />
      <q-btn unelevated no-caps color="primary" label="Save" @click="notify('Registration settings saved')" />
    </div>
    <div>
      ${registrationData}
      ${bookingSite}
      ${eventIds}
      ${compliance}
      ${restrictions}
      ${management}
    </div>
  </div>`

function state(over = {}, { qualifiersOpen = false } = {}) {
  const f = reactive({
    entity: 'Team', groupByOrg: true,
    complianceTracking: true, roomBlockRestrictions: false, restrictionDate: '', restrictionTime: '',
    groupBlockTeamRequired: false, groupBlockDate: '', groupBlockTime: '',
    reservationTeamRequired: false, reservationDate: '', reservationTime: '',
    hideTeamList: false, qualifiers: [],
    eventIds: [],
    venueDistance: 70, distanceUnit: 'mi', complianceCriteria: 'Reservations', complianceFormula: 'Hard Count', complianceAmount: 10,
    restrictionCriteria: 'Room Nights Per Event', restrictionFormula: 'Hard Count', restrictionAmount: 20,
    ...over,
  })
  const locked = computed(() => teamListLocked(f))
  const notify = (message) => Notify.create({ message, icon: 'check_circle', timeout: 2000 })
  return { evt: EVENT, f, locked, qualifiersOpen, confirmDelete: ref(false), notify }
}

const story = (over, opts) => tnqPage({
  components: { DsSelect, DsInput, DsLink, DsField, DsConfirmDialog, TnqQualifierPanel, TnqExpirationField },
  setup: () => state(over, opts),
  slot: SLOT,
})

/** As captured: Team Name Qualifiers collapsed, nothing required. Everything is live from here. */
export const Default = story()

/** Team Name Qualifiers opened — the four company custom fields, none picked yet. */
export const QualifiersOpen = story({}, { qualifiersOpen: true })
QualifiersOpen.storyName = 'Qualifiers · open'

/** All four picked: the rows highlight and the preview shows how a typed team name will read. */
export const QualifiersSelected = story({ qualifiers: ['age', 'gender', 'skill', 'coach'] }, { qualifiersOpen: true })
QualifiersSelected.storyName = 'Qualifiers · all selected, with preview'

/** Group block team selection required — reveals its expiration field. */
export const GroupBlockRequired = story({ groupBlockTeamRequired: true })
GroupBlockRequired.storyName = 'Group block · team selection required'

/** Both required — Hide Team List disables and Team Name Qualifiers becomes "Not applicable". */
export const BothRequired = story({ groupBlockTeamRequired: true, reservationTeamRequired: true })
BothRequired.storyName = 'Both required · qualifiers not applicable'

/** Registered Entity set to Organization with Room Block Restrictions on — reveals Restriction Expiration. */
export const OrganizationRestrictions = story({ entity: 'Organization', roomBlockRestrictions: true })
OrganizationRestrictions.storyName = 'Organization · room block restrictions'

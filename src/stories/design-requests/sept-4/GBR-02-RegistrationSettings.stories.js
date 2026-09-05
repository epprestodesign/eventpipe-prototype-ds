/** PP-44 — Registration Settings, and the conflict modal on save.
 *
 *  Scott: "this setting becomes relevant also if you go over to registration
 *  settings and then down here to communications. So when a user turns on
 *  compliance reminders… and you save settings, the system's going to check a
 *  few things, and if they're all set a certain way, then a modal should pop
 *  up."
 *
 *  The screen is rebuilt from his 09/04 capture. The Save button is live: turn
 *  **Compliance Reminder** on and press Save to raise the modal; leave it off
 *  and the save just completes. The three conditions PP-44 lists are evaluated
 *  by `hasReminderConflict()` in `_gbr.js`, so the trigger is stated once.
 *
 *  Scott, on the cross-screen effect of the modal's primary action: "obviously
 *  if they did that, it would actually technically turn off the other toggle on
 *  this page. You don't have to simulate that." So this folder does not carry
 *  shared state between screens — the modal reports what it did and stops there.
 */
import { reactive, ref, computed } from 'vue'
import { gbrPage, eventHeader, EVENT, DEFAULT_INTERVAL, hasReminderConflict } from './_gbr'
import GbrConflictModal from './components/GbrConflictModal.vue'

export default {
  title: 'Design Requests/Sept 4/Screens/02 · Registration Settings',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '**PP-44 (GBR-2).** The event Registration tab, rebuilt from the 09/04 capture, with the advisory conflict modal wired to Save. Turn *Compliance Reminder* on and press **Save**.' } },
  },
}

const CARD = 'margin-bottom:20px;'
const CARD_BODY = 'padding:28px 32px;'
const SECTION_TITLE = 'color:var(--ds-color-background-brand-bold); font-size:1.125rem; font-weight:500; margin-bottom:20px;'
const COL = 'max-width:320px;'

/** The company's Teams Management templates, worded as in the capture.
 *  Deliberately not exported: every export in a stories file becomes a story. */
const TM_TEMPLATES = [
  {
    key: 'previously-compliant',
    title: 'Previously Compliant Notice',
    desc: 'Sent when a team that had met its goal drops back below it — usually after a cancellation. Sends once and if they remain non-compliant then compliance reminder emails take over.',
  },
  {
    key: 'compliance-reminder',
    title: 'Compliance Reminder',
    desc: 'The recurring nudge for teams. Runs on a cadence and date range you set relative to the event start. Intended for non-compliant teams. Add tiers to shift your tone, frequency, or audience as the event draws closer.',
  },
  {
    key: 'welcome',
    title: 'Welcome Email',
    desc: 'Sent once per team per event. Establishes that the event is Stay-to-Play and points the team at the booking link. Intended for teams traveling to the event with a compliance requirement.',
  },
]

const checkRow = (label, model, tooltip = '') => `
  <div style="margin-bottom:14px;">
    <div style="font-size:0.8125rem; color:var(--ds-color-text-subtle); margin-bottom:2px;">
      ${label}${tooltip ? `<q-icon name="info" size="15px" color="grey-6" class="q-ml-xs"><q-tooltip>${tooltip}</q-tooltip></q-icon>` : ''}
    </div>
    <q-checkbox v-model="${model}" label="Yes" color="primary" dense />
  </div>`

const systemAndData = `
  <q-card flat bordered style="${CARD}">
    <q-card-section style="${CARD_BODY}">
      <div style="${SECTION_TITLE}">System &amp; Data</div>
      <div class="row items-center q-gutter-lg no-wrap q-mb-md">
        <div style="${COL} flex:none; width:320px;">
          <div style="font-size:0.8125rem; color:var(--ds-color-text-subtle); margin-bottom:6px;">Registered Entity <span class="text-negative">*</span></div>
          <q-select v-model="f.entity" :options="['Team','Organization']" outlined dense hide-bottom-space dropdown-icon="expand_more" />
        </div>
        <q-checkbox v-model="f.groupByOrg" label="Group by organization on booking site" color="primary" dense style="margin-top:18px;" />
      </div>
      ${checkRow('Compliance Tracking', 'f.complianceTracking')}
      ${checkRow('Room Block Restrictions', 'f.roomBlockRestrictions', 'Caps how many rooms a team may hold at once.')}
      ${checkRow('Group Block Booking - Team Selection Required', 'f.groupBlockTeamRequired', 'Bookers must pick a team when creating a group block.')}
      ${checkRow('Reservation Booking - Team Selection Required', 'f.reservationTeamRequired', 'Bookers must pick a team when making a reservation.')}
      ${checkRow('Hide Team Selection from Booking Site', 'f.hideTeamSelection')}
      <div style="font-weight:700; color:var(--ds-color-text); margin:22px 0 8px;">Registration Event(s)</div>
      <a href="#" class="text-primary" style="text-decoration:none; font-weight:500;" @click.prevent>+ Add A Registration System Event ID</a>
    </q-card-section>
  </q-card>`

const compliance = `
  <q-card v-if="f.complianceTracking" flat bordered style="${CARD}">
    <q-card-section style="${CARD_BODY}">
      <div style="${SECTION_TITLE}">Compliance</div>
      <div style="display:flex; align-items:flex-end; gap:8px; max-width:260px; margin-bottom:18px;">
        <div style="flex:1;">
          <div style="font-size:0.8125rem; color:var(--ds-color-text-subtle); margin-bottom:6px;">Local Team Venue Distance</div>
          <q-input v-model="f.venueDistance" type="number" outlined dense hide-bottom-space />
        </div>
        <div style="width:96px;"><q-select v-model="f.distanceUnit" :options="['mi','km']" outlined dense hide-bottom-space dropdown-icon="expand_more" /></div>
      </div>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4">
          <div style="font-size:0.8125rem; color:var(--ds-color-text-subtle); margin-bottom:6px;">Compliance Criteria <span class="text-negative">*</span></div>
          <q-select v-model="f.complianceCriteria" :options="['Room Nights','Reservations']" outlined dense hide-bottom-space dropdown-icon="expand_more" />
        </div>
        <div class="col-12 col-md-4">
          <div style="font-size:0.8125rem; color:var(--ds-color-text-subtle); margin-bottom:6px;">Formula <span class="text-negative">*</span></div>
          <q-select v-model="f.complianceFormula" :options="['Hard Count','Percentage']" outlined dense hide-bottom-space dropdown-icon="expand_more" />
        </div>
        <div class="col-12 col-md-4">
          <div style="font-size:0.8125rem; color:var(--ds-color-text-subtle); margin-bottom:6px;">Amount <span class="text-negative">*</span></div>
          <q-input v-model="f.complianceAmount" type="number" outlined dense hide-bottom-space />
        </div>
      </div>
    </q-card-section>
  </q-card>`

/* Communications — the card whose Compliance Reminder toggle is half of the
   conflict. The group-block-contacts note under that row is new: it is the one
   condition of the three a user cannot see from this screen, and without it the
   modal arrives from nowhere. It reads only when the company config has it on. */
const communications = `
  <q-card v-if="f.complianceTracking" flat bordered style="${CARD}">
    <q-card-section style="${CARD_BODY}">
      <div style="${SECTION_TITLE}">Communications</div>
      <div style="color:var(--ds-color-text); line-height:1.5; max-width:780px; margin:-10px 0 4px;">
        These are your company's Teams Management templates. Switching one off here only stops it
        sending <strong>for this event</strong> — the content itself is edited globally, in
        <strong>Company Settings &rsaquo; Notifications</strong>.
      </div>
      <div style="max-width:780px;">
        <div v-for="(t, ti) in templates" :key="t.key">
          <q-separator v-if="ti" />
          <div class="row items-center no-wrap" style="padding:14px 0; gap:24px;">
            <div style="flex:1; min-width:0;">
              <div style="font-weight:700; color:var(--ds-color-text);">{{ t.title }}</div>
              <div style="font-size:0.875rem; color:var(--ds-color-text-subtle); line-height:1.45; margin-top:2px;">{{ t.desc }}</div>
              <div v-if="t.key === 'compliance-reminder' && recipientsIncludeGroupBlockContacts"
                style="font-size:0.8125rem; color:var(--ds-color-text-subtle); margin-top:6px;">
                <q-icon name="groups" size="15px" class="q-mr-xs" />
                Recipients for {{ tiers }} {{ tiers === 1 ? 'tier' : 'tiers' }} include <strong>group block contacts</strong>.
              </div>
            </div>
            <q-toggle v-model="t.on" color="primary" style="flex:none;" :aria-label="'Send ' + t.title + ' for this event'" />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>`

const registrationManagement = `
  <q-card flat bordered style="${CARD}">
    <q-card-section style="${CARD_BODY}">
      <div style="${SECTION_TITLE}">Registration Management</div>
      <div class="row items-center no-wrap q-gutter-xl">
        <div style="max-width:520px;">
          <div style="font-weight:700; margin-bottom:4px;">Delete All Registrations</div>
          <div style="color:var(--ds-color-text); line-height:1.5;">
            This action will permanently delete <strong>ALL</strong> registration and compliance
            data that has been uploaded for this event. This cannot be reversed.
          </div>
        </div>
        <q-btn outline no-caps color="negative" label="Delete" style="flex:none;" />
      </div>
    </q-card-section>
  </q-card>`

const SLOT = `
  ${eventHeader}
  <div style="padding:24px 32px 56px; background:var(--ds-color-surface-sunken); min-height:100%;">
    <transition name="gbr-fade">
      <div v-if="toast" class="gbr-toast">{{ toast }}</div>
    </transition>

    <div class="row items-center q-mb-md">
      <div style="color:var(--ds-color-background-brand-bold); font-size:1.375rem; font-weight:600;">Registration Settings</div>
      <q-space />
      <q-btn unelevated no-caps color="primary" label="Save" @click="save" />
    </div>
    ${systemAndData}
    ${compliance}
    ${communications}
    ${registrationManagement}
  </div>

  <gbr-conflict-modal v-model="modalOpen" :interval="interval" :tiers="tiers"
    @turn-off-and-save="onTurnOff" @save-anyway="onSaveAnyway" />`

function state({ complianceReminderOn = false, groupBlockRemindersOn = true, recipientsIncludeGroupBlockContacts = true, tiers = 2, interval = DEFAULT_INTERVAL, openOnLoad = false } = {}) {
  const f = reactive({
    entity: 'Team', groupByOrg: false,
    complianceTracking: true, roomBlockRestrictions: false,
    groupBlockTeamRequired: false, reservationTeamRequired: false, hideTeamSelection: false,
    venueDistance: 100, distanceUnit: 'mi',
    complianceCriteria: 'Reservations', complianceFormula: 'Hard Count', complianceAmount: 10,
  })
  const templates = reactive(TM_TEMPLATES.map((t) => ({
    ...t,
    on: t.key === 'welcome' ? true : (t.key === 'compliance-reminder' ? complianceReminderOn : false),
  })))
  const modalOpen = ref(openOnLoad)
  const toast = ref('')
  const groupBlock = reactive({ enabled: groupBlockRemindersOn })

  const show = (msg) => {
    toast.value = msg
    setTimeout(() => { toast.value = '' }, 3200)
  }

  const complianceOn = computed(() => templates.find((t) => t.key === 'compliance-reminder').on)

  function save() {
    const conflict = hasReminderConflict({
      complianceReminderOn: complianceOn.value,
      groupBlockRemindersOn: groupBlock.enabled,
      companyRecipientsIncludeGroupBlockContacts: recipientsIncludeGroupBlockContacts,
    })
    if (conflict) { modalOpen.value = true; return }
    show('Registration settings saved')
  }
  function onTurnOff() {
    groupBlock.enabled = false
    show('Saved · group block reminders turned off for this event')
  }
  function onSaveAnyway() {
    show('Saved · both reminder types left on')
  }

  return {
    evt: EVENT, tab: ref('registration'), f, templates,
    tiers, recipientsIncludeGroupBlockContacts, interval,
    modalOpen, toast, save, onTurnOff, onSaveAnyway,
  }
}

const story = (opts) => gbrPage({
  components: { GbrConflictModal },
  setup: () => state(opts),
  slot: SLOT,
})

/** As Scott demos it: Compliance Reminder off. Switch it on, press **Save**. */
export const Default = story()
Default.storyName = 'Default · turn Compliance Reminder on, then Save'

/** Already on — press **Save** and the modal comes straight up. */
export const ConflictOnSave = story({ complianceReminderOn: true })
ConflictOnSave.storyName = 'Conflict · Save raises the modal'

/** The modal on its own, for reviewing the copy and the two actions. */
export const ModalOpen = story({ complianceReminderOn: true, openOnLoad: true })
ModalOpen.storyName = 'The modal'

/** A 14-day group block interval — the modal states the real schedule, so the
 *  Hoco can judge whether the overlap is worth acting on. */
export const LongerInterval = story({ complianceReminderOn: true, openOnLoad: true, interval: 14, tiers: 4 })
LongerInterval.storyName = 'The modal · 14-day interval, 4 tiers'

/** Third condition false: the company's Compliance Reminder recipients do not
 *  include group block contacts, so there is no overlap and Save just saves. */
export const NoConflictRecipients = story({ complianceReminderOn: true, recipientsIncludeGroupBlockContacts: false })
NoConflictRecipients.storyName = 'No conflict · recipients exclude group block contacts'

/** Second condition false: group block reminders are already off for the event. */
export const NoConflictRemindersOff = story({ complianceReminderOn: true, groupBlockRemindersOn: false })
NoConflictRemindersOff.storyName = 'No conflict · group block reminders already off'

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
import { gbrPage, eventHeader, EVENT, hasReminderConflict, TM_TEMPLATES } from './_gbr'
import GbrConflictModal from './components/GbrConflictModal.vue'
import GbrCommunicationsCard from './components/GbrCommunicationsCard.vue'

export default {
  title: 'Design Requests/GB Reminder Controls/Sept 10/Screens/02 · Registration Settings',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '**PP-44 (GBR-2).** The event Registration tab with the advisory conflict modal wired to Save. Turn *Compliance Reminder* on and press **Save**.\n\nUpdated for Scott\'s 09/09 review: the modal copy is his, it no longer shows the tier count or interval, it has no X, and the recipients line has come off the Communications card. Two of the three trigger conditions are now invisible from this screen, so *No conflict · recipients exclude group block contacts* looks identical to the conflict case — only Save behaves differently.' } },
  },
}

const CARD = 'margin-bottom:20px;'
const CARD_BODY = 'padding:28px 32px;'
const SECTION_TITLE = 'color:var(--ds-color-background-brand-bold); font-size:1.125rem; font-weight:500; margin-bottom:20px;'
const COL = 'max-width:320px;'

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

/* Communications — now the documented component (Components › Registration
   Settings › Communications Card), so the screen and the component story cannot
   drift. Hidden until Compliance Tracking is ticked, exactly like Compliance. */
const communications = `
  <gbr-communications-card v-if="f.complianceTracking" style="display:block; margin-bottom:20px;"
    :templates="templates" />`

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

  <gbr-conflict-modal v-model="modalOpen"
    @turn-off-and-save="onTurnOff" @save-anyway="onSaveAnyway" />`

function state({ complianceReminderOn = false, groupBlockRemindersOn = true, recipientsIncludeGroupBlockContacts = true, openOnLoad = false } = {}) {
  const f = reactive({
    entity: 'Team', groupByOrg: false,
    complianceTracking: true, roomBlockRestrictions: false,
    groupBlockTeamRequired: false, reservationTeamRequired: false, hideTeamSelection: false,
    venueDistance: 100, distanceUnit: 'mi',
    complianceCriteria: 'Reservations', complianceFormula: 'Hard Count', complianceAmount: 10,
  })
  const templates = reactive(TM_TEMPLATES.map((t) => ({
    ...t,
    on: t.key === 'compliance-reminder' ? complianceReminderOn : t.on,
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
    recipientsIncludeGroupBlockContacts,
    modalOpen, toast, save, onTurnOff, onSaveAnyway,
  }
}

const story = (opts) => gbrPage({
  components: { GbrConflictModal, GbrCommunicationsCard },
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

/** Third condition false: the company's Compliance Reminder recipients do not
 *  include group block contacts, so there is no overlap and Save just saves.
 *
 *  Since the recipients line came off the Communications card (Scott, 09/09),
 *  this story now looks identical to *Conflict · Save raises the modal*. The
 *  difference is only in what Save does: here it saves, there it warns. */
export const NoConflictRecipients = story({ complianceReminderOn: true, recipientsIncludeGroupBlockContacts: false })
NoConflictRecipients.storyName = 'No conflict · recipients exclude group block contacts'

/** Second condition false: group block reminders are already off for the event. */
export const NoConflictRemindersOff = story({ complianceReminderOn: true, groupBlockRemindersOn: false })
NoConflictRemindersOff.storyName = 'No conflict · group block reminders already off'

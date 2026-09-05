/** PP-42 · PP-43 — Edit Event › Email Settings.
 *
 *  Scott: "when you click edit event and you go into the email settings
 *  section. There's no current setting for group block reminders, but there
 *  needs to be a setting for that. There should be an on-off toggle, just like
 *  this. And then there should be a setting for interval between reminders."
 *
 *  So the new control is built from the parts already on this screen — a
 *  labelled number field with a Days suffix, an ⓘ, a toggle on the right and a
 *  caption underneath — rather than as a new pattern. Four rows already read
 *  that way; a fifth that didn't would look like a bolt-on.
 *
 *  Open `Current state` alongside `Proposed` to see exactly what is added.
 */
import { reactive, ref, computed } from 'vue'
import { gbrPage, EVENT, makeGroupBlockReminders, reminderTooltip, validateInterval } from './_gbr'

export default {
  title: 'Design Requests/Sept 4/Screens/01 · Edit Event — Email Settings',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '**PP-42 (GBR-1) + PP-43 (GBR-3).** The group block reminder on/off toggle and the interval between reminders, added to the Email Settings section of event settings. Every control is live — flip the toggle, type an invalid interval, watch the ⓘ copy follow the value.' } },
  },
}

/* The sections above and below Email Settings, collapsed exactly as they are in
   Scott's capture. Present so the new control is judged in place. */
const OTHER_SECTIONS_ABOVE = ['Event Details', 'Fees', 'Policies', 'Pickup and Accounting', 'Live Inventory', 'Hotel Information']
const OTHER_SECTIONS_BELOW = ['Data Collection', 'Booking Protection']

const collapsed = (title) => `
  <q-card flat bordered>
    <q-expansion-item label="${title}" header-class="gbr-acc__hdr" expand-icon="expand_more">
      <q-separator />
      <div style="padding:22px 28px; color:var(--ds-color-text-subtle); font-size:0.875rem;">
        Not part of this request — collapsed here as it is in the capture.
      </div>
    </q-expansion-item>
  </q-card>`

/** One Email Settings row: label + ⓘ, a Days field, a toggle, optional caption.
 *  This is the existing anatomy, reproduced verbatim. */
const emailRow = (label, model, toggle, tooltip, caption = '') => `
  <div style="margin-bottom:18px;">
    <div class="gbr-em__label">
      ${label}
      <q-icon name="info" size="15px" class="gbr-em__info">
        <q-tooltip anchor="top middle" self="bottom middle" max-width="330px">${tooltip}</q-tooltip>
      </q-icon>
    </div>
    <div class="row items-center no-wrap" style="gap:14px;">
      <q-input v-model="${model}" outlined dense hide-bottom-space suffix="Days" style="width:170px;" />
      <q-toggle v-model="${toggle}" color="primary" dense />
    </div>
    ${caption ? `<div class="gbr-em__caption">${caption}</div>` : ''}
  </div>`

/* The four rows that exist today, in their production order. */
const EXISTING_ROWS = `
  ${emailRow('Pre Arrival', 'form.preArrival', 'form.preArrivalOn', 'When enabled, a pre-arrival email is sent to guests the number of days prior to check-in specified.')}
  ${emailRow('Reservation Reminder', 'form.resReminder', 'form.resReminderOn', 'When enabled, a reminder is sent to guests who have not yet booked, the number of days prior to the event specified.', 'Sat, 10/17/2026')}
  ${emailRow('Deposit Reminder', 'form.depositReminder', 'form.depositReminderOn', 'When enabled, a reminder is sent the number of days before the deposit is due.')}
  ${emailRow('Hotel User Verification', 'form.hotelVerification', 'form.hotelVerificationOn', 'When enabled, a verification email will be sent to hotel users the number of days prior to the first hotel cutoff specified. This email will verify the user is still involved with your event at the hotel and the level of access they will need.', 'Prior to the first hotel cutoff date')}`

/* PP-42 + PP-43 — the new row.
 *
 * Scott named all three pieces: title "Group Block Reminders", subtext
 * "interval between each reminder", and info text describing the 2-day first
 * send plus the interval. The field is disabled rather than hidden when the
 * toggle is off, matching Pre Arrival, which sits switched off with its field
 * still on screen — hiding it would make the row jump and hide the value the
 * user is about to come back to.
 */
const GROUP_BLOCK_ROW = `
  <div style="margin-bottom:4px;">
    <div class="gbr-em__label">
      Group Block Reminders
      <q-icon name="info" size="15px" class="gbr-em__info">
        <q-tooltip anchor="top middle" self="bottom middle" max-width="330px">{{ tooltip }}</q-tooltip>
      </q-icon>
    </div>
    <div class="row items-center no-wrap" style="gap:14px;">
      <q-input v-model="gbr.interval" outlined dense suffix="Days" style="width:170px;"
        :disable="!gbr.enabled" :error="!!intervalError" :error-message="intervalError"
        :hide-bottom-space="!intervalError" />
      <q-toggle v-model="gbr.enabled" color="primary" dense
        :style="intervalError ? 'margin-bottom:20px;' : ''" />
    </div>
    <div class="gbr-em__caption">Interval between each reminder</div>
  </div>`

const emailSettings = (rows) => `
  <q-card flat bordered>
    <q-expansion-item default-opened label="Email Settings" header-class="gbr-acc__hdr" expand-icon="expand_more">
      <q-separator />
      <div style="padding:24px 28px 26px;">${rows}</div>
    </q-expansion-item>
  </q-card>`

const page = (rows) => `
  <div style="padding:22px 32px 18px; background:var(--ds-color-surface-sunken);">
    <div class="row items-start justify-between q-gutter-md no-wrap">
      <div>
        <div style="font-size:1.5rem; font-weight:700; color:var(--ds-color-text);">Edit Contracted Event</div>
        <div class="text-grey-7" style="margin-top:6px;">All fields marked with <span class="text-negative">*</span> are required.</div>
      </div>
      <div class="row items-center q-gutter-sm no-wrap" style="flex:none;">
        <q-btn outline no-caps color="primary" label="Discard" />
        <q-btn unelevated no-caps color="primary" label="Hotel Sync Settings" />
        <q-btn unelevated no-caps color="primary" label="Save" :disable="!!intervalError" />
      </div>
    </div>
  </div>

  <div style="padding:8px 32px 96px; background:var(--ds-color-surface-sunken); min-height:100%;">
    <div class="column q-gutter-y-md">
      ${OTHER_SECTIONS_ABOVE.map(collapsed).join('')}
      ${emailSettings(rows)}
      ${OTHER_SECTIONS_BELOW.map(collapsed).join('')}
    </div>
  </div>

  <!-- The unsaved-changes bar from the capture. -->
  <div class="gbr-savebar">
    <span>Unsaved Changes</span>
    <q-btn dense unelevated no-caps color="grey-7" label="Discard" />
    <q-btn dense unelevated no-caps color="primary" label="Save" :disable="!!intervalError" />
  </div>`

function state(gbrSeed) {
  const form = reactive({
    preArrival: 0, preArrivalOn: false,
    resReminder: 45, resReminderOn: true,
    depositReminder: 5, depositReminderOn: true,
    hotelVerification: 45, hotelVerificationOn: true,
  })
  const gbr = reactive(makeGroupBlockReminders(gbrSeed))
  return {
    evt: EVENT,
    form,
    gbr,
    tab: ref('hotels'),
    intervalError: computed(() => (gbr.enabled ? validateInterval(gbr.interval) : '')),
    tooltip: computed(() => reminderTooltip(gbr.interval)),
  }
}

/** Today's Email Settings — four rows, no group block control anywhere. */
export const CurrentState = gbrPage({ setup: () => state(), slot: page(EXISTING_ROWS) })
CurrentState.storyName = 'Current state (today)'

/** The proposal: a fifth row carrying both requirements at once. */
export const Proposed = gbrPage({ setup: () => state(), slot: page(EXISTING_ROWS + GROUP_BLOCK_ROW) })
Proposed.storyName = 'Proposed · reminders on'

/** Switched off — no group block reminders send for any block on the event.
 *  The interval is retained and greyed, not cleared. */
export const RemindersOff = gbrPage({ setup: () => state({ enabled: false }), slot: page(EXISTING_ROWS + GROUP_BLOCK_ROW) })
RemindersOff.storyName = 'Proposed · reminders off'

/** A longer hold window — the case in the project description, where a customer
 *  leaving blocks open generates proportionally more reminder email. */
export const LongerInterval = gbrPage({ setup: () => state({ interval: 14 }), slot: page(EXISTING_ROWS + GROUP_BLOCK_ROW) })
LongerInterval.storyName = 'Proposed · 14-day interval'

/** PP-43's validation, pre-tripped: zero, negatives, decimals, text and empty
 *  are all rejected inline, and both Save buttons go disabled while it stands. */
export const InvalidInterval = gbrPage({ setup: () => state({ interval: 0 }), slot: page(EXISTING_ROWS + GROUP_BLOCK_ROW) })
InvalidInterval.storyName = 'Proposed · invalid interval'

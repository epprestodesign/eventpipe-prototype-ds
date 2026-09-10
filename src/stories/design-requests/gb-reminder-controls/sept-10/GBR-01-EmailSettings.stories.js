/** Screens / 01 · Edit Event — Email Settings. PP-42 · PP-43.
 *
 *  Scott: "when you click edit event and you go into the email settings
 *  section. There's no current setting for group block reminders, but there
 *  needs to be a setting for that. There should be an on-off toggle, just like
 *  this. And then there should be a setting for interval between reminders."
 *
 *  The screen is assembled from the same two components documented under
 *  Components › Email Settings — `GbrSettingRow` for the four existing rows and
 *  `GbrReminderControl` for the new one — so the new row is built from the
 *  screen's own anatomy rather than resembling it.
 *
 *  Open `Current state` beside `Proposed` to see exactly what is added.
 */
import { reactive, ref, computed } from 'vue'
import { gbrPage, EVENT, EXISTING_EMAIL_ROWS, makeGroupBlockReminders, validateInterval } from './_gbr'
import GbrSettingRow from './components/GbrSettingRow.vue'
import GbrReminderControl from './components/GbrReminderControl.vue'

export default {
  title: 'Design Requests/GB Reminder Controls/Sept 10/Screens/01 · Edit Event — Email Settings',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
**[PP-42 · GBR-1](https://linear.app/eventpipe/issue/PP-42)** and
**[PP-43 · GBR-3](https://linear.app/eventpipe/issue/PP-43)** — the group block
reminder on/off toggle and the interval between reminders, in the **Email
Settings** section of event settings.

Every control is live: flip the toggle, type an invalid interval, hover the ⓘ
and watch the copy follow the value.

| Story | Shows |
| --- | --- |
| **Current state** | Email Settings as it is today — four rows, no group block control anywhere |
| **Proposed · reminders on** | The fifth row, defaults intact (on, every 3 days) |
| **Proposed · reminders off** | PP-42's off state — the interval greys out but is kept |
| **Proposed · 14-day interval** | The longer hold window from the project description |
| **Proposed · invalid interval** | PP-43 validation, tripped |

The row is appended after *Hotel User Verification*: it is the newest setting
and the least related to the four guest and hotel reminders above it, so the end
is where it disturbs least. See **Concepts › Next Reminder Preview** for the
open question about what happens when the interval changes mid-event.
` } },
  },
}

/* The sections above and below Email Settings, collapsed as in the capture —
   present so the new control is judged in place, not in isolation. */
const SECTIONS_ABOVE = ['Event Details', 'Fees', 'Policies', 'Pickup and Accounting', 'Live Inventory', 'Hotel Information']
const SECTIONS_BELOW = ['Data Collection', 'Booking Protection']

const collapsed = (title) => `
  <q-card flat bordered>
    <q-expansion-item label="${title}" header-class="gbr-acc__hdr" expand-icon="expand_more">
      <q-separator />
      <div style="padding:22px 28px; color:var(--ds-color-text-subtle); font-size:0.875rem;">
        Not part of this request — collapsed here as it is in the capture.
      </div>
    </q-expansion-item>
  </q-card>`

const EXISTING = `
  <gbr-setting-row v-for="r in rows" :key="r.key"
    :label="r.label" :tooltip="r.tooltip" :caption="r.caption || ''"
    v-model="r.value" v-model:enabled="r.enabled" />`

const NEW_ROW = `
  <gbr-reminder-control v-model:interval="gbr.interval" v-model:enabled="gbr.enabled" />`

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
      ${SECTIONS_ABOVE.map(collapsed).join('')}
      <q-card flat bordered>
        <q-expansion-item default-opened label="Email Settings" header-class="gbr-acc__hdr" expand-icon="expand_more">
          <q-separator />
          <div style="padding:24px 28px 26px;">${rows}</div>
        </q-expansion-item>
      </q-card>
      ${SECTIONS_BELOW.map(collapsed).join('')}
    </div>
  </div>

  <div class="gbr-savebar">
    <span>Unsaved Changes</span>
    <q-btn dense unelevated no-caps color="grey-7" label="Discard" />
    <q-btn dense unelevated no-caps color="primary" label="Save" :disable="!!intervalError" />
  </div>`

function state(gbrSeed) {
  const gbr = reactive(makeGroupBlockReminders(gbrSeed))
  return {
    evt: EVENT,
    tab: ref('hotels'),
    rows: reactive(EXISTING_EMAIL_ROWS.map((r) => ({ ...r }))),
    gbr,
    intervalError: computed(() => (gbr.enabled ? validateInterval(gbr.interval) : '')),
  }
}

const components = { GbrSettingRow, GbrReminderControl }
const story = (seed, rows) => gbrPage({ components, setup: () => state(seed), slot: page(rows) })

/** Today: four rows, no group block control anywhere. */
export const CurrentState = story(undefined, EXISTING)
CurrentState.storyName = 'Current state (today)'

/** The proposal — one row carrying both requirements. */
export const Proposed = story(undefined, EXISTING + NEW_ROW)
Proposed.storyName = 'Proposed · reminders on'

/** PP-42's off state. No reminders send for any block on the event; the
 *  confirmation email is unaffected, which the ⓘ says. */
export const RemindersOff = story({ enabled: false }, EXISTING + NEW_ROW)
RemindersOff.storyName = 'Proposed · reminders off'

/** The case from the project description: a customer running a long hold window
 *  who is drowning in reminder email. */
export const LongerInterval = story({ interval: 14 }, EXISTING + NEW_ROW)
LongerInterval.storyName = 'Proposed · 14-day interval'

/** PP-43 validation, pre-tripped. Zero, negatives, decimals, text and empty are
 *  each rejected inline and both Save buttons disable while it stands. */
export const InvalidInterval = story({ interval: 0 }, EXISTING + NEW_ROW)
InvalidInterval.storyName = 'Proposed · invalid interval'

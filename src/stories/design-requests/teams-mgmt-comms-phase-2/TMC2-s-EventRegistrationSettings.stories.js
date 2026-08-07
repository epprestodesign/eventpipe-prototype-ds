/** Teams Mgmt Comms Phase 2 / Screens / Event Registration Settings.
 *  Rebuilt from the production captures in references/080626, then extended
 *  with the Phase 2 requirements that live on this tab: P0-1 (Event-Level
 *  Communications Toggle) and P1-3 (Event-Level Non-Compliance Policy).
 *  Everything else matches production.
 *
 *  A P0-8 send-eligibility block and a SendingBlocked story were removed on
 *  2026-08-07: P0-8 was never asked to be mocked. */
import { ref } from 'vue'
import { tmc2Page, eventHeader } from './_tmc2shell'
import { EVENT, TM_TEMPLATES } from './_tmc2fixtures'
import DsSelect from './components/DsSelect.vue'
import DsInput from './components/DsInput.vue'
import DsField from './components/DsField.vue'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/Screens/Event Registration Settings',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
The event-level **Registration Settings** tab, rebuilt from production
(\`references/080626\`).

Two Phase 2 requirements are now **BUILT** on this tab:

- **[DES-425 · P0-1](https://linear.app/eventpipe/issue/DES-425)** — Event-Level Communications Toggle → the new **Teams Management Communications** card, between *Compliance* and *Restrictions*. One toggle per company-level template, controlling only whether it sends **for this event**. Deliberately toggle-only: there is **no template editing at event level** — content is authored once in *Company Settings › Notifications*.
- **[DES-438 · P1-3](https://linear.app/eventpipe/issue/DES-438)** — Event-Level Non-Compliance Policy → the **Non-Compliance Policy** text area at the bottom of the *Compliance* card, feeding the \`{{noncompliance_policy}}\` merge field. Optional; left blank, the paragraph is omitted from the email entirely.

Both are Teams-Management/STP dependent, so — like *Compliance* itself — they
only appear once **Compliance Tracking** is ticked. Everything else on the
screen still matches production.

**Two states:**

| Story | Shows |
| --- | --- |
| **Default** | Empty event — compliance tracking off, so the conditional fields and the Compliance / Teams Management Communications / Restrictions cards are hidden. Non-compliance policy is empty. |
| **Configured** | Fully set up — every conditional revealed, matching the populated capture, plus a written non-compliance policy and one template switched off for this event. |

### Removed 2026-08-07 — DES-432 · P0-8

This tab previously carried an **event-level send eligibility** block above the
toggles (two gates: hotel cutoff not passed, a booking link live), plus a whole
**SendingBlocked** story showing the failure state with the toggle rows dimmed.

Both are gone. P0-8 was never requested as a mock — it was added to the design
without being asked for, and review asked for it to come out.

The checkboxes are live: ticking *Compliance Tracking* or the two *Team Selection
Required* boxes reveals their dependent fields, so **Default** turns into
**Configured** as you go.
` } } },
}

const CARD = 'margin-bottom:20px;'
const CARD_BODY = 'padding:28px 32px;'
const SECTION_TITLE = 'color:var(--ds-color-background-brand-bold); font-size:1.125rem; font-weight:500; margin-bottom:20px;'
const COL = 'max-width:320px;'

/** A date + time pair, as rendered on this screen ("Time is recorded in EST"). */
const dateTimeField = (label, model) => `
  <div style="${COL} margin-bottom:18px;">
    <div style="font-size:0.8125rem; color:var(--ds-color-text-subtle); margin-bottom:6px;">${label}</div>
    <q-input v-model="${model}" outlined dense hide-bottom-space placeholder="">
      <template #prepend><q-icon name="calendar_today" size="19px" color="grey-7" /></template>
      <template #append><q-icon name="schedule" size="19px" color="grey-7" /></template>
    </q-input>
    <div style="font-size:0.75rem; color:var(--ds-color-text-subtle); margin-top:4px;">Time is recorded in EST</div>
  </div>`

/** Checkbox with the small gray caption above it, as on this screen. */
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
          <ds-select v-model="entity" :options="['Team','Organization']" label="Registered Entity" required placeholder="" />
        </div>
        <q-checkbox v-if="entity" v-model="groupByOrg" label="Group by organization on booking site" color="primary" dense style="margin-top:18px;" />
      </div>

      ${checkRow('Compliance Tracking', 'complianceTracking')}
      ${checkRow('Room Block Restrictions', 'roomBlockRestrictions', 'Caps how many rooms a team may hold at once.')}
      <div v-if="roomBlockRestrictions">${dateTimeField('Restriction Expiration', 'restrictionExpiration')}</div>

      ${checkRow('Group Block Booking - Team Selection Required', 'groupBlockTeamRequired', 'Bookers must pick a team when creating a group block.')}
      <div v-if="groupBlockTeamRequired">${dateTimeField('Registration Requirement Expiration For Group Blocks', 'groupBlockExpiration')}</div>

      ${checkRow('Reservation Booking - Team Selection Required', 'reservationTeamRequired', 'Bookers must pick a team when making a reservation.')}
      <div v-if="reservationTeamRequired">${dateTimeField('Registration Requirement Expiration For Reservations', 'reservationExpiration')}</div>

      ${checkRow('Hide Team Selection from Booking Site', 'hideTeamSelection')}

      <div style="font-weight:700; color:var(--ds-color-text); margin:22px 0 8px;">Registration Event(s)</div>
      <a href="#" class="text-primary" style="text-decoration:none; font-weight:500;" @click.prevent>+ Add A Registration System Event ID</a>
    </q-card-section>
  </q-card>`

const compliance = `
  <q-card v-if="complianceTracking" flat bordered style="${CARD}">
    <q-card-section style="${CARD_BODY}">
      <div style="${SECTION_TITLE}">Compliance</div>
      <div style="display:flex; align-items:flex-end; gap:8px; max-width:260px; margin-bottom:18px;">
        <ds-input v-model="venueDistance" label="Local Team Venue Distance" type="number" style="flex:1;" />
        <div style="width:96px;"><ds-select v-model="distanceUnit" :options="['mi','km']" /></div>
      </div>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4"><ds-select v-model="complianceCriteria" :options="['Room Nights','Reservations']" label="Compliance Criteria" required /></div>
        <div class="col-12 col-md-4"><ds-select v-model="complianceFormula" :options="['Hard Count','Percentage']" label="Formula" required /></div>
        <div class="col-12 col-md-4"><ds-input v-model="complianceAmount" type="number" label="Amount" required /></div>
      </div>

      <!-- DES-438 / P1-3 — Event-Level Non-Compliance Policy. Free text, optional.
           The hint carries the merge-field name, built in JS (mergeHint) so no
           mustache syntax is ever parsed by the Vue compiler. -->
      <div style="max-width:660px; margin-top:26px;">
        <ds-field label="Non-Compliance Policy" :hint="mergeHint">
          <q-input v-model="noncompliancePolicy" type="textarea" outlined rows="4" hide-bottom-space
            placeholder="e.g. Teams that have not met their room night requirement by the cutoff date may forfeit their schedule placement." />
        </ds-field>
      </div>
    </q-card-section>
  </q-card>`

/* ---------------------------------------------------------------------------
 * DES-425 / P0-1 — Event-Level Communications Toggle.
 *
 * Toggle-only by design: the company owns the template content, the event owns
 * only whether it sends. So NO edit buttons, no preview, no per-template config
 * here — this card stays deliberately lighter than the company-level
 * Notification Preferences screen. Teams-Management/STP dependent, so it hangs
 * off complianceTracking exactly like the Compliance card.
 */

const eventComms = `
  <q-card v-if="complianceTracking" flat bordered style="${CARD}">
    <q-card-section style="${CARD_BODY}">
      <div style="${SECTION_TITLE}">Teams Management Communications</div>

      <div style="color:var(--ds-color-text); line-height:1.5; max-width:760px; margin:-10px 0 4px;">
        These are your company's Teams Management templates. Switching one off here only stops it
        sending <strong>for this event</strong> — the content itself is edited once, in
        <strong>Company Settings &rsaquo; Notifications</strong>.
      </div>
      <div style="font-size:0.8125rem; color:var(--ds-color-text-subtle); margin-bottom:18px;">
        New events inherit the company-level on/off state.
      </div>

      <div style="max-width:760px;">
        <div v-for="(t, ti) in tmTemplates" :key="t.key">
          <q-separator v-if="ti" />
          <div class="row items-center no-wrap" style="padding:14px 0; gap:24px;">
            <div style="flex:1; min-width:0;">
              <div style="font-weight:700; color:var(--ds-color-text);">{{ t.title }}</div>
              <div style="font-size:0.875rem; color:var(--ds-color-text-subtle); line-height:1.45; margin-top:2px;">
                {{ t.desc }}
              </div>
            </div>
            <q-toggle v-model="t.eventOn" color="primary" style="flex:none;"
              :aria-label="'Send ' + t.title + ' for this event'" />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>`

const restrictions = `
  <q-card v-if="roomBlockRestrictions" flat bordered style="${CARD}">
    <q-card-section style="${CARD_BODY}">
      <div style="${SECTION_TITLE}">Restrictions</div>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4"><ds-select v-model="restrictionCriteria" :options="['Room Nights Per Night','Room Nights','Reservations']" label="Restriction Criteria" required /></div>
        <div class="col-12 col-md-4"><ds-select v-model="restrictionFormula" :options="['Hard Count','Percentage']" label="Formula" required /></div>
        <div class="col-12 col-md-4"><ds-input v-model="restrictionAmount" type="number" label="Amount" required /></div>
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

const body = `
  ${eventHeader}
  <div style="padding:24px 32px 56px; background:var(--ds-color-surface-sunken); min-height:100%;">
    <div class="row items-center q-mb-md">
      <div style="color:var(--ds-color-background-brand-bold); font-size:1.375rem; font-weight:600;">Registration Settings</div>
      <q-space />
      <q-btn unelevated no-caps color="primary" label="Save" />
    </div>
    ${systemAndData}
    ${compliance}
    ${eventComms}
    ${restrictions}
    ${registrationManagement}
  </div>`

/* The merge-field name has to reach the template as DATA, never as literal
 * mustache characters — Vue's compiler would close the interpolation early and
 * the build would fail. Built by concatenation for the same reason. */
const MERGE_FIELD = '{' + '{' + 'noncompliance_policy' + '}' + '}'
const MERGE_HINT = 'Optional. When filled, this text is inserted into Teams Management emails as its own paragraph via the '
  + MERGE_FIELD + ' merge field. Leave it blank and that section is omitted from the email entirely.'

const state = (over = {}) => () => {
  return {
    tab: ref('registration'),
    entity: ref(over.entity ?? null),
    groupByOrg: ref(over.groupByOrg ?? false),
    complianceTracking: ref(over.complianceTracking ?? false),
    roomBlockRestrictions: ref(over.roomBlockRestrictions ?? false),
    restrictionExpiration: ref(over.restrictionExpiration ?? ''),
    groupBlockTeamRequired: ref(over.groupBlockTeamRequired ?? false),
    groupBlockExpiration: ref(over.groupBlockExpiration ?? ''),
    reservationTeamRequired: ref(over.reservationTeamRequired ?? false),
    reservationExpiration: ref(over.reservationExpiration ?? ''),
    hideTeamSelection: ref(over.hideTeamSelection ?? false),
    venueDistance: ref(over.venueDistance ?? 70),
    distanceUnit: ref(over.distanceUnit ?? 'mi'),
    complianceCriteria: ref(over.complianceCriteria ?? 'Room Nights'),
    complianceFormula: ref(over.complianceFormula ?? 'Hard Count'),
    complianceAmount: ref(over.complianceAmount ?? 20),
    restrictionCriteria: ref(over.restrictionCriteria ?? 'Room Nights Per Night'),
    restrictionFormula: ref(over.restrictionFormula ?? 'Hard Count'),
    restrictionAmount: ref(over.restrictionAmount ?? 10),
    // DES-438 / P1-3
    noncompliancePolicy: ref(over.noncompliancePolicy ?? ''),
    mergeHint: MERGE_HINT,
    // DES-425 / P0-1 — copies, so toggling in one story never mutates the fixture.
    tmTemplates: ref(TM_TEMPLATES.map((t) => ({ ...t }))),
    evt: EVENT,
  }
}

/** Empty event — nothing configured yet. */
export const Default = tmc2Page({
  active: 'events',
  components: { DsSelect, DsInput, DsField },
  setup: state(),
  slot: body,
})
Default.parameters = { layout: 'fullscreen' }

const CONFIGURED = {
  entity: 'Team',
  groupByOrg: true,
  complianceTracking: true,
  roomBlockRestrictions: true,
  groupBlockTeamRequired: true,
  reservationTeamRequired: true,
  noncompliancePolicy: 'Teams that have not met their room night requirement by the final hotel cutoff date will be invoiced the difference at the prevailing event rate. Contact your event manager before the cutoff if your travel plans change.',
}

/** Fully configured event — every conditional field revealed. */
export const Configured = tmc2Page({
  active: 'events',
  components: { DsSelect, DsInput, DsField },
  setup: state({ ...CONFIGURED }),
  slot: body,
})
Configured.parameters = { layout: 'fullscreen' }

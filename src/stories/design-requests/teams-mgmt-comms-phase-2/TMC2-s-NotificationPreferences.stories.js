/** Teams Mgmt Comms Phase 2 / Screens / Notification Preferences.
 *
 *  One screen, two views: `view` swaps between the preferences list and the
 *  template editor, so Edit and "Go Back to Preferences" are a real round trip
 *  rather than two dead ends in separate stories.
 *
 *  Everything renders against the shared Phase 2 tenant (see _tmc2fixtures):
 *  Traveloc / Mike Addesa.
 */
import { ref, computed, watchEffect } from 'vue'
import { tmc2Page } from './_tmc2shell'
import {
  COMPANY, COMPANY_SECTIONS_TOP, COMPANY_RECON, COMPANY_SECTIONS_BOTTOM,
  FROM_ADDRESS_OPTIONS, FROM_ADDRESS_RESOLVED, EVENT,
} from './_tmc2fixtures'
import {
  companyHeader, goBackLink, colHeaders, fromAddressSectionStrip, unsavedChangesBar,
  addReminderRow, templateActions,
  LIST_TITLE_STYLE, COL_SEND, COL_TMPL, COL_HEAD,
} from './_tmc2'
import {
  rowActions, testSendNote, previewDialog, testSendDialog, addReminderDialog,
  emailSettings, editorView, useTemplateEditor,
} from './_tmc2np'
import { addedTemplates, addTemplate, removeTemplate } from './_tmc2store'
import contentData from './tmc2-content.json'
import DsListItem from './components/DsListItem.vue'
import DsSectionHeader from './components/DsSectionHeader.vue'
import DsInfoGrid from './components/DsInfoGrid.vue'
import DsConfirmDialog from './components/DsConfirmDialog.vue'
import DsField from './components/DsField.vue'
import DsInput from './components/DsInput.vue'
import DsSelect from './components/DsSelect.vue'
import DsRichTextEditor from './components/DsRichTextEditor.vue'
// Vue + Quasar (TypeScript) reference source, shown in the "Implementation" panel.
import composableSrc from './app/notifications/useNotificationPreferences.ts?raw'
import rowSrc from './app/notifications/NotificationRow.vue?raw'
import sectionSrc from './app/notifications/NotificationSection.vue?raw'
import pageSrc from './app/notifications/NotificationsPreferencesPage.vue?raw'
import recurrenceSrc from './app/compliance-reminder/useRecurrence.ts?raw'
import recurrenceFieldSrc from './app/compliance-reminder/RecurrenceField.vue?raw'
import reminderSettingsSrc from './app/compliance-reminder/ReminderSettings.vue?raw'
import editorSrc from './app/compliance-reminder/ComplianceReminderEditor.vue?raw'

const SECTIONS = contentData.sections

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/Screens/Notification Preferences',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
Company Settings → **Notifications**, for the Teams Management comms templates.

One screen with two views: the list drills into the template editor, and the
editor comes back. **Click Edit on any template** to move between them.

| View | What it is |
| --- | --- |
| **Preferences list** | Every notification, grouped by section, with a Send-Email toggle and an Edit action — plus the section's From/Reply config and the *Add Compliance Reminder* affordance |
| **Template editor** | The drill-in: content with merge fields, BCC, *Preview email* in the header, and **Email Settings** (audience for every template, scheduling only for reminders) |

**Nothing on the list takes effect until Save.** An unsaved-changes bar appears
whenever anything differs from the last save — a checkbox, the From/Reply
address, a reminder added or deleted — and a reminder does not reach Event
Registration Settings as an event-level toggle until you press Save.

**Phase 2 requirements on this screen**

- **DES-429 · P0-5 — From/Reply address.** Set once for *all* Teams Management
  emails: Event Manager, Event Customer Support Contact, or a custom *Other*
  address. Deliberately **not per template** and with **no event-level
  override** — the event manager and support contact already vary by event,
  which supplies the flexibility. See the section below for where it lives and
  why.
- **DES-428 · P0-4 — N compliance reminders.** *+ Add Compliance Reminder* opens a
  minimal Name/Description dialog and appends a template that starts as a **copy
  of the standard Compliance Reminder**, marked Custom. Unlimited — the fixed
  early/mid/late model is gone. User-added templates can be **deleted** from the
  row menu or from the editor header; seeded ones can only be reverted. Fixed
  templates sort above reminders under quiet group labels, since the reminder
  group is the one that grows.
- **DES-431 · P0-7 — Conditional configuration.** Every template gets Compliance
  Statuses + Recipients; **only** \`compliance-reminder\` templates get the
  Scheduling block (begin/end days, recurrence). Driven off the row's \`type\`.
- **DES-436 · P1-1 — Preview + test send.** *Preview* on any row opens the email
  in a modal, rendered from the **same fragment as First-Time Setup › Default
  Emails**, with **Show merge fields** to flip between the sent email and the
  template source. The row is matched to a seeded template by \`type\`, so custom
  reminders preview as the Compliance Reminder they were copied from. **Send test
  email** — from the row menu or from the preview modal footer — asks for one
  address and sends there only. Test sends are deliberately **not written to a
  team's Communications Log**; that log is the record of automated sends
  (DES-433).
- **DES-435 · P0-11 — Locked upsell** (\`Locked Upsell\` story): grayed-out Teams
  Management section, account-manager pitch, and a *concept* treatment for the
  locked **Compliance** nav entry that routes to an in-app value-prop page.

### DES-429 · P0-5 — where the From/Reply config lives

It sits **inside the Teams Management section it configures**, as a single row,
and reports the *role* rather than a concrete mailbox — *Event Manager —
resolved per event when the email sends*. That is the honest answer: the first
two options are per-event roles, so no single address is knowable here. *Other*
is a literal address and still resolves normally.

An earlier version put it in its own card above every section and named a
concrete mailbox. Review on 2026-08-07 called it bloated, called the resolved
address wrong, and asked for it to be tied to its section. The strip is
deliberately a **generic per-section config slot**, so *Guests* and *Hotels*
sections fill the same place later rather than each adding another free-floating
card to the top of the page.

Template copy is editable in the **Controls** panel and lives in
\`tmc2-content.json\`.

### Removed 2026-08-07 — DES-432 · P0-8

**Email Settings** previously carried a *One email per team per day* note with
the priority order. P0-8 was never requested as a mock, so it is gone.

> The **Publish content** toolbar addon is intentionally not wired to this fork —
> its arg keys are prefixed \`tmc2\` so it cannot commit into DES-207's
> \`des207-content.json\`. Controls edits are session-only.
` } } },
}

const notice = `
  <div v-if="noticeShown" style="display:flex; align-items:flex-start; gap:12px; padding:16px 20px; margin-bottom:40px;
    background:var(--ds-color-background-info); border:1px solid var(--ds-color-background-info-bold); border-radius:var(--ds-radius-md);">
    <q-icon name="info" color="primary" size="22px" style="margin-top:1px; flex:none;" />
    <div style="flex:1;">
      <div class="text-weight-bold text-grey-9">New notification section</div>
      <div class="text-grey-8" style="margin-top:2px;">For day one, this section only supports <b>Teams Management</b> notifications. Over time, more email templates from across the system will come online here.</div>
    </div>
    <q-btn flat no-caps color="primary" label="Dismiss" style="flex:none; align-self:center;" @click="noticeShown = false" />
  </div>`


/* ---- DES-429 · P0-5 — section-level config strip.
 *
 * Review of the earlier card: too bloated, showed a concrete resolved
 * address it cannot actually know, and "feels independent of the Teams
 * Management Communications section ... over time there will be more sections
 * like Guests, Hotels, and each of those may have specific config parameters".
 *
 * So this is deliberately built as a GENERIC per-section config slot, not a
 * one-off for From/Reply: it renders inside the section it configures, directly
 * under the section header, and any future section can fill the same slot with
 * its own parameters. One row, no heading, no badge, no prose block.
 *
 * It states that the address is resolved per event rather than naming one,
 * which is the honest answer — Event Manager and Customer Support Contact both
 * vary by event, so no single address is correct here. */
const sectionConfigStrip = `
  <template v-if="s.name === 'Teams Management'">
    ${fromAddressSectionStrip}
  </template>`

/* ---- View 1: the preferences list ---- */
const listView = `
  <div style="padding:40px 32px; background:var(--ds-color-surface-sunken); min-height:100%;">
    ${notice}
    <ds-section-header title="Notifications Preferences" subtitle="Manage all of the notifications sent to your users." variant="accent" />
    <div style="display:flex; flex-direction:column; gap:16px; margin-top:16px;">
      <q-card flat bordered v-for="s in sections" :key="s.name">
        <q-expansion-item :default-opened="s.open" :label="s.name" header-class="text-primary text-weight-bold">
          <q-separator />
          ${sectionConfigStrip}
          ${colHeaders}
          <template v-for="(it, i) in s.items" :key="it.id">
            <q-separator v-if="i > 0" />
            <!-- DES-428 · P0-4 — the two groups are labelled the same quiet way:
                 the closed set that ships with every account, then the
                 open-ended reminders a Hoco builds. The split is about which
                 group can grow, which is what "Standard" vs "Compliance
                 Reminders" says. Small labels, not headings or second cards. -->
            <div v-if="startsFixedGroup(s, i)"
              style="padding:14px 28px 2px; font-size:0.75rem; font-weight:600; letter-spacing:0.04em;
                     text-transform:uppercase; color:var(--ds-color-text-subtle);">
              Standard Emails
            </div>
            <div v-if="startsReminderGroup(s, i)"
              style="padding:14px 28px 2px; font-size:0.75rem; font-weight:600; letter-spacing:0.04em;
                     text-transform:uppercase; color:var(--ds-color-text-subtle);">
              Compliance Reminders
            </div>
            <div style="padding:8px 28px;">
              <ds-list-item :subtitle="it.desc" :bordered="false">
                <template #title>
                  <span class="row items-center q-gutter-sm">
                    <strong style="${LIST_TITLE_STYLE}">{{ it.title }}</strong>
                    <q-badge v-if="it.custom" color="primary" class="q-px-sm q-py-xs">Custom</q-badge>
                  </span>
                </template>
                <template #trailing>
                  <div class="row items-center no-wrap">
                    <div style="${COL_SEND}">
                      <q-checkbox :model-value="it.send" @update:model-value="onToggleSend(it, $event)" :disable="it.forced" color="primary"><q-tooltip v-if="it.forced">Required — always sent</q-tooltip></q-checkbox>
                    </div>
                    <div style="${COL_TMPL}">
                      ${rowActions}
                    </div>
                  </div>
                </template>
              </ds-list-item>
            </div>
          </template>
          <template v-if="s.name === 'Teams Management'">
            <q-separator />
            ${addReminderRow('openAdd')}
          </template>
        </q-expansion-item>
      </q-card>
    </div>

    ${addReminderDialog}
    ${unsavedChangesBar}

    <ds-confirm-dialog v-model="revertOpen" title="Revert to default template?" destructive
      confirm-label="Revert to default" cancel-label="Keep custom" @confirm="confirmRevert">
      <template #body>
        This replaces <strong>{{ revertTarget?.title }}</strong> with the EventPipe default
        template. Your company's custom changes will be <strong>permanently discarded</strong>
        and can't be recovered.
      </template>
    </ds-confirm-dialog>
  </div>`

const generalTab = `
  <div style="padding:40px 32px; background:var(--ds-color-surface-sunken); min-height:100%;">
    <div v-for="s in settingsSections" :key="s.title" style="margin-bottom:20px;">
      <ds-section-header :title="s.title" variant="accent" />
      <q-card flat bordered style="margin-top:12px;"><q-card-section style="padding:20px 28px;"><ds-info-grid :items="s.items" layout="stacked" min-col-width="260px" /></q-card-section></q-card>
    </div>
  </div>`

const body = `
  ${companyHeader}
  <div v-show="tab === 'notifications'">
    <div v-if="view === 'list'">${listView}</div>
    <div v-else>${editorView}</div>
    <!-- Both dialogs live outside the view switch so a test send is reachable
         from the list, the preview modal and the editor (DES-436 · P1-1). -->
    ${previewDialog}
    ${testSendDialog}
  </div>
  <div v-show="tab === 'general'">${generalTab}</div>`

// Native Storybook Controls: Header + Subtext per template, grouped by section.
// Keys are prefixed `tmc2` so the DES-207 "Publish content" addon does not match
// this story and cannot commit into des207-content.json.
const TEMPLATE_ARG_TYPES = {}
const TEMPLATE_ARGS = {}
SECTIONS.forEach((s, si) => {
  s.items.forEach((it, ii) => {
    const base = `tmc2s${si}i${ii}`
    TEMPLATE_ARG_TYPES[`${base}_title`] = { name: `${it.title} · Header`, control: 'text', table: { category: s.name } }
    TEMPLATE_ARG_TYPES[`${base}_desc`] = { name: `${it.title} · Subtext`, control: 'text', table: { category: s.name } }
    TEMPLATE_ARGS[`${base}_title`] = it.title
    TEMPLATE_ARGS[`${base}_desc`] = it.desc
  })
})
/* Template `type` (DES-431 · P0-7) — the content file carries copy only, so the
 * type is attached here, once, by seed position. Matches the vocabulary in
 * TM_TEMPLATES: 'welcome' | 'compliance-reminder' | 'previously-compliant'.
 * Only 'compliance-reminder' gets the Scheduling block. Resolved from the
 * ORIGINAL titles so a Controls rename never changes a template's behaviour. */
const TM_SECTION = 'Teams Management'
const SEED_TYPE_BY_TITLE = {
  'STP - Welcome Email': 'welcome',
  'STP - Previously Compliant Notice': 'previously-compliant',
  'STP - Compliance Achieved': 'notice',
}
const SEED_TYPES = SECTIONS.map((s) =>
  s.items.map((it) => (s.name === TM_SECTION ? (SEED_TYPE_BY_TITLE[it.title] || 'compliance-reminder') : 'other')))

const isReminder = (it) => it.type === 'compliance-reminder'

function sectionsFromArgs(args = {}, added = [], sendEdits = {}) {
  const withEdit = (it) => (sendEdits[it.id] === undefined ? it : { ...it, send: sendEdits[it.id] })
  return SECTIONS.map((s, si) => {
    const seeded = s.items.map((it, ii) => withEdit({
      ...it,
      id: `s${si}i${ii}`,
      type: SEED_TYPES[si][ii],
      title: args[`tmc2s${si}i${ii}_title`] ?? it.title,
      desc: args[`tmc2s${si}i${ii}_desc`] ?? it.desc,
    }))
    if (s.name !== TM_SECTION) return { ...s, items: seeded }
    /* DES-428 · P0-4 — fixed-type templates first, reminders after.
     * Welcome, Previously Compliant and Compliance Achieved are a closed set:
     * exactly one of each, forever. Compliance Reminders are open-ended and
     * grow, so they sort last — otherwise every reminder a Hoco adds lands in
     * among the fixed templates and the order reads as arbitrary.
     * `added` is spread by reference, not copied, so a Send-Email toggle on a
     * user-added row survives a Controls edit rebuilding the list. */
    return {
      ...s,
      items: [
        ...seeded.filter((it) => !isReminder(it)),
        ...seeded.filter(isReminder),
        ...added.map(withEdit),
      ],
    }
  })
}

const COMPONENTS = { DsListItem, DsSectionHeader, DsInfoGrid, DsConfirmDialog, DsField, DsInput, DsSelect, DsRichTextEditor }
const SETTINGS_SECTIONS = [...COMPANY_SECTIONS_TOP, { title: 'Reconciliation & Invoice Settings', items: COMPANY_RECON }, ...COMPANY_SECTIONS_BOTTOM]

export const NotificationPreferences = tmc2Page({
  active: 'none',
  components: COMPONENTS,
  setup: (args) => {
    /* Group-level From/Reply address (DES-429 · P0-5) — one value for every
     * Teams Management email; no per-template and no per-event override.
     * Declared here, above the save model, because `dirty` compares against it. */
    const fromAddress = ref('Event Manager')
    const fromAddressCustom = ref('')
    const savedFrom = ref(fromAddress.value)
    const savedFromCustom = ref(fromAddressCustom.value)

    /* SAVE MODEL — nothing here takes effect until Save.
     *
     * The shared store (_tmc2store.js) holds only SAVED templates, because that
     * store is what Event Registration Settings reads: a reminder must not turn
     * up as an event-level toggle while it is still an unsaved edit. So adds and
     * deletes are staged locally and only applied to the store on Save, and
     * Discard simply drops the staging.
     *
     * `sendEdits` holds Send-Email changes by row id rather than mutating the
     * row, so a Controls edit rebuilding the list cannot lose them and Discard
     * is a single assignment. */
    const pendingAdds = ref([])
    const pendingDeletes = ref([])
    const sendEdits = ref({})
    let stagedSeq = 0

    // Saved templates minus anything staged for deletion, plus anything staged
    // for addition — what the list should show right now.
    const visibleAdded = computed(() => [
      ...addedTemplates.value.filter((t) => !pendingDeletes.value.includes(t.id)),
      ...pendingAdds.value,
    ])

    // args is reactive in Storybook's Vue renderer — rebuild when a control changes.
    const sections = ref([])
    watchEffect(() => {
      sections.value = sectionsFromArgs(args, visibleAdded.value, sendEdits.value)
    })

    const dirty = computed(() => pendingAdds.value.length > 0
      || pendingDeletes.value.length > 0
      || Object.keys(sendEdits.value).length > 0
      || fromAddress.value !== savedFrom.value
      || fromAddressCustom.value !== savedFromCustom.value)

    const saveChanges = () => {
      pendingAdds.value.forEach((t) => addTemplate({
        title: t.title, desc: t.desc, baseTitle: t.baseTitle,
      }))
      pendingDeletes.value.forEach((id) => {
        const target = addedTemplates.value.find((t) => t.id === id)
        if (target) removeTemplate(target)
      })
      // Send-Email edits are the prototype's stand-in for persistence: fold them
      // into the store objects that survive, so they read back the same way.
      addedTemplates.value.forEach((t) => {
        if (sendEdits.value[t.id] !== undefined) t.send = sendEdits.value[t.id]
      })
      pendingAdds.value = []
      pendingDeletes.value = []
      sendEdits.value = {}
      savedFrom.value = fromAddress.value
      savedFromCustom.value = fromAddressCustom.value
      $q.notify({
        message: 'Changes saved',
        caption: 'Teams Management notification preferences updated',
        icon: 'check_circle',
        color: 'positive',
        position: 'bottom-right',
        timeout: 2400,
      })
    }

    const discardChanges = () => {
      pendingAdds.value = []
      pendingDeletes.value = []
      sendEdits.value = {}
      fromAddress.value = savedFrom.value
      fromAddressCustom.value = savedFromCustom.value
    }

    /* The editor, its dialogs and everything behind them come from the shared
     * module, so this screen and First-Time Setup cannot behave differently.
     * What is passed in is the part that IS different: here, add and delete
     * stage into the local pending lists rather than touching the store. */
    const editor = useTemplateEditor({
      baseReminderTitle: () => {
        const tm = sections.value.find((sec) => sec.name === TM_SECTION)
        const base = tm && tm.items.find((it) => it.type === 'compliance-reminder' && !it.userAdded)
        return base ? base.title : 'the standard Compliance Reminder'
      },
      onConfirmAdd: ({ name, desc, baseTitle }) => {
        stagedSeq += 1
        pendingAdds.value = [...pendingAdds.value, {
          id: 'tm-staged-' + stagedSeq,
          key: 'tm-staged-' + stagedSeq,
          title: name,
          desc: desc || 'Reminds non-compliant teams about their Stay-to-Play requirement.',
          baseTitle,
          type: 'compliance-reminder',
          send: true,
          forced: false,
          custom: true,
          userAdded: true,
        }]
      },
      onConfirmDelete: (target) => {
        if (pendingAdds.value.some((t) => t.id === target.id)) {
          pendingAdds.value = pendingAdds.value.filter((t) => t.id !== target.id)
        } else {
          pendingDeletes.value = [...pendingDeletes.value, target.id]
        }
      },
    })
    const $q = editor.$q
    const onToggleSend = (it, value) => {
      // Staged, not applied. Recorded even when it returns to its original
      // value: the bar is about "you touched this", and un-toggling back is
      // what Discard is for.
      //
      // No toast. It fired on every click, and once the unsaved-changes bar
      // existed the toast was also wrong — "Send email turned off" claims
      // something happened, when nothing has until Save. The bar is the honest
      // feedback, and the checkbox itself shows the new state.
      sendEdits.value = { ...sendEdits.value, [it.id]: value }
    }

    /* DES-428 · P0-4 — true on the first Compliance Reminder in the Teams
     * Management section, which is where the group label goes. Derived from
     * position rather than stamped on the items so the row objects stay
     * referentially intact for Send-Email toggles. */
    const startsReminderGroup = (s, i) => s.name === TM_SECTION
      && s.items[i].type === 'compliance-reminder'
      && (i === 0 || s.items[i - 1].type !== 'compliance-reminder')
    // Its counterpart on the closed set above it. Written symmetrically rather
    // than as `i === 0` so it stays correct if the sort order ever changes.
    const startsFixedGroup = (s, i) => s.name === TM_SECTION
      && s.items[i].type !== 'compliance-reminder'
      && (i === 0 || s.items[i - 1].type === 'compliance-reminder')

    return {
      ...editor,
      company: COMPANY, settingsSections: SETTINGS_SECTIONS,
      sections, tab: ref('notifications'), noticeShown: ref(true),
      fromAddress, fromAddressCustom, resolvedFrom, fromDisplay, fromOptions: FROM_ADDRESS_OPTIONS,
      // emailPaper's contract: the From line reports the role, not a mailbox.
      fromLine: fromDisplay, eventName: EVENT.name,
      dirty, saveChanges, discardChanges, onToggleSend,
      startsReminderGroup, startsFixedGroup,
    }
  },
  slot: body,
})


const IMPLEMENTATION = {
  intro: 'Vue 3 + Quasar (TypeScript) reference — the real components behind this screen. Page → Section → Row for the list; Editor → ReminderSettings → RecurrenceField for the drill-in.',
  files: [
    { name: 'useNotificationPreferences.ts', lang: 'typescript', code: composableSrc },
    { name: 'NotificationRow.vue', lang: 'html', code: rowSrc },
    { name: 'NotificationSection.vue', lang: 'html', code: sectionSrc },
    { name: 'NotificationsPreferencesPage.vue', lang: 'html', code: pageSrc },
    { name: 'useRecurrence.ts', lang: 'typescript', code: recurrenceSrc },
    { name: 'RecurrenceField.vue', lang: 'html', code: recurrenceFieldSrc },
    { name: 'ReminderSettings.vue', lang: 'html', code: reminderSettingsSrc },
    { name: 'ComplianceReminderEditor.vue', lang: 'html', code: editorSrc },
  ],
}

NotificationPreferences.parameters = { layout: 'fullscreen', implementation: IMPLEMENTATION }
NotificationPreferences.argTypes = TEMPLATE_ARG_TYPES
NotificationPreferences.args = TEMPLATE_ARGS

/* ---- Locked / upsell: company without Teams Management (DES-435 · P0-11) ---- */
const upsellBanner = `
  <div style="display:flex; align-items:flex-start; gap:12px; padding:16px 20px;
    background:var(--ds-color-background-info); border:1px solid var(--ds-color-background-info-bold); border-radius:var(--ds-radius-md);">
    <q-icon name="workspace_premium" color="primary" size="22px" style="margin-top:1px; flex:none;" />
    <div style="flex:1;">
      <div class="text-weight-bold text-grey-9">Unlock Teams Management notifications</div>
      <div class="text-grey-8" style="margin-top:2px;">Your plan doesn't include <b>Teams Management</b> yet. Add it to send automated Stay-to-Play compliance reminders, escalations, and welcome emails to your teams — the templates below preview what you'll be able to configure.</div>
    </div>
    <q-btn unelevated no-caps color="primary" label="Contact Account Manager" style="flex:none; align-self:center;" />
  </div>`

const lockedSection = `
  <div style="position:relative;">
    <q-card flat bordered style="opacity:0.6; pointer-events:none;">
      <q-expansion-item default-opened label="Teams Management" header-class="text-grey-7 text-weight-bold">
        <q-separator />
        ${colHeaders}
        <template v-for="(it, i) in locked" :key="i">
          <q-separator v-if="i > 0" />
          <div style="padding:8px 28px;">
            <ds-list-item :subtitle="it.desc" :bordered="false">
              <template #title><strong style="${LIST_TITLE_STYLE} color:var(--ds-color-text-subtle);">{{ it.title }}</strong></template>
              <template #trailing>
                <div class="row items-center no-wrap">
                  <div style="${COL_SEND}"><q-checkbox :model-value="it.send" disable color="primary" /></div>
                  <div style="${COL_TMPL}"><q-btn unelevated no-caps color="primary" label="Edit" disable /></div>
                </div>
              </template>
            </ds-list-item>
          </div>
        </template>
      </q-expansion-item>
    </q-card>
    <q-badge color="grey-7" class="q-px-sm q-py-xs" style="position:absolute; top:14px; right:18px;">
      <q-icon name="lock" size="13px" class="q-mr-xs" />Locked
    </q-badge>
  </div>`

/* Concept, low priority and being developed async: companies without Teams
 * Management still see a Compliance nav link, but it lands on an in-app
 * marketing / value-prop page instead of the compliance workspace. */
const lockedComplianceConcept = `
  <q-card flat bordered style="border-style:dashed;">
    <q-card-section style="padding:20px 28px;">
      <div class="row items-center no-wrap q-gutter-sm q-mb-xs">
        <q-icon name="fact_check" color="grey-7" size="20px" style="flex:none;" />
        <div class="text-weight-bold text-grey-9">Locked "Compliance" nav entry</div>
        <q-badge color="warning" text-color="dark" class="q-px-sm q-py-xs" style="flex:none;">Concept · in development</q-badge>
      </div>
      <div class="text-grey-8" style="font-size:0.875rem; line-height:1.5; max-width:840px;">
        Companies without Teams Management still see <b>Compliance</b> in the left nav. Rather
        than the compliance workspace it routes to an in-app marketing page explaining
        Stay-to-Play tracking and automated team comms, carrying the same
        <b>Contact Account Manager</b> call to action as the banner above. The treatment below is
        a placeholder — the value-prop page itself is being designed separately.
      </div>
      <div style="margin-top:16px; display:inline-flex; align-items:center; gap:10px; padding:9px 14px;
        border:1px dashed var(--ds-color-border); border-radius:var(--ds-radius-md); background:var(--ds-color-surface-sunken);">
        <q-icon name="fact_check" size="18px" color="grey-7" />
        <span style="font-size:0.9375rem; color:var(--ds-color-text-subtle);">Compliance</span>
        <q-icon name="lock" size="14px" color="grey-6" />
        <q-icon name="arrow_forward" size="14px" color="grey-6" />
        <span style="font-size:0.8125rem; color:var(--ds-color-text-subtle);">Teams Management value-prop page</span>
      </div>
    </q-card-section>
  </q-card>`

export const LockedUpsell = tmc2Page({
  active: 'none',
  components: COMPONENTS,
  setup: () => ({
    company: COMPANY,
    settingsSections: SETTINGS_SECTIONS,
    locked: contentData.sections[0].items,
    tab: ref('notifications'),
    noticeShown: ref(true),
  }),
  slot: `
    ${companyHeader}
    <div v-show="tab === 'notifications'" style="padding:40px 32px; background:var(--ds-color-surface-sunken); min-height:100%;">
      ${notice}
      <ds-section-header title="Notifications Preferences" subtitle="Manage all of the notifications sent to your users." variant="accent" />
      <div style="display:flex; flex-direction:column; gap:16px; margin-top:12px;">
        ${upsellBanner}
        ${lockedSection}
        ${lockedComplianceConcept}
      </div>
    </div>
    <div v-show="tab === 'general'">${generalTab}</div>`,
})
LockedUpsell.parameters = { layout: 'fullscreen' }

/** Teams Mgmt Comms Phase 2 / Screens / Notification Preferences.
 *
 *  One screen, two views: `view` swaps between the preferences list and the
 *  template editor, so Edit and "Go Back to Preferences" are a real round trip
 *  rather than two dead ends in separate stories.
 *
 *  Everything renders against the shared Phase 2 tenant (see _aug19fixtures):
 *  Traveloc / Mike Addesa.
 */
import { ref, computed, watchEffect } from 'vue'
import { aug19Page } from './_aug19shell'
import {
  COMPANY, COMPANY_SECTIONS_TOP, COMPANY_RECON, COMPANY_SECTIONS_BOTTOM,
  FROM_ADDRESS_OPTIONS, FROM_ADDRESS_RESOLVED, EVENT, TM_DESC,
} from './_aug19fixtures'
import {
  companyHeader, colHeaders, fromAddressSectionStrip, unsavedChangesBar,
  addReminderRow, customFromAddressError,
  LIST_TITLE_STYLE, COL_SEND, COL_TMPL, COL_HEAD,
} from './_aug19'
import {
  rowActions, tieredRowActions, previewDialog, testSendDialog,
  addReminderDialog, deleteTemplateDialog, restoreContentDialog, leaveTemplateDialog,
  emailSettings, editorView, useTemplateEditor,
  MAX_TIERS, tierAddRow,
} from './_aug19np'
import { addedTemplates, addTemplate, removeTemplate } from './_aug19store'
import contentData from './aug19-content.json'
import DsListItem from './components/DsListItem.vue'
import DsSectionHeader from './components/DsSectionHeader.vue'
import DsInfoGrid from './components/DsInfoGrid.vue'
import DsConfirmDialog from './components/DsConfirmDialog.vue'
import DsDiscardChangesDialog from './components/DsDiscardChangesDialog.vue'
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

/* The three Teams Management templates take their subtext from TM_DESC, not
 * from this file's copy of it.
 *
 * aug19-content.json was a SECOND copy of that text — which is how the two
 * approved typo fixes landed on the event card and First-Time Setup but not
 * here. TM_DESC wins now, so these screens cannot fall behind it again. The
 * JSON keeps the same strings so the file still reads correctly on its own,
 * but it is no longer what renders. */
const TM_DESC_BY_TITLE = {
  'STP - Welcome Email': TM_DESC.welcome,
  'STP - Previously Compliant Notice': TM_DESC.previouslyCompliant,
  'STP - Compliance Reminder': TM_DESC.complianceReminder,
}
const SECTIONS = contentData.sections.map((s) => ({
  ...s,
  items: s.items.map((it) => (TM_DESC_BY_TITLE[it.title] ? { ...it, desc: TM_DESC_BY_TITLE[it.title] } : it)),
}))

export default {
  title: 'Design Requests/Aug 19/Screens/Notification Preferences',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
Company Settings → **Notifications**, for the Teams Management comms templates.

One screen with two views: the list drills into the template editor, and the
editor comes back. **Click Edit on any template** to move between them.

| View | What it is |
| --- | --- |
| **Preferences list** | Every notification, grouped by section, with a Send-Email toggle and an Edit action — plus the section's From/Reply config and the *Add Compliance Reminder* affordance |
| **Template editor** | The drill-in: content with merge fields, BCC, *Preview email* in the header, and **Notification Settings** (audience for every template, scheduling only for reminders) |

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
  row menu or from the editor's **Save ▾** menu; seeded ones can only be reverted. Fixed
  templates sort above reminders under quiet group labels, since the reminder
  group is the one that grows.
- **DES-431 · P0-7 — Conditional configuration.** Every template gets an
  **Audience** block (Team Recipients + Compliance Statuses); **only**
  \`compliance-reminder\` templates get the **Scheduling** block below it
  (begin/end days, recurrence). Driven off the row's \`type\`.
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
  Management section and an account-manager pitch. The day-one notice and a
  *concept* treatment for a locked **Compliance** nav entry were both removed in
  the 2026-08-10 review.

### Two stories, two models of the same requirement

| Story | DES-428 · P0-4 as |
| --- | --- |
| **Notification Preferences** | Unlimited compliance reminders, each named in a dialog |
| **Compliance Reminder Tiers** | Up to **4 numbered tiers**, added with one click |

The tiers story is the newer direction, from review on 2026-08-10:

> *"Getting to use it and comparing it with the other mocks has helped me really
> think through user behavior. I want to pivot this logic to be Compliance
> Reminder Tiers, whereby a customer can add up to 4 tiers ... the modal honestly
> goes away, instead the page should just add another Compliance Reminder and
> call it Compliance Reminder - Tier 2."*

**What changes**

- The button reads **Add Compliance Reminder Tier**.
- **The dialog is gone.** One click appends the next tier. There is nothing to
  name — the number is the whole identity, and asking for a name would be asking
  the user to invent something the system already knows.
- **Four is the ceiling.** At four the button greys out with a tooltip rather
  than disappearing, so the limit is discoverable instead of mysterious.

#### The first tier carries no number

*2026-08-11: "hide the '- Tier 1' suffix on the first template until someone
actually adds a second tier. I think many users will just work from 1 tier so it
might be confusing to them."*

It is never numbered. The seeded template stays **STP - Compliance Reminder** in
every state, and additions start at **Tier 2** — so a company that only ever
wants one reminder never meets the word "tier" at all, and the ceiling of four
reads as one reminder plus three escalations.

This originally had corroboration from the Event Registration Settings card,
which listed *Compliance Reminder* beside *Compliance Reminder - Tier 2*. That
pairing is gone — planning on 2026-08-12 collapsed the event level to a single
**Compliance Reminder (All)** row (DES-425) — so tiers are now a company-level
concept only. The decision stands on its own reasoning rather than on matching
the other screen.

It settles the wording question flagged here previously: the info copy's *"up to
3 Additional"* is now literally true rather than true-only-if-you-count-Tier-1.

#### Tiers unwind from the end

*"Only allow the user to delete the furthest tier in the list."*

Delete stays visible on every user-added tier but is **disabled on all but the
last**, with a tooltip saying so. Deleting from the middle would either strand a
gap in the numbering or renumber the tiers below it while the user was not
looking, and both are worse than asking them to unwind from the end.

This deleted a rule that existed only to cope with gaps — adding a tier used to
scan for the lowest unused number. Gaps are now impossible, so the next tier is
just the count plus one.

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
\`aug19-content.json\`.

### Removed 2026-08-07 — DES-432 · P0-8

**Notification Settings** previously carried a *One email per team per day* note with
the priority order. P0-8 was never requested as a mock, so it is gone.

> The **Publish content** toolbar addon is intentionally not wired to this fork —
> its arg keys are prefixed \`aug19\` so it cannot commit into DES-207's
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

/* DES-428 · P0-4 — the tiers pivot (2026-08-10 review).
 *
 * "I want to pivot this logic to be Compliance Reminder Tiers, whereby a
 * customer can add up to 4 tiers ... the modal honestly goes away, instead the
 * page should just add another Compliance Reminder and call it Compliance
 * Reminder - Tier 2 and subsequent additions should just keep numbering."
 *
 * So the tiers variant differs in four ways: the button names a tier, the info
 * copy is about escalation rather than unlimited templates, there is no naming
 * dialog at all, and there is a hard ceiling of four. */
/* ---- View 1: the preferences list ---- */
const makeListView = (variant) => `
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
                      ${variant === 'tiers' ? tieredRowActions : rowActions}
                    </div>
                  </div>
                </template>
              </ds-list-item>
            </div>
          </template>
          <template v-if="s.name === 'Teams Management'">
            <q-separator />
            ${variant === 'tiers'
              ? addReminderRow(tierAddRow())
              : addReminderRow()}
          </template>
        </q-expansion-item>
      </q-card>
    </div>


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

const makeBody = (variant) => `
  ${companyHeader}
  <div v-show="tab === 'notifications'">
    <div v-if="view === 'list'">${makeListView(variant)}</div>
    <div v-else>${editorView}</div>

    <!-- Mounted here, outside the view switch, not inside the list view where
         it used to sit. Same rule the dialogs on this screen learned the hard
         way: anything mounted inside one branch silently does nothing in the
         other, and the editor is exactly where it now has to work. -->
    ${unsavedChangesBar}
    <!-- Every dialog lives outside the view switch, so each is reachable from
         the list, the preview modal and the editor alike (DES-436 · P1-1), and
         Delete works from both the row menu and the editor header.
         addReminderDialog is mounted unconditionally even though the tiers
         variant has no Add button: it also serves "Change description", which
         every variant has. Gating it on the variant is what made Delete a no-op
         on the tiers screen before, and it briefly did the same to renaming. -->
    ${previewDialog}
    ${testSendDialog}
    ${addReminderDialog}
    ${deleteTemplateDialog}
    ${restoreContentDialog}
    ${leaveTemplateDialog}
  </div>
  <div v-show="tab === 'general'">${generalTab}</div>`

// Native Storybook Controls: Header + Subtext per template, grouped by section.
// Keys are prefixed `aug19` so the DES-207 "Publish content" addon does not match
// this story and cannot commit into des207-content.json.
const TEMPLATE_ARG_TYPES = {}
const TEMPLATE_ARGS = {}
SECTIONS.forEach((s, si) => {
  s.items.forEach((it, ii) => {
    const base = `aug19s${si}i${ii}`
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
}
const SEED_TYPES = SECTIONS.map((s) =>
  s.items.map((it) => (s.name === TM_SECTION ? (SEED_TYPE_BY_TITLE[it.title] || 'compliance-reminder') : 'other')))

const isReminder = (it) => it.type === 'compliance-reminder'

function sectionsFromArgs(args = {}, added = [], sendEdits = {}, metaEdits = {}) {
  /* Both edit layers are keyed by row id and applied on rebuild rather than
   * written into the row, so a Controls change cannot lose them and Discard is a
   * single assignment. `metaEdits` is "Change description" — the row's name and
   * the line beneath it; it wins over both the seed and the Controls value,
   * because it is the more recent thing the user did. */
  const withEdit = (it) => {
    const meta = metaEdits[it.id]
    const send = sendEdits[it.id]
    if (meta === undefined && send === undefined) return it
    return {
      ...it,
      ...(send === undefined ? {} : { send }),
      ...(meta === undefined ? {} : { title: meta.title, desc: meta.desc }),
    }
  }
  return SECTIONS.map((s, si) => {
    const seeded = s.items.map((it, ii) => withEdit({
      ...it,
      id: `s${si}i${ii}`,
      type: SEED_TYPES[si][ii],
      title: args[`aug19s${si}i${ii}_title`] ?? it.title,
      desc: args[`aug19s${si}i${ii}_desc`] ?? it.desc,
    }))
    if (s.name !== TM_SECTION) return { ...s, items: seeded }
    /* The seeded reminder is never numbered (2026-08-11 review): "hide the
     * '- Tier 1' suffix on the first template ... many users will just work from
     * 1 tier so it might be confusing to them." It stays "STP - Compliance
     * Reminder" in every state, and additions start at Tier 2. The event card
     * no longer lists tiers at all — one "Compliance Reminder (All)" row toggles
     * them together (DES-425, 2026-08-12) — so tiers are a company-level
     * concept and this screen is the only place they are named. */
    /* DES-428 · P0-4 — fixed-type templates first, reminders after.
     * Welcome and Previously Compliant are a closed set: exactly one of each,
     * forever. Compliance Reminders are open-ended and grow, so they sort last —
     * otherwise every reminder a Hoco adds lands in among the fixed templates
     * and the order reads as arbitrary.
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

const COMPONENTS = { DsListItem, DsSectionHeader, DsInfoGrid, DsConfirmDialog, DsDiscardChangesDialog, DsField, DsInput, DsSelect, DsRichTextEditor }
const SETTINGS_SECTIONS = [...COMPANY_SECTIONS_TOP, { title: 'Reconciliation & Invoice Settings', items: COMPANY_RECON }, ...COMPANY_SECTIONS_BOTTOM]

const makeStory = (variant) => aug19Page({
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
    // DES-429 · P0-5 — only "Other" needs checking; the other two resolve to people.
    const customFromError = computed(() => customFromAddressError(fromAddress.value, fromAddressCustom.value))

    /** The literal address, where one is knowable. Only "Other" ever is. */
    const resolvedFrom = computed(() => (fromAddress.value === 'Other'
      ? (fromAddressCustom.value || 'Custom address not set yet')
      : (FROM_ADDRESS_RESOLVED[fromAddress.value] || fromAddress.value)))

    /** What the email preview shows as the From line. Event Manager and Customer
     *  Support Contact are per-event roles, so naming one mailbox would be a
     *  guess; the role and when it resolves is the truthful answer. */
    const fromDisplay = computed(() => {
      if (fromAddress.value === 'Other') return resolvedFrom.value
      return fromAddress.value + ' — resolved per event when the email sends'
    })

    /* SAVE MODEL — nothing here takes effect until Save.
     *
     * The shared store (_aug19store.js) holds only SAVED templates, because that
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
    /* "Change description" — { [rowId]: { title, desc } }. Staged like every
     * other change on this screen, so a rename does not reach the list, the
     * store or Event Registration Settings until Save. */
    const metaEdits = ref({})
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
      sections.value = sectionsFromArgs(args, visibleAdded.value, sendEdits.value, metaEdits.value)
    })

    const listDirty = computed(() => pendingAdds.value.length > 0
      || pendingDeletes.value.length > 0
      || Object.keys(sendEdits.value).length > 0
      || Object.keys(metaEdits.value).length > 0
      || fromAddress.value !== savedFrom.value
      || fromAddressCustom.value !== savedFromCustom.value)

    const saveList = () => {
      // A staged rename of a staged add is applied before the add reaches the
      // store, so the template is created under the name the user last chose.
      pendingAdds.value.forEach((t) => {
        const meta = metaEdits.value[t.id]
        addTemplate({
          title: meta ? meta.title : t.title,
          desc: meta ? meta.desc : t.desc,
          baseTitle: t.baseTitle,
        })
      })
      pendingDeletes.value.forEach((id) => {
        const target = addedTemplates.value.find((t) => t.id === id)
        if (target) removeTemplate(target)
      })
      // Send-Email edits are the prototype's stand-in for persistence: fold them
      // into the store objects that survive, so they read back the same way.
      addedTemplates.value.forEach((t) => {
        if (sendEdits.value[t.id] !== undefined) t.send = sendEdits.value[t.id]
        const meta = metaEdits.value[t.id]
        if (meta) { t.title = meta.title; t.desc = meta.desc }
      })
      pendingAdds.value = []
      pendingDeletes.value = []
      sendEdits.value = {}
      metaEdits.value = {}
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

    const discardList = () => {
      pendingAdds.value = []
      pendingDeletes.value = []
      sendEdits.value = {}
      metaEdits.value = {}
      fromAddress.value = savedFrom.value
      fromAddressCustom.value = savedFromCustom.value
    }

    /* The editor, its dialogs and everything behind them come from the shared
     * module, so this screen and First-Time Setup cannot behave differently.
     * What is passed in is the part that IS different: here, add and delete
     * stage into the local pending lists rather than touching the store. */
    /* DES-428 · P0-4 (tiers) — how many reminder tiers exist right now, staged
     * ones included, so the Add button disables the moment the fourth appears
     * rather than after a save. */
    const tierCount = computed(() => {
      const tm = sections.value.find((sec) => sec.name === TM_SECTION)
      return tm ? tm.items.filter(isReminder).length : 0
    })

    /* Adding a tier takes no input at all — no dialog, no name, no description.
     * The number is the whole identity, so asking for one would be asking the
     * user to invent something the system already knows.
     *
     * The next number is simply the count plus one, and the seeded reminder
     * counts as the unnumbered first tier — so the first addition is Tier 2 and
     * the ceiling of four lands on Tier 4. This used to scan for the lowest free
     * number, because deleting a middle tier left a gap. Delete is now restricted
     * to the furthest tier (2026-08-11 review), so gaps cannot form and the scan
     * had nothing left to solve. */
    const addTier = () => {
      if (tierCount.value >= MAX_TIERS) return
      stagedSeq += 1
      pendingAdds.value = [...pendingAdds.value, {
        id: 'tm-staged-' + stagedSeq,
        key: 'tm-staged-' + stagedSeq,
        title: 'STP - Compliance Reminder - Tier ' + (tierCount.value + 1),
        desc: TM_DESC.addedTier,
        type: 'compliance-reminder',
        send: true,
        forced: false,
        custom: true,
        userAdded: true,
      }]
    }

    /* Only the furthest tier can go (2026-08-11 review). Compared by id against
     * the last reminder in the section — the list is already sorted with
     * reminders last and additions appended, so "furthest" is "last", and that
     * holds whether the tier is saved or still staged.
     *
     * On the named-template screen there are no tiers to unwind, so any
     * user-added template stays deletable. */
    const canDeleteTier = (it) => {
      if (!it || !it.userAdded) return false
      if (variant !== 'tiers') return true
      const tm = sections.value.find((sec) => sec.name === TM_SECTION)
      const reminders = tm ? tm.items.filter(isReminder) : []
      return reminders.length > 0 && reminders[reminders.length - 1].id === it.id
    }

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
          desc: desc || TM_DESC.addedTier,
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
      /* Staged by row id, not written into the row — so it survives a Controls
       * edit rebuilding the list, and Discard drops it in one assignment. Works
       * on seeded and user-added templates alike; nothing about this screen
       * treats a name as immutable. */
      onConfirmMeta: ({ target, name, desc }) => {
        metaEdits.value = { ...metaEdits.value, [target.id]: { title: name, desc } }
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
      customFromError,
      // emailPaper's contract: the From line reports the role, not a mailbox.
      fromLine: fromDisplay, eventName: EVENT.name,
      /* The save bar serves the list and the editor now. composeSaveBar
       * picks which pair it drives from the open view, so the editor's
       * unsaved edits surface through the same control. */
      ...editor.composeSaveBar({ listDirty, saveList, discardList }),
      listDirty, onToggleSend,
      startsReminderGroup, startsFixedGroup,
      // After ...editor, so this replaces the permissive default it ships with.
      tierCount, addTier, canDeleteTier,
    }
  },
  slot: makeBody(variant),
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

/** The current model: unlimited compliance reminders, each named in a dialog. */
export const NotificationPreferences = makeStory('default')
NotificationPreferences.parameters = { layout: 'fullscreen', implementation: IMPLEMENTATION }
NotificationPreferences.argTypes = TEMPLATE_ARG_TYPES
NotificationPreferences.args = TEMPLATE_ARGS

/** DES-428 · P0-4 — the tiers pivot (review, 2026-08-10). Kept beside the
 *  original so the two models can be compared rather than described. */
export const ComplianceReminderTiers = makeStory('tiers')
ComplianceReminderTiers.storyName = 'Compliance Reminder Tiers'
ComplianceReminderTiers.parameters = { layout: 'fullscreen', implementation: IMPLEMENTATION }
ComplianceReminderTiers.argTypes = TEMPLATE_ARG_TYPES
ComplianceReminderTiers.args = TEMPLATE_ARGS

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
export const LockedUpsell = aug19Page({
  active: 'none',
  components: COMPONENTS,
  setup: () => ({
    company: COMPANY,
    settingsSections: SETTINGS_SECTIONS,
    locked: contentData.sections[0].items,
    tab: ref('notifications'),
  }),
  slot: `
    ${companyHeader}
    <!-- No day-one "New notification section" banner here: on a page where
         Teams Management is locked, announcing that the section only supports
         Teams Management says nothing useful. Removed with the locked-nav
         concept in the 2026-08-10 review. -->
    <div v-show="tab === 'notifications'" style="padding:40px 32px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <ds-section-header title="Notifications Preferences" subtitle="Manage all of the notifications sent to your users." variant="accent" />
      <div style="display:flex; flex-direction:column; gap:16px; margin-top:12px;">
        ${upsellBanner}
        ${lockedSection}
      </div>
    </div>
    <div v-show="tab === 'general'">${generalTab}</div>`,
})
LockedUpsell.parameters = { layout: 'fullscreen' }

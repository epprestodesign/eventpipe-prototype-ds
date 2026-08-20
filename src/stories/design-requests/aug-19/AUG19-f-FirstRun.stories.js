/** Teams Mgmt Comms Phase 2 / First-Time Setup / Notification Preferences.
 *
 *  The Notifications tab exactly as a brand-new Teams Management customer finds
 *  it, before anyone has configured anything: the three seeded templates from
 *  DES-427 and nothing else. No custom templates, no renames, no deletions —
 *  the state Scott's launch checklist starts from.
 */
import { ref, computed } from 'vue'
import { aug19Page } from './_aug19shell'
import { COMPANY, DEFAULT_EMAILS, EVENT, FROM_ADDRESS_OPTIONS, FROM_ADDRESS_RESOLVED, TM_DESC } from './_aug19fixtures'
import { addedTemplates, addTemplate, removeTemplate } from './_aug19store'
import {
  companyHeader, colHeaders, fromAddressSectionStrip, unsavedChangesBar,
  addReminderRow, customFromAddressError,
  LIST_TITLE_STYLE, COL_SEND, COL_TMPL,
} from './_aug19'
import DsListItem from './components/DsListItem.vue'
import DsSectionHeader from './components/DsSectionHeader.vue'
import DsSelect from './components/DsSelect.vue'
import DsInput from './components/DsInput.vue'
import DsConfirmDialog from './components/DsConfirmDialog.vue'
import DsDiscardChangesDialog from './components/DsDiscardChangesDialog.vue'
import DsField from './components/DsField.vue'
import DsRichTextEditor from './components/DsRichTextEditor.vue'
import DsInfoGrid from './components/DsInfoGrid.vue'
import {
  tieredRowActions, previewDialog, testSendDialog, addReminderDialog,
  deleteTemplateDialog, restoreContentDialog, leaveTemplateDialog, editorView, useTemplateEditor,
  MAX_TIERS, tierAddRow,
} from './_aug19np'

export default {
  title: 'Design Requests/Aug 19/First-Time Setup/Notification Preferences',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
**[DES-427 · P0-3](https://linear.app/eventpipe/issue/DES-427)** — what a first-time
customer sees.

Every customer is seeded with the same Teams Management templates. This is that
state: no custom reminders added, nothing renamed, nothing disabled.

| Template | Sends to | When |
| --- | --- | --- |
| **Welcome Email** | Team Housing Contact | Once, when a team first appears |
| **Previously Compliant Notice** | Team Housing Contact + Group Block Creators | Once, when a compliant team drops below |
| **Compliance Reminder** | Team Housing Contact + Group Block Creators | Weekly (Mon), 200 days out → event start |

Standard emails first, then reminders — the same grouping as the configured
screen, since the reminder group is the one that grows.

> **Three seeded templates, matching DES-427.** This screen showed a fourth,
> *Compliance Achieved*, which was cut on 2026-08-11 as out of scope for this
> phase. That also closes the discrepancy flagged here previously.

### Tiers work exactly as they do on the configured screen

*2026-08-13: "the tier logic is not the same, please update the First Run to
match the functionality of the Compliance Reminder Tiers version so they are
consistent."*

This screen had kept the original named-template model — an *Add Compliance
Reminder* dialog asking for a name and description — long after the configured
screen pivoted to tiers. It now behaves identically:

| | |
| --- | --- |
| **Add Compliance Reminder Tier** | One click, no dialog. The number is the whole identity |
| **Ceiling of four** | The button greys out with a tooltip rather than disappearing |
| **Tiers unwind from the end** | Delete stays visible but disabled on every tier but the last |
| **The first tier carries no number** | The seeded reminder stays *Compliance Reminder*; additions start at *Tier 2* |

The ceiling, the tooltip copy and the add-row config now live in the shared
module rather than in one screen's story file — the divergence happened
precisely because they were stated in only one place.

Reminder rows here are unprefixed, so tiers added on this screen read
*Compliance Reminder - Tier 2* rather than *STP - Compliance Reminder - Tier 2*.
That follows this screen's own naming; only the prefix differs.

Two things a first-time user meets here:

1. **Every template defaults to Send Email OFF at the event level.** Company-level
   templates exist and are enabled, but per [DES-425 · P0-1](https://linear.app/eventpipe/issue/DES-425)
   nothing actually sends until it is switched on for a given event. A banner used
   to spell that out at the top of this screen; it was removed on 2026-08-11 as
   *"unnecessary"*, since the section strip and Event Registration Settings both
   show it without restating the screen back to the reader.
2. **The From/Reply address already has a default.** [DES-429 · P0-5](https://linear.app/eventpipe/issue/DES-429)
   sets *Event Manager* on day one and there is no way to clear it, so this
   screen no longer has an unset state to show. Choosing *Other* is the only
   path that asks for input, and it validates the address.

The email bodies themselves are in *First-Time Setup › Default Emails*.

> The template copy is **draft**. The spec records it as "Pending Default
> Template Body" and [DES-447](https://linear.app/eventpipe/issue/DES-447) assigns
> the real wording to Scott.
` } } },
}


/* A "Teams Management communications are ready to set up" banner sat above the
 * list until 2026-08-11: "please remove that, it's unnecessary." What it
 * explained — that a From/Reply address is needed, and that templates switch on
 * per event — is already visible in the section strip and on Event Registration
 * Settings, so it was restating the screen back to the reader. */


/** Matches the group labels on the configured screen exactly. */
const GROUP_LABEL = 'padding:14px 28px 2px; font-size:0.75rem; font-weight:600;'
  + ' letter-spacing:0.04em; text-transform:uppercase; color:var(--ds-color-text-subtle);'

const seededList = `
  <q-card flat bordered>
    <q-expansion-item default-opened label="Teams Management" header-class="text-primary text-weight-bold">
      <q-separator />
      ${fromAddressSectionStrip}
      ${colHeaders}
      <template v-for="(it, i) in rows" :key="it.key">
        <q-separator v-if="i > 0" />
        <div v-if="startsFixedGroup(i)" :style="groupLabelStyle">Standard Emails</div>
        <div v-if="startsReminderGroup(i)" :style="groupLabelStyle">Compliance Reminders</div>
        <div style="padding:8px 28px;">
          <ds-list-item :subtitle="it.purpose" :bordered="false">
            <template #title>
              <span class="row items-center q-gutter-sm">
                <strong style="${LIST_TITLE_STYLE}">{{ it.title }}</strong>
                <!-- Only customised templates carry a badge. Default is the norm,
                     and badging every row said nothing while adding noise —
                     the same rule the configured screen already followed. On
                     first run nothing is customised, so nothing shows. -->
                <q-badge v-if="it.custom" color="primary" class="q-px-sm q-py-xs">Custom</q-badge>
              </span>
            </template>
            <template #trailing>
              <div class="row items-center no-wrap">
                <div style="${COL_SEND}"><q-checkbox :model-value="it.on" @update:model-value="onToggleSend(it, $event)" color="primary" /></div>
                <div style="${COL_TMPL}">${tieredRowActions}</div>
              </div>
            </template>
          </ds-list-item>
        </div>
      </template>
      <q-separator />
      ${addReminderRow(tierAddRow())}
    </q-expansion-item>
  </q-card>`

export const FirstRun = aug19Page({
  active: 'none',
  components: {
    DsListItem, DsSectionHeader, DsSelect, DsInput, DsConfirmDialog, DsDiscardChangesDialog, DsField,
    DsRichTextEditor, DsInfoGrid,
  },
  setup: () => {
    /* DES-429 · P0-5 — Event Manager is the default everywhere, including day
     * one. Review removed the ability to clear the field, so there is no unset
     * state left for first-run to show. */
    const fromAddress = ref('Event Manager')
    const fromAddressCustom = ref('')
    // Same resolution the configured screen uses, so the two agree once a value
    // is picked. Nothing is set on first run, so the card shows its unset state.
    const resolvedFrom = computed(() =>
      fromAddress.value === 'Other'
        ? (fromAddressCustom.value || 'your custom address')
        : (FROM_ADDRESS_RESOLVED[fromAddress.value] || ''))
    /* DES-428 · P0-4 — adding a reminder works here, not just on the configured
     * screen: a brand-new customer setting up for the first time is exactly who
     * needs a second reminder, and they have no reason to leave this page to
     * get one. It writes to the shared session store (_aug19store.js), so the
     * new template also shows up as an event-level toggle on Event
     * Registration Settings (DES-425 · P0-1). */
    const seeded = ref(DEFAULT_EMAILS.map((e) => ({
      key: e.key, title: e.title, purpose: e.purpose, type: e.type, on: true,
    })))
    const baseReminder = DEFAULT_EMAILS.find((e) => e.key === 'compliance-reminder')

    /* Same save model as the configured screen: nothing takes effect until
     * Save, so a reminder added here does not reach Event Registration Settings
     * until then, and Discard drops it. Send-Email edits are held by row key
     * rather than mutating the row, so Discard is one assignment. */
    const pendingAdds = ref([])
    const sendEdits = ref({})
    /* "Change description" — { [rowKey]: { title, desc } }. Staged like the
     * Send-Email edits beside it, so a rename does not reach the shared store
     * or Event Registration Settings until Save. */
    const metaEdits = ref({})
    /* Deleting a SAVED tier is staged like everything else, so Discard puts it
     * back and the shared store is only touched on Save. */
    const pendingDeletes = ref([])
    let stagedSeq = 0

    /* DES-428 · P0-4 — same grouping as the configured screen: the closed set of
     * standard emails first, then compliance reminders, which is the group that
     * grows. DEFAULT_EMAILS ships the reminder in the middle, so this has to
     * sort rather than just label. */
    const isReminderRow = (r) => r.type === 'compliance-reminder'
    const rows = computed(() => {
      const all = [
        ...seeded.value,
        // `userAdded` matters: it is what the row menu gates Delete on. Without
        // it a tier survived a save and then could never be removed.
        ...addedTemplates.value
          .filter((t) => !pendingDeletes.value.includes(t.key))
          .map((t) => ({
            key: t.key, title: t.title, purpose: t.desc, type: t.type, on: t.send,
            custom: true, userAdded: true,
          })),
        ...pendingAdds.value,
      ].map((r) => {
        const meta = metaEdits.value[r.key]
        const on = sendEdits.value[r.key]
        // `desc` is an alias of `purpose`: the shared row menu and dialog speak
        // in desc, while this screen's list renders purpose as the subtitle.
        return {
          ...r,
          ...(on === undefined ? {} : { on }),
          ...(meta === undefined ? {} : { title: meta.title, purpose: meta.desc }),
          desc: meta === undefined ? r.purpose : meta.desc,
        }
      })
      return [...all.filter((r) => !isReminderRow(r)), ...all.filter(isReminderRow)]
    })
    // Derived from position so the label lands on the first row of each group
    // however many reminders have been added.
    const startsFixedGroup = (i) => !isReminderRow(rows.value[i])
      && (i === 0 || isReminderRow(rows.value[i - 1]))
    const startsReminderGroup = (i) => isReminderRow(rows.value[i])
      && (i === 0 || !isReminderRow(rows.value[i - 1]))

    /* DES-427 (2026-08-13) — the tiers model, identical to Screens >
     * Notification Preferences > Compliance Reminder Tiers. This screen kept the
     * old named-template dialog long after the configured screen pivoted, which
     * is exactly the inconsistency review caught: "the tier logic is not the
     * same, please update the First Run to match."
     *
     * Reminder rows here are unprefixed — Compliance Reminder, not STP -
     * Compliance Reminder — so tiers added here follow this screen's own naming
     * rather than importing the other screen's prefix. */
    const isReminderType = (r) => r.type === 'compliance-reminder'
    const tierCount = computed(() => rows.value.filter(isReminderType).length)

    const addTier = () => {
      if (tierCount.value >= MAX_TIERS) return
      stagedSeq += 1
      pendingAdds.value = [...pendingAdds.value, {
        key: 'tm-staged-' + stagedSeq,
        id: 'tm-staged-' + stagedSeq,
        title: 'Compliance Reminder - Tier ' + (tierCount.value + 1),
        purpose: TM_DESC.addedTier,
        type: 'compliance-reminder',
        on: true,
        custom: true,
        userAdded: true,
      }]
    }

    /* Only the furthest tier can go. Compared by key against the last reminder
     * in the list, which is already sorted with reminders last and additions
     * appended — so "furthest" is "last", staged or saved alike. */
    const canDeleteTier = (it) => {
      if (!it || !it.userAdded) return false
      const reminders = rows.value.filter(isReminderType)
      return reminders.length > 0 && reminders[reminders.length - 1].key === it.key
    }

    const customFromError = computed(() => customFromAddressError(fromAddress.value, fromAddressCustom.value))
    const savedFrom = ref(fromAddress.value)
    const savedFromCustom = ref(fromAddressCustom.value)

    const listDirty = computed(() => pendingAdds.value.length > 0
      || Object.keys(sendEdits.value).length > 0
      || Object.keys(metaEdits.value).length > 0
      || pendingDeletes.value.length > 0
      || fromAddress.value !== savedFrom.value
      || fromAddressCustom.value !== savedFromCustom.value)

    const onToggleSend = (row, value) => {
      sendEdits.value = { ...sendEdits.value, [row.key]: value }
    }

    const saveList = () => {
      pendingAdds.value.forEach((t) => {
        const meta = metaEdits.value[t.key]
        addTemplate({
          title: meta ? meta.title : t.title,
          desc: meta ? meta.desc : t.purpose,
          baseTitle: t.baseTitle,
        })
      })
      seeded.value.forEach((r) => {
        if (sendEdits.value[r.key] !== undefined) r.on = sendEdits.value[r.key]
        const meta = metaEdits.value[r.key]
        if (meta) { r.title = meta.title; r.purpose = meta.desc }
      })
      addedTemplates.value.forEach((t) => {
        const meta = metaEdits.value[t.key]
        if (meta) { t.title = meta.title; t.desc = meta.desc }
      })
      pendingDeletes.value.forEach((key) => {
        const target = addedTemplates.value.find((t) => t.key === key)
        if (target) removeTemplate(target)
      })
      pendingAdds.value = []
      pendingDeletes.value = []
      sendEdits.value = {}
      metaEdits.value = {}
      savedFrom.value = fromAddress.value
      savedFromCustom.value = fromAddressCustom.value
    }

    const discardList = () => {
      pendingAdds.value = []
      pendingDeletes.value = []
      sendEdits.value = {}
      metaEdits.value = {}
      fromAddress.value = savedFrom.value
      fromAddressCustom.value = savedFromCustom.value
    }

    /* The editor and every dialog come from the shared module, so this screen
     * behaves exactly like the configured one — Edit opens the same editor,
     * Preview shows the same email, a test send works the same way. Only the
     * staging differs, and that is what gets passed in. */
    const editor = useTemplateEditor({
      baseReminderTitle: () => (baseReminder ? baseReminder.title : 'the standard Compliance Reminder'),
      /* No onConfirmAdd: in the tiers model the add row calls addTier directly
       * and the naming dialog is unreachable. The dialog itself stays mounted —
       * it also serves "Change description". */
      onConfirmDelete: (target) => {
        if (pendingAdds.value.some((t) => t.key === target.key)) {
          pendingAdds.value = pendingAdds.value.filter((t) => t.key !== target.key)
        } else {
          pendingDeletes.value = [...pendingDeletes.value, target.key]
        }
      },
      // Keyed by `key` here rather than `id` — this screen's rows predate the
      // configured screen's id scheme and are still keyed that way.
      onConfirmMeta: ({ target, name, desc }) => {
        metaEdits.value = { ...metaEdits.value, [target.key]: { title: name, desc } }
      },
    })

    return {
      ...editor,
      company: COMPANY,
      tab: ref('notifications'),
      fromAddress,
      fromAddressCustom,
      fromOptions: FROM_ADDRESS_OPTIONS,
      resolvedFrom,
      customFromError,
      // emailPaper's contract, same as the configured screen: the From line
      // reports the role rather than a mailbox it cannot know.
      fromLine: computed(() => (fromAddress.value
        ? fromAddress.value + ' — resolved per event when the email sends'
        : 'Not set — no email can send yet')),
      eventName: EVENT.name,
      seeded,
      rows,
      onToggleSend,
      startsFixedGroup,
      startsReminderGroup,
      tierCount, addTier, canDeleteTier,
      groupLabelStyle: GROUP_LABEL,
      /* The save bar serves the list and the editor now. composeSaveBar
       * picks which pair it drives from the open view, so the editor's
       * unsaved edits surface through the same control. */
      ...editor.composeSaveBar({ listDirty, saveList, discardList }),
      listDirty,
    }
  },
  slot: `
    ${companyHeader}
    <div v-show="tab === 'notifications'" style="padding:40px 32px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div v-if="view === 'list'">
        <ds-section-header title="Notifications Preferences" subtitle="Manage all of the notifications sent to your users." variant="accent" />
        <div style="margin-top:12px;">
          ${seededList}
        </div>
      </div>
      <div v-else>${editorView}</div>
    </div>
    <div v-show="tab === 'general'" style="padding:40px 32px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="text-grey-7">General company settings.</div>
    </div>

    <!-- Mounted outside the view switch since 2026-08-19: the editor's header
         no longer carries a Save, so this bar is how an edited email gets saved.
         It renders for whichever view is open and drives that view's handlers. -->
    ${unsavedChangesBar}

    ${addReminderDialog}
    ${previewDialog}
    ${testSendDialog}
    ${deleteTemplateDialog}
    ${restoreContentDialog}
    ${leaveTemplateDialog}`,
})
FirstRun.parameters = { layout: 'fullscreen' }

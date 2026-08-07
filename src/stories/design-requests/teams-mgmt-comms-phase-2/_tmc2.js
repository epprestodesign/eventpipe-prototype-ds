/** Shared chrome for the Notification Preferences screen — the company header
 *  (breadcrumb + logo + name + General/Notifications tabs) and the "Go Back to
 *  Preferences" link. Both are template-string fragments; the consuming story's
 *  setup must provide a `tab` ref and `company` (see _tmc2fixtures). */

export const companyHeader = `
  <div style="padding:20px 32px 0; background:var(--ds-color-surface); border-bottom:1px solid var(--ds-color-border-container);">
    <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2 q-mb-md">
      <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
      <q-breadcrumbs-el label="Companies" />
      <q-breadcrumbs-el :label="company.name" class="text-grey-6" />
    </q-breadcrumbs>
    <div class="row items-center q-gutter-md">
      <img :src="company.logo" :alt="company.name" style="height:34px; width:auto;" />
      <div style="flex:1;">
        <div class="text-primary" style="font-size:1.25rem; font-weight:700;">{{ company.name }}</div>
        <div class="text-grey-6" style="font-size:0.8125rem;">Last updated: {{ company.lastUpdated }}</div>
      </div>
    </div>
    <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left" class="text-grey-7 q-mt-sm">
      <q-tab name="general" label="General" />
      <q-tab name="notifications" label="Notifications" />
    </q-tabs>
  </div>`

export const goBackLink = `
  <a href="#" @click.prevent="goBack"
    style="display:inline-flex; align-items:center; gap:2px; color:var(--ds-color-text-brand); text-decoration:none; font-weight:600; font-size:0.9375rem;">
    <q-icon name="chevron_left" size="18px" /> Go Back to Preferences
  </a>`

/* ---------------------------------------------------------------------------
 * Shared notification-list chrome.
 *
 * Both Notification Preferences screens — Screens/Notification Preferences and
 * First-Time Setup/Notification Preferences — render the same list. These live
 * here so the two cannot drift: a row must look identical whether you are
 * seeing it for the first time or editing it later.
 */

/** Row + column metrics. Send/Template column widths must match between the
 *  header row and the row bodies or the columns visually misalign. */
export const LIST_TITLE_STYLE = 'font-size:0.9375rem; font-weight:500; color:var(--ds-color-text);'
export const COL_SEND = 'width:96px; display:flex; align-items:center; justify-content:center;'
export const COL_TMPL = 'width:132px; display:flex; align-items:center; justify-content:center; margin-left:24px;'
export const COL_HEAD = 'font-size:0.8125rem; font-weight:600; color:var(--ds-color-text-subtle); text-align:center;'

export const colHeaders = `
  <div style="padding:14px 28px 4px; display:flex; justify-content:flex-end;">
    <div style="${COL_SEND}${COL_HEAD}">Send Email</div>
    <div style="${COL_TMPL}${COL_HEAD}">Template</div>
  </div>`

/** The Template-column control. One definition so the affordance is the same on
 *  both screens. `onEdit` / `onRevert` / `onDelete` are handler names in the
 *  consuming setup; omit revert or delete to leave that item out — first-run has
 *  nothing custom to revert and nothing user-added to delete. */
export const templateActions = ({ onEdit = 'openEditor', onRevert = '', onDelete = '' } = {}) => `
  <q-btn-dropdown split unelevated no-caps color="primary" label="Edit" @click="${onEdit}(it)">
    <q-list style="min-width:190px">
      <q-item clickable v-close-popup @click="${onEdit}(it)">
        <q-item-section avatar><q-icon name="edit" /></q-item-section>
        <q-item-section>Edit template</q-item-section>
      </q-item>
      <q-item clickable v-close-popup>
        <q-item-section avatar><q-icon name="visibility" /></q-item-section>
        <q-item-section>Preview</q-item-section>
      </q-item>
      ${onRevert ? `
      <template v-if="it.custom">
        <q-separator />
        <q-item clickable v-close-popup @click="${onRevert}(it)">
          <q-item-section avatar><q-icon name="undo" color="negative" /></q-item-section>
          <q-item-section class="text-negative">Revert to default</q-item-section>
        </q-item>
      </template>` : ''}
      ${onDelete ? `
      <template v-if="it.userAdded">
        <q-item clickable v-close-popup @click="${onDelete}(it)">
          <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
          <q-item-section class="text-negative">Delete template</q-item-section>
        </q-item>
      </template>` : ''}
    </q-list>
  </q-btn-dropdown>`

/** Unsaved-changes bar.
 *
 *  Appears the moment anything on the preferences list differs from what was
 *  last saved — a Send Email checkbox, the From/Reply address, a reminder added
 *  or deleted — and is the only way to commit any of it. Nothing on these
 *  screens takes effect until Save: a reminder you add does not reach Event
 *  Registration Settings until then, and Discard puts it back as it was.
 *
 *  Fixed to the bottom of the viewport rather than the end of the page, because
 *  the list is long enough to scroll and a bar you have to hunt for is worse
 *  than no bar. Shared by both Notification Preferences screens so they cannot
 *  drift. The consuming setup must provide `dirty`, `saveChanges` and
 *  `discardChanges`.
 *
 *  Deliberately NOT rendered on the template editor: that view has its own
 *  Cancel / Save in the header, right beside the field being edited, and two
 *  competing save affordances on one screen is worse than either alone. */
export const unsavedChangesBar = `
  <transition name="q-transition--fade">
    <div v-if="dirty" role="status" aria-live="polite"
      style="position:fixed; left:50%; bottom:28px; transform:translateX(-50%); z-index:3000;
             display:flex; align-items:center; gap:12px; padding:10px 12px 10px 22px;
             background:rgba(72,72,72,0.94); border-radius:var(--ds-radius-lg);
             box-shadow:0 6px 24px rgba(0,0,0,0.28);">
      <span style="color:#fff; font-size:0.9375rem; font-weight:500; white-space:nowrap;">Unsaved Changes</span>
      <q-btn unelevated no-caps color="white" text-color="primary" label="Discard" @click="discardChanges" />
      <q-btn unelevated no-caps color="primary" label="Save" @click="saveChanges" />
    </div>
  </transition>`

/** DES-429 · P0-5 — per-section config strip.
 *
 *  Review of the earlier card: too bloated, it showed a concrete resolved address it
 *  cannot actually know, and it "feels independent of the Teams Management
 *  Communications section ... over time there will be more sections like Guests,
 *  Hotels, and each of those may have specific config parameters".
 *
 *  So this is a GENERIC per-section config slot, not a one-off for From/Reply:
 *  it renders inside the section it configures, and a future section fills the
 *  same slot with its own parameters. It states that the address resolves per
 *  event rather than naming one, which is the honest answer — Event Manager and
 *  Customer Support Contact both vary by event.
 *
 *  Lives here, not in a story file, because both Notification Preferences
 *  screens render it and they must not drift. The caller supplies the section
 *  wrapper: the configured screen loops over sections, first-run has one.
 *  Setup must provide `fromAddress`, `fromAddressCustom` and `fromOptions`. */
export const fromAddressSectionStrip = `
  <div style="padding:14px 28px; background:var(--ds-color-surface-sunken);">
    <div class="row items-start no-wrap q-gutter-md">
      <div style="width:270px; flex:none;">
        <ds-select v-model="fromAddress" :options="fromOptions" label="From/Reply Address" required />
      </div>
      <div v-if="fromAddress === 'Other'" style="width:270px; flex:none;">
        <ds-input v-model="fromAddressCustom" type="email" label="Custom From Address" required
          placeholder="teams@traveloc.com" />
      </div>
    </div>
    <div class="text-grey-7" style="font-size:0.8125rem; line-height:1.5; margin-top:8px; white-space:nowrap;">
      Applies to every template in this section. Event Manager and Customer Support Contact
      differ from event to event, so the actual address is resolved as each email sends.
    </div>
  </div>
  <q-separator />`

/** "Add Compliance Reminder" affordance (DES-428 · P0-4).
 *  Outline/bordered, matching the other add-actions in this folder
 *  ("+ Add New Note", "+ Add New Compliance Credit" on Team Detail).
 *
 *  The explanation sits in an info icon rather than a blurb beside the button:
 *  review asked for the help to be available but not permanently occupying the
 *  row, and for the copy to explain what you would USE this for rather than
 *  restating that the limit is gone. */
export const addReminderRow = (handler = 'openAdd') => `
  <div class="row items-center no-wrap" style="padding:12px 28px 16px; gap:8px;">
    <q-btn outline no-caps color="primary" icon="add" label="Add Compliance Reminder" @click="${handler}" style="flex:none;" />
    <q-btn flat round dense color="grey-7" icon="info" size="sm" style="flex:none;" aria-label="About compliance reminder templates">
      <q-tooltip max-width="340px" anchor="center right" self="center left"
        class="text-body2" style="line-height:1.5; padding:10px 12px;">
        Add additional Compliance Reminder templates to set a specific escalating tone or
        cadence to your communications as your event draws closer. Be sure to set the
        <b>Days until Event Start to Begin/End Reminders</b> to avoid overlapping with other
        reminders you have in place.
      </q-tooltip>
    </q-btn>
  </div>`

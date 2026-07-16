/** DES-95 · Customized Page Revamp — shared chrome + field fragments.
 *
 *  These three stories are the CURRENT-STATE baseline recreated in the design
 *  system, so we can edit toward the revamp afterward (single editable page +
 *  "Show map view on hotel list page" flag + four service-contact fields).
 *
 *  - `eventHeader`   → the "Move Testing" event record header (breadcrumb, title,
 *                      Active pill, meta grid, tabs) reused by the Customize
 *                      view/edit screens. Consuming setup must provide a `tab` ref.
 *  - field fragments → small `browseField` / `attachField` / `sectionRule` helpers
 *                      returning template-string markup, composed into each screen.
 */

/* Event record meta — row-major fill lands the three visual columns from the
 * reference (City/State · Room Night Goal · Account Manager, then the next row). */
export const EVENT_META = [
  { label: 'City/State:', value: 'Boston, MA' },
  { label: 'Room Night Goal:', value: '0' },
  { label: 'Account Manager:', value: 'Erica Lessard' },
  { label: 'Event Producer:', value: "Afrim's Sports" },
  { label: 'Peak Night Goal:', value: '0' },
  { label: 'Stay to Play:', value: 'False' },
  { label: 'Start/End Dates:', value: 'Mon, 03/01/2027 - Wed, 03/03/2027' },
]

/* Event detail tab bar. Customize is active on both baseline screens. */
export const EVENT_TABS = ['Hotels', 'RFPs', 'Venues', 'Notes', 'Groups', 'Reservations', 'Waitlist', 'Pickup', 'Registration', 'Customize', 'Activity Logs']

/** The full "Move Testing" event record header (DsPageHeader + DsInfoGrid + tabs).
 *  Setup must expose `meta` (EVENT_META), `eventTabs` (EVENT_TABS) and a `tab` ref. */
export const eventHeader = `
  <ds-page-header title="Move Testing">
    <template #breadcrumb>
      <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2">
        <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
        <q-breadcrumbs-el label="Events" />
        <q-breadcrumbs-el label="Move Testing" class="text-grey-6" />
      </q-breadcrumbs>
    </template>
    <template #badge>
      <q-btn dense no-caps unelevated color="positive" text-color="white" class="q-px-sm" style="border-radius:6px;">
        Active <q-icon name="arrow_drop_down" size="20px" />
      </q-btn>
    </template>
    <template #actions>
      <q-btn unelevated no-caps color="primary" label="Edit Event" />
      <q-btn flat round dense icon="more_horiz" color="grey-7" />
    </template>
    <template #meta><ds-info-grid :items="meta" min-col-width="300px" label-width="140px" /></template>
    <template #tabs>
      <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left"
        class="text-grey-7" mobile-arrows outside-arrows>
        <q-tab v-for="t in eventTabs" :key="t" :name="t.toLowerCase().replace(/ /g,'-')" :label="t" />
      </q-tabs>
    </template>
  </ds-page-header>`

/** The standardized "Choose Image [Browse]" file field (DsFileField). `key` binds
 *  it to the story's reactive `files` object; `displayValue` shows an already-
 *  uploaded filename. Consuming story must register DsFileField + expose `files`. */
export const browseField = (label, tooltip = '', key, displayValue = '') => `
  <ds-file-field label="${label}"${tooltip ? ` tooltip="${tooltip}"` : ''} v-model="files.${key}"${displayValue ? ` display-value="${displayValue}"` : ''} style="max-width:560px;" />`

/** Standard single-line field width. Matches the original Edit Live Event, where
 *  the logo/upload + short fields sit narrower than the primary Event Name field. */
export const FIELD_W = '360px'

/** Paperclip attach field (the Edit Live Event reference uses this style). */
export const attachField = (label, tooltip = '', value = '') => `
  <ds-field label="${label}"${tooltip ? ` tooltip="${tooltip}"` : ''} style="max-width:${FIELD_W};">
    <q-input class="ds-attach" outlined dense hide-bottom-space
      ${value ? `model-value="${value}"` : ''} readonly>
      <template #append><q-icon name="attach_file" color="grey-6" size="20px" /></template>
    </q-input>
  </ds-field>`

/** A plain, interactive checkbox row (native QCheckbox). `modelKey` binds it to
 *  the story's reactive `checks` object, so the box actually toggles — its initial
 *  state is whatever the story seeds `checks[modelKey]` with. */
export const checkRow = (label, modelKey) => `
  <q-checkbox v-model="checks.${modelKey}" color="primary" class="text-grey-8" label="${label}" dense />`

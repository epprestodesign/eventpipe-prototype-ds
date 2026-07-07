/** DES-207 / V1 · Notifications Preferences (Phase 1) — full App Shell experience. */
import { ref, watchEffect } from 'vue'
import { page } from '../pages/_shell'
import { travelocHeader, companySettingsSections } from './_des207'
import DsListItem from '../../components/DsListItem.vue'
import DsSectionHeader from '../../components/DsSectionHeader.vue'
import DsInfoGrid from '../../components/DsInfoGrid.vue'

export default {
  title: 'Design Requests/🟢 DES-207 Communications | Email Template Editor/V1 · Notifications Preferences',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Phase 1 in the App Shell (Companies → Traveloc). **General** tab shows the full company settings; **Notifications** tab shows collapsible **Section Accordions** of **Notification Rows** — Send-Email checkbox (locked when required) + a **Custom** badge beside the title + a split **Edit ▾** dropdown — plus the temporary **Announcement Notice**.' } } },
}

const SECTIONS = [
  { name: 'Teams Management', open: true, items: [
    { title: 'STP - Compliance Reminder - Early Stage', desc: 'Reminds non-compliant teams about their Stay-to-Play requirement; the cadence and tone here are intentionally encouraging rather than punitive.', send: true, forced: false, custom: true },
    { title: 'STP - Compliance Reminder - Escalation', desc: 'A firmer follow-up for teams still below their room-night commitment as the deadline nears.', send: true, forced: false, custom: false },
    { title: 'STP - Welcome Email', desc: 'Introduces the team to their booking site and requirements.', send: true, forced: false, custom: false },
    { title: 'STP - Previously Compliant Notice', desc: 'Notifies a team that was previously meeting its requirement but has since fallen out of compliance — it summarizes the current shortfall, the criteria that must be met, and the deadline before penalties apply.', send: true, forced: false, custom: true },
    { title: 'STP - Deadline Approaching', desc: 'A time-sensitive reminder sent a few days before the hotel cutoff so teams can book remaining rooms.', send: false, forced: false, custom: false },
    { title: 'STP - Compliance Achieved', desc: 'Congratulates a team once it meets its requirement.', send: true, forced: false, custom: false },
  ] },
  { name: 'Guests', open: false, items: [
    { title: 'Reservation Confirmation', desc: 'Contains reservation details, including dates, location, and confirmation number.', send: true, forced: true, custom: false },
    { title: 'Hotel Confirmation', desc: 'Includes the reservation confirmation number and key booking details.', send: true, forced: false, custom: true },
    { title: 'Pre - Arrival', desc: 'Provides important details to help guests prepare for their upcoming stay.', send: false, forced: false, custom: false },
    { title: 'Reservation Cancellation', desc: 'Confirms that a reservation has been canceled, including relevant details.', send: true, forced: true, custom: false },
  ] },
  { name: 'Hotels', open: false, items: [
    { title: 'Hotel User Account Creation', desc: 'Provides account access details for a new hotel user account.', send: true, forced: false, custom: false },
    { title: 'RFP Invite', desc: 'Invites the hotel user to submit a proposal for an upcoming opportunity.', send: false, forced: false, custom: false },
    { title: 'Contract Fully Executed', desc: 'Confirms the contract has been signed and is now finalized.', send: true, forced: true, custom: false },
  ] },
]

const TITLE_STYLE = 'font-size:0.9375rem; font-weight:700; color:var(--ds-color-text);'
// Shared column widths so the "Send Email" / "Template" headers line up with the controls.
const COL_SEND = 'width:96px; display:flex; align-items:center; justify-content:center;'
const COL_TMPL = 'width:132px; display:flex; align-items:center; justify-content:center; margin-left:24px;'
const COL_HEAD = 'font-size:0.8125rem; font-weight:600; color:var(--ds-color-text-subtle); text-align:center;'
const colHeaders = `
  <div style="padding:14px 28px 4px; display:flex; justify-content:flex-end;">
    <div style="${COL_SEND}${COL_HEAD}">Send Email</div>
    <div style="${COL_TMPL}${COL_HEAD}">Template</div>
  </div>`

const notice = `
  <div v-if="noticeShown" style="display:flex; align-items:flex-start; gap:12px; padding:16px 20px;
    background:var(--ds-color-background-info); border:1px solid var(--ds-color-background-info-bold); border-radius:var(--ds-radius-md);">
    <q-icon name="info" color="primary" size="22px" style="margin-top:1px; flex:none;" />
    <div style="flex:1;">
      <div class="text-weight-bold text-grey-9">New notification section</div>
      <div class="text-grey-8" style="margin-top:2px;">For day one, this section only supports <b>Teams Management</b> notifications. Over time, more email templates from across the system will come online here.</div>
    </div>
    <q-btn flat no-caps color="primary" label="Dismiss" style="flex:none; align-self:center;" @click="noticeShown = false" />
  </div>`

const sectionsMarkup = `
  <q-card flat bordered v-for="s in sections" :key="s.name">
    <q-expansion-item :default-opened="s.open" :label="s.name" header-class="text-primary text-weight-bold">
      <q-separator />
      ${colHeaders}
      <template v-for="(it, i) in s.items" :key="it.title">
        <q-separator v-if="i > 0" />
        <div style="padding:8px 28px;">
          <ds-list-item :subtitle="it.desc" :bordered="false">
            <template #title>
              <span class="row items-center q-gutter-sm">
                <strong style="${TITLE_STYLE}">{{ it.title }}</strong>
                <q-badge v-if="it.custom" color="primary" class="q-px-sm q-py-xs">Custom</q-badge>
              </span>
            </template>
            <template #trailing>
              <div class="row items-center no-wrap">
                <div style="${COL_SEND}">
                  <q-checkbox v-model="it.send" :disable="it.forced" color="primary"><q-tooltip v-if="it.forced">Required — always sent</q-tooltip></q-checkbox>
                </div>
                <div style="${COL_TMPL}">
                  <q-btn-dropdown split unelevated no-caps color="primary" label="Edit">
                    <q-list style="min-width:190px">
                      <q-item clickable v-close-popup><q-item-section avatar><q-icon name="edit" /></q-item-section><q-item-section>Edit template</q-item-section></q-item>
                      <q-item clickable v-close-popup><q-item-section avatar><q-icon name="visibility" /></q-item-section><q-item-section>Preview</q-item-section></q-item>
                      <template v-if="it.custom">
                        <q-separator />
                        <q-item clickable v-close-popup><q-item-section avatar><q-icon name="undo" color="negative" /></q-item-section><q-item-section class="text-negative">Revert to default</q-item-section></q-item>
                      </template>
                    </q-list>
                  </q-btn-dropdown>
                </div>
              </div>
            </template>
          </ds-list-item>
        </div>
      </template>
    </q-expansion-item>
  </q-card>`

const settingsMarkup = `
  <div>
    <div v-for="s in settings" :key="s.title" style="margin-bottom:20px;">
      <ds-section-header :title="s.title" variant="accent" />
      <q-card flat bordered><q-card-section style="padding:20px 28px;"><ds-info-grid :items="s.items" layout="stacked" min-col-width="260px" /></q-card-section></q-card>
    </div>
  </div>`

// Storybook controls: a Header + Subtext text control for every email template,
// grouped by section. Keys map back onto SECTIONS[si].items[ii].
const TEMPLATE_ARG_TYPES = {}
const TEMPLATE_ARGS = {}
SECTIONS.forEach((s, si) => {
  s.items.forEach((it, ii) => {
    const base = `s${si}i${ii}`
    TEMPLATE_ARG_TYPES[`${base}_title`] = { name: `${it.title} · Header`, control: 'text', table: { category: s.name } }
    TEMPLATE_ARG_TYPES[`${base}_desc`] = { name: `${it.title} · Subtext`, control: 'text', table: { category: s.name } }
    TEMPLATE_ARGS[`${base}_title`] = it.title
    TEMPLATE_ARGS[`${base}_desc`] = it.desc
  })
})
// Rebuild the sections tree, applying any header/subtext overrides from controls.
function sectionsFromArgs(args = {}) {
  return SECTIONS.map((s, si) => ({
    ...s,
    items: s.items.map((it, ii) => ({
      ...it,
      title: args[`s${si}i${ii}_title`] ?? it.title,
      desc: args[`s${si}i${ii}_desc`] ?? it.desc,
    })),
  }))
}

export const Default = page({
  active: 'none',
  org: 'Traveloc',
  user: 'Mike Addesa',
  components: { DsListItem, DsSectionHeader, DsInfoGrid },
  setup: (args) => {
    // Rebuild the sections whenever a Header/Subtext control changes (args is
    // reactive in Storybook's Vue renderer), so edits preview live — no Save needed.
    const sections = ref([])
    watchEffect(() => { sections.value = sectionsFromArgs(args) })
    return { sections, settings: companySettingsSections, tab: ref('notifications'), noticeShown: ref(true) }
  },
  slot: `
    ${travelocHeader}
    <div v-show="tab === 'notifications'" style="padding:24px 32px 40px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-md">
        ${notice}
        <ds-section-header title="Notifications Preferences" subtitle="Manage all of the notifications sent to your users." variant="accent" />
        ${sectionsMarkup}
      </div>
    </div>
    <div v-show="tab === 'general'" style="padding:24px 32px 40px; background:var(--ds-color-surface-sunken); min-height:100%;">
      ${settingsMarkup}
    </div>`,
})
Default.parameters = { layout: 'fullscreen' }
Default.argTypes = TEMPLATE_ARG_TYPES
Default.args = TEMPLATE_ARGS

/* ---- Locked / Upsell: company without Teams Management ---- */
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

const lockedSectionMarkup = `
  <div style="position:relative;">
    <q-card flat bordered style="opacity:0.6; pointer-events:none;">
      <q-expansion-item default-opened label="Teams Management" header-class="text-grey-7 text-weight-bold">
        <q-separator />
        ${colHeaders}
        <template v-for="(it, i) in locked" :key="it.title">
          <q-separator v-if="i > 0" />
          <div style="padding:8px 28px;">
            <ds-list-item :subtitle="it.desc" :bordered="false">
              <template #title><strong style="${TITLE_STYLE} color:var(--ds-color-text-subtle);">{{ it.title }}</strong></template>
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

export const LockedUpsell = page({
  active: 'none',
  org: 'Traveloc',
  user: 'Mike Addesa',
  components: { DsListItem, DsSectionHeader, DsInfoGrid },
  setup: () => ({ locked: SECTIONS[0].items, settings: companySettingsSections, tab: ref('notifications'), noticeShown: ref(true) }),
  slot: `
    ${travelocHeader}
    <div v-show="tab === 'notifications'" style="padding:24px 32px 40px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-md">
        ${notice}
        <ds-section-header title="Notifications Preferences" subtitle="Manage all of the notifications sent to your users." variant="accent" />
        ${upsellBanner}
        ${lockedSectionMarkup}
      </div>
    </div>
    <div v-show="tab === 'general'" style="padding:24px 32px 40px; background:var(--ds-color-surface-sunken); min-height:100%;">
      ${settingsMarkup}
    </div>`,
})
LockedUpsell.parameters = { layout: 'fullscreen' }

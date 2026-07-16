/** DES-207 / V1 · Notifications Preferences (Phase 1) — full App Shell experience.
 *  Template copy lives in ./des207-content.json. Editing is done through
 *  Storybook's native Controls panel (a Header + Subtext control per template).
 *  The "Publish content" toolbar button (top of the canvas) holds the GitHub
 *  token + Save / Discard — Save commits the edited copy to main so it sticks
 *  for everyone. See .storybook/manager.js for the toolbar addon. */
import { ref, watchEffect } from 'vue'
import { useQuasar } from 'quasar'
import { page } from '../pages/_shell'
import { travelocHeader, companySettingsSections } from './_des207'
import contentData from './des207-content.json'
import DsListItem from '../../components/DsListItem.vue'
import DsSectionHeader from '../../components/DsSectionHeader.vue'
import DsInfoGrid from '../../components/DsInfoGrid.vue'
import DsConfirmDialog from '../../components/DsConfirmDialog.vue'
// Vue + Quasar (TypeScript) reference source, shown in the "Implementation" panel.
import composableSrc from '../../app/notifications/useNotificationPreferences.ts?raw'
import rowSrc from '../../app/notifications/NotificationRow.vue?raw'
import sectionSrc from '../../app/notifications/NotificationSection.vue?raw'
import pageSrc from '../../app/notifications/NotificationsPreferencesPage.vue?raw'

const SECTIONS = contentData.sections

export default {
  title: 'Design Requests/DES-207 Communications | Email Template Editor/V1 · Notifications Preferences',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Phase 1 in the App Shell (Companies → Traveloc). Edit each template’s **Header / Subtext** in the **Controls** panel, then use the **Publish content** button in the Storybook toolbar to **Save** (commit to `main`, redeploy for everyone) or **Discard**.' } } },
}

const TITLE_STYLE = 'font-size:0.9375rem; font-weight:500; color:var(--ds-color-text);'
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
  <div v-if="noticeShown" style="display:flex; align-items:flex-start; gap:12px; padding:16px 20px; margin-bottom:40px;
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
      <template v-for="(it, i) in s.items" :key="i">
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
                  <q-checkbox :model-value="it.send" @update:model-value="onToggleSend(it, $event)" :disable="it.forced" color="primary"><q-tooltip v-if="it.forced">Required — always sent</q-tooltip></q-checkbox>
                </div>
                <div style="${COL_TMPL}">
                  <q-btn-dropdown split unelevated no-caps color="primary" label="Edit">
                    <q-list style="min-width:190px">
                      <q-item clickable v-close-popup><q-item-section avatar><q-icon name="edit" /></q-item-section><q-item-section>Edit template</q-item-section></q-item>
                      <q-item clickable v-close-popup><q-item-section avatar><q-icon name="visibility" /></q-item-section><q-item-section>Preview</q-item-section></q-item>
                      <template v-if="it.custom">
                        <q-separator />
                        <q-item clickable v-close-popup @click="openRevert(it)"><q-item-section avatar><q-icon name="undo" color="negative" /></q-item-section><q-item-section class="text-negative">Revert to default</q-item-section></q-item>
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

// Native Storybook Controls: a Header + Subtext control per template, grouped by
// section. Keys (sNiM_title / _desc) map back onto SECTIONS[N].items[M] — the
// "Publish content" toolbar addon reads the same keys to commit to GitHub.
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
  components: { DsListItem, DsSectionHeader, DsInfoGrid, DsConfirmDialog },
  setup: (args) => {
    // args is reactive in Storybook's Vue renderer — rebuild sections when a
    // Header/Subtext control changes so edits preview live.
    const sections = ref([])
    watchEffect(() => { sections.value = sectionsFromArgs(args) })
    // Revert-to-default confirmation (destructive edge case).
    const revertOpen = ref(false)
    const revertTarget = ref(null)
    const openRevert = (it) => { revertTarget.value = it; revertOpen.value = true }
    const confirmRevert = () => { if (revertTarget.value) revertTarget.value.custom = false }
    // Toast on every Send-Email toggle.
    const $q = useQuasar()
    const onToggleSend = (it, value) => {
      it.send = value
      $q.notify({
        message: it.title,
        caption: value ? 'Send email turned on' : 'Send email turned off',
        icon: value ? 'mark_email_read' : 'unsubscribe',
        color: value ? 'positive' : 'grey-8',
        position: 'bottom-right',
        timeout: 2200,
      })
    }
    return { sections, settings: companySettingsSections, tab: ref('notifications'), noticeShown: ref(true), revertOpen, revertTarget, openRevert, confirmRevert, onToggleSend }
  },
  slot: `
    ${travelocHeader}
    <div v-show="tab === 'notifications'" style="padding:40px 32px; background:var(--ds-color-surface-sunken); min-height:100%;">
      ${notice}
      <ds-section-header title="Notifications Preferences" subtitle="Manage all of the notifications sent to your users." variant="accent" />
      <div style="display:flex; flex-direction:column; gap:16px; margin-top:12px;">
        ${sectionsMarkup}
      </div>
      <ds-confirm-dialog v-model="revertOpen" title="Revert to default template?" destructive
        confirm-label="Revert to default" cancel-label="Keep custom" @confirm="confirmRevert">
        <template #body>
          This replaces <strong>{{ revertTarget?.title }}</strong> with the EventPipe default
          template. Your company's custom changes will be <strong>permanently discarded</strong>
          and can't be recovered.
        </template>
      </ds-confirm-dialog>
    </div>
    <div v-show="tab === 'general'" style="padding:40px 32px; background:var(--ds-color-surface-sunken); min-height:100%;">
      ${settingsMarkup}
    </div>`,
})
Default.parameters = {
  layout: 'fullscreen',
  implementation: {
    intro: 'Vue 3 + Quasar (TypeScript) reference — the real components behind this page. Page → Section → Row, with state in a composable.',
    files: [
      { name: 'useNotificationPreferences.ts', lang: 'typescript', code: composableSrc },
      { name: 'NotificationRow.vue', lang: 'html', code: rowSrc },
      { name: 'NotificationSection.vue', lang: 'html', code: sectionSrc },
      { name: 'NotificationsPreferencesPage.vue', lang: 'html', code: pageSrc },
    ],
  },
}
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
        <template v-for="(it, i) in locked" :key="i">
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
  setup: () => ({ locked: contentData.sections[0].items, settings: companySettingsSections, tab: ref('notifications'), noticeShown: ref(true) }),
  slot: `
    ${travelocHeader}
    <div v-show="tab === 'notifications'" style="padding:40px 32px; background:var(--ds-color-surface-sunken); min-height:100%;">
      ${notice}
      <ds-section-header title="Notifications Preferences" subtitle="Manage all of the notifications sent to your users." variant="accent" />
      <div style="display:flex; flex-direction:column; gap:16px; margin-top:12px;">
        ${upsellBanner}
        ${lockedSectionMarkup}
      </div>
    </div>
    <div v-show="tab === 'general'" style="padding:40px 32px; background:var(--ds-color-surface-sunken); min-height:100%;">
      ${settingsMarkup}
    </div>`,
})
LockedUpsell.parameters = { layout: 'fullscreen' }

/** DES-207 / V1 · Notifications Preferences (Phase 1) — full App Shell experience.
 *  The template copy lives in ./des207-content.json. "Edit content" makes each
 *  Header/Subtext editable inline; "Save to GitHub" commits the updated JSON to
 *  main via the GitHub API (using the editor's own token, kept in this browser),
 *  which redeploys the site so the change sticks for everyone. */
import { ref, computed, watch, nextTick } from 'vue'
import { page } from '../pages/_shell'
import { travelocHeader, companySettingsSections } from './_des207'
import contentData from './des207-content.json'
import DsListItem from '../../components/DsListItem.vue'
import DsSectionHeader from '../../components/DsSectionHeader.vue'
import DsInfoGrid from '../../components/DsInfoGrid.vue'

export default {
  title: 'Design Requests/🟢 DES-207 Communications | Email Template Editor/V1 · Notifications Preferences',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Phase 1 in the App Shell (Companies → Traveloc). **General** tab shows the full company settings; **Notifications** tab shows collapsible **Section Accordions** of **Notification Rows**. Template copy is stored in `des207-content.json`; **Edit content → Save to GitHub** commits changes back to the repo so they persist for all users.' } } },
}

// Where the copy lives in the repo, for the Save-to-GitHub commit.
const GH = { owner: 'epprestodesign', repo: 'eventpipe-prototype-ds', branch: 'main', path: 'src/stories/design-requests/des207-content.json' }

const TITLE_STYLE = 'font-size:0.9375rem; font-weight:700; color:var(--ds-color-text);'
const SUB_STYLE = 'display:block; font-size:0.8125rem; color:var(--ds-color-text-subtle); line-height:1.5;'
const EDIT_AFFORD = "outline:1px dashed var(--ds-color-border-bold); border-radius:4px; padding:1px 6px; cursor:text; background:var(--ds-color-surface);"
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

// Edit toolbar: toggle edit mode, enter a GitHub token, Save (commit) / Cancel.
const editBar = `
  <div style="display:flex; flex-direction:column; gap:6px;">
    <div class="row items-center justify-end q-gutter-sm">
      <q-btn v-if="!editMode" outline no-caps color="primary" icon="edit_note" label="Edit content" @click="editMode = true" />
      <template v-else>
        <q-input v-model="token" dense outlined type="password" placeholder="GitHub token (write access)" style="width:280px" hide-bottom-space>
          <template #prepend><q-icon name="key" size="18px" /></template>
        </q-input>
        <q-btn flat no-caps color="grey-8" label="Cancel" @click="cancelEdit" />
        <q-btn unelevated no-caps color="primary" icon="cloud_upload" :loading="saving" label="Save to GitHub" @click="save" />
      </template>
    </div>
    <div v-if="editMode" class="text-caption text-grey-7" style="text-align:right;">
      Click any header or description to edit. Your token stays in this browser and is sent only to GitHub. Saving commits to <b>main</b> and redeploys (~1–2 min), then everyone sees it.
    </div>
    <div v-if="status" class="text-caption" :class="statusOk ? 'text-positive' : 'text-negative'" style="text-align:right; font-weight:600;">{{ status }}</div>
  </div>`

const sectionsMarkup = `
  <q-card flat bordered v-for="s in sections" :key="s.name">
    <q-expansion-item :default-opened="s.open" :label="s.name" header-class="text-primary text-weight-bold">
      <q-separator />
      ${colHeaders}
      <template v-for="(it, i) in s.items" :key="i">
        <q-separator v-if="i > 0" />
        <div style="padding:8px 28px;">
          <ds-list-item :bordered="false">
            <template #title>
              <span class="row items-center q-gutter-sm">
                <strong :contenteditable="editMode" @blur="it.title = $event.target.innerText"
                  style="${TITLE_STYLE}" :style="editMode ? '${EDIT_AFFORD}' : ''">{{ it.title }}</strong>
                <q-badge v-if="it.custom" color="primary" class="q-px-sm q-py-xs">Custom</q-badge>
              </span>
            </template>
            <template #subtitle>
              <span :contenteditable="editMode" @blur="it.desc = $event.target.innerText"
                style="${SUB_STYLE}" :style="editMode ? '${EDIT_AFFORD}' : ''">{{ it.desc }}</span>
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

export const Default = page({
  active: 'none',
  org: 'Traveloc',
  user: 'Mike Addesa',
  components: { DsListItem, DsSectionHeader, DsInfoGrid },
  setup: () => {
    const content = ref(JSON.parse(JSON.stringify(contentData)))
    const sections = computed(() => content.value.sections)
    const editMode = ref(false)
    const token = ref((() => { try { return localStorage.getItem('ep_gh_token') || '' } catch (e) { return '' } })())
    watch(token, (v) => { try { localStorage.setItem('ep_gh_token', v || '') } catch (e) {} })
    const saving = ref(false)
    const status = ref('')
    const statusOk = ref(true)
    const setStatus = (msg, ok) => { status.value = msg; statusOk.value = ok }

    function cancelEdit() {
      content.value = JSON.parse(JSON.stringify(contentData))
      editMode.value = false
      setStatus('', true)
    }

    async function save() {
      // Flush the field the cursor is in so its latest text is captured.
      if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur()
      await nextTick()
      if (!token.value) { setStatus('Enter a GitHub token with write access first.', false); return }
      saving.value = true; setStatus('Saving…', true)
      try {
        const api = `https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${GH.path}`
        const headers = { Authorization: `token ${token.value}`, Accept: 'application/vnd.github+json' }
        const cur = await fetch(`${api}?ref=${GH.branch}`, { headers })
        if (!cur.ok) throw new Error(cur.status === 401 ? 'Token rejected (401) — check it has repo write access.' : `Couldn't read the file (${cur.status}).`)
        const meta = await cur.json()
        const text = JSON.stringify({ sections: content.value.sections }, null, 2) + '\n'
        const b64 = btoa(unescape(encodeURIComponent(text))) // UTF-8-safe base64
        const res = await fetch(api, {
          method: 'PUT', headers,
          body: JSON.stringify({ message: 'content(des-207): update notification template copy', content: b64, sha: meta.sha, branch: GH.branch }),
        })
        if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || `Save failed (${res.status}).`) }
        const out = await res.json()
        setStatus(`Saved ✓ commit ${out.commit.sha.slice(0, 7)} — redeploying (~1–2 min), then everyone sees it.`, true)
        editMode.value = false
      } catch (e) {
        setStatus(`Error: ${e.message}`, false)
      } finally { saving.value = false }
    }

    return {
      sections, settings: companySettingsSections, tab: ref('notifications'), noticeShown: ref(true),
      editMode, token, saving, status, statusOk, save, cancelEdit,
    }
  },
  slot: `
    ${travelocHeader}
    <div v-show="tab === 'notifications'" style="padding:24px 32px 40px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-md">
        ${notice}
        <ds-section-header title="Notifications Preferences" subtitle="Manage all of the notifications sent to your users." variant="accent" />
        ${editBar}
        ${sectionsMarkup}
      </div>
    </div>
    <div v-show="tab === 'general'" style="padding:24px 32px 40px; background:var(--ds-color-surface-sunken); min-height:100%;">
      ${settingsMarkup}
    </div>`,
})
Default.parameters = { layout: 'fullscreen' }

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

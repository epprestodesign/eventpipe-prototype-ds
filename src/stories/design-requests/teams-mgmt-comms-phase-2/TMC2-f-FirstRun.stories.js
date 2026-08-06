/** Teams Mgmt Comms Phase 2 / First-Time Setup / Notification Preferences.
 *
 *  The Notifications tab exactly as a brand-new Teams Management customer finds
 *  it, before anyone has configured anything: the three seeded templates from
 *  DES-427 and nothing else. No custom templates, no renames, no deletions —
 *  the state Scott's launch checklist starts from.
 */
import { ref, computed } from 'vue'
import { tmc2Page } from './_tmc2shell'
import { COMPANY, DEFAULT_EMAILS, FROM_ADDRESS_OPTIONS, FROM_ADDRESS_RESOLVED } from './_tmc2fixtures'
import {
  companyHeader, colHeaders, fromAddressCard, addReminderRow, templateActions,
  LIST_TITLE_STYLE, COL_SEND, COL_TMPL,
} from './_tmc2'
import DsListItem from './components/DsListItem.vue'
import DsSectionHeader from './components/DsSectionHeader.vue'
import DsSelect from './components/DsSelect.vue'
import DsInput from './components/DsInput.vue'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/First-Time Setup/Notification Preferences',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
**[DES-427 · P0-3](https://linear.app/eventpipe/issue/DES-427)** — what a first-time
customer sees.

Every customer is seeded with exactly three Teams Management templates. This is
that state: no custom reminders added, nothing renamed, nothing disabled.

| Template | Sends to | When |
| --- | --- | --- |
| **Welcome Email** | Team Housing Contact | Once, when a team first appears |
| **Compliance Reminder** | Team Housing Contact + Group Block Creators | Weekly (Mon), 200 days out → event start |
| **Previously Compliant Notice** | Team Housing Contact + Group Block Creators | Once, when a compliant team drops below |

Two things a first-time user meets here:

1. **Every template defaults to Send Email OFF at the event level.** Company-level
   templates exist and are enabled, but per [DES-425 · P0-1](https://linear.app/eventpipe/issue/DES-425)
   nothing actually sends until it is switched on for a given event. The banner
   below says so, because "why is nothing sending?" is the obvious first question.
2. **The From/Reply address is unset.** [DES-429 · P0-5](https://linear.app/eventpipe/issue/DES-429)
   requires one before anything can send, so it shows as a required, empty field.

The email bodies themselves are in *First-Time Setup › Default Emails*.

> The template copy is **draft**. The spec records it as "Pending Default
> Template Body" and [DES-447](https://linear.app/eventpipe/issue/DES-447) assigns
> the real wording to Scott.
` } } },
}


const firstRunBanner = `
  <div style="display:flex; align-items:flex-start; gap:12px; padding:16px 20px; margin-bottom:24px;
    background:var(--ds-color-background-info); border:1px solid var(--ds-color-background-info-bold); border-radius:var(--ds-radius-md);">
    <q-icon name="flag" color="primary" size="22px" style="margin-top:1px; flex:none;" />
    <div style="flex:1;">
      <div class="text-weight-bold text-grey-9">Teams Management communications are ready to set up</div>
      <div class="text-grey-8" style="margin-top:2px; line-height:1.5;">
        These three templates come with every account. Before anything sends you need to
        <b>set a From/Reply address</b> below, and <b>switch templates on per event</b> from that
        event's Registration Settings tab. Nothing is sent until you do.
      </div>
    </div>
  </div>`


const seededList = `
  <q-card flat bordered>
    <q-expansion-item default-opened label="Teams Management" header-class="text-primary text-weight-bold">
      <q-separator />
      ${colHeaders}
      <template v-for="(it, i) in seeded" :key="it.key">
        <q-separator v-if="i > 0" />
        <div style="padding:8px 28px;">
          <ds-list-item :subtitle="it.purpose" :bordered="false">
            <template #title>
              <span class="row items-center q-gutter-sm">
                <strong style="${LIST_TITLE_STYLE}">{{ it.title }}</strong>
                <q-badge color="grey-7" class="q-px-sm q-py-xs">Default</q-badge>
              </span>
            </template>
            <template #trailing>
              <div class="row items-center no-wrap">
                <div style="${COL_SEND}"><q-checkbox v-model="it.on" color="primary" /></div>
                <div style="${COL_TMPL}">${templateActions({ onEdit: 'noop' })}</div>
              </div>
            </template>
          </ds-list-item>
        </div>
      </template>
      <q-separator />
      ${addReminderRow('noop')}
    </q-expansion-item>
  </q-card>`

export const FirstRun = tmc2Page({
  active: 'none',
  components: { DsListItem, DsSectionHeader, DsSelect, DsInput },
  setup: () => {
    const fromAddress = ref(null)
    const fromAddressCustom = ref('')
    // Same resolution the configured screen uses, so the two agree once a value
    // is picked. Nothing is set on first run, so the card shows its unset state.
    const resolvedFrom = computed(() =>
      fromAddress.value === 'Other'
        ? (fromAddressCustom.value || 'your custom address')
        : (FROM_ADDRESS_RESOLVED[fromAddress.value] || ''))
    return {
      company: COMPANY,
      tab: ref('notifications'),
      fromAddress,
      fromAddressCustom,
      fromOptions: FROM_ADDRESS_OPTIONS,
      resolvedFrom,
      // First run is a static state — the shared row actions are wired to a
      // no-op here rather than duplicating the editor drill-in.
      noop: () => {},
      seeded: ref(DEFAULT_EMAILS.map((e) => ({ key: e.key, title: e.title, purpose: e.purpose, on: true }))),
    }
  },
  slot: `
    ${companyHeader}
    <div v-show="tab === 'notifications'" style="padding:40px 32px; background:var(--ds-color-surface-sunken); min-height:100%;">
      ${firstRunBanner}
      <ds-section-header title="Notifications Preferences" subtitle="Manage all of the notifications sent to your users." variant="accent" />
      <div style="margin-top:12px;">
        ${fromAddressCard}
        ${seededList}
      </div>
    </div>
    <div v-show="tab === 'general'" style="padding:40px 32px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="text-grey-7">General company settings.</div>
    </div>`,
})
FirstRun.parameters = { layout: 'fullscreen' }

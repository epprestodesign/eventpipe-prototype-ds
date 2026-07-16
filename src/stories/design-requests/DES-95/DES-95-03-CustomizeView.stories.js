/** DES-95 / 071626 / 03 · Customize — read-only view with PER-FIELD inline editing.
 *
 *  The single-page direction: the read-only view display, but each field carries a
 *  pencil affordance. Clicking a pencil turns just that field into an input; while
 *  any field is being edited a "Save" button appears where "Edit Information" used
 *  to sit. Includes the new Customer Service Details fields (same data as 02). */
import { ref, reactive, computed } from 'vue'
import { page } from '../../pages/_shell'
import DsPageHeader from '../../../components/DsPageHeader.vue'
import DsInfoGrid from '../../../components/DsInfoGrid.vue'
import DsSectionHeader from '../../../components/DsSectionHeader.vue'
import DsCard from '../../../components/DsCard.vue'
import DsLink from '../../../components/DsLink.vue'
import DsConfirmDialog from '../../../components/DsConfirmDialog.vue'
import { eventHeader, EVENT_META, EVENT_TABS } from './_des95'

export default {
  title: 'Design Requests/DES-95 Customized Page Revamp/Rob Concept #1',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Read-only Customize **view with per-field inline editing**. Each row has a pencil; editing a field turns it into an input, and a **Save** button appears where "Edit Information" was. Includes the new Customer Service Details fields.' } },
  },
}

/* A pencil-editable row: label + (read-only value | inline input), with a pencil
   button when not editing. `key` binds to the story's `editing` / `vals` state. */
const row = (key, label, display, editControl) => `
  <div class="row items-start justify-between no-wrap q-gutter-md">
    <div class="col column q-gutter-xs" style="min-width:0;">
      <div class="text-grey-7" style="font-size:0.8125rem; font-weight:700;">${label}</div>
      <div v-if="!editing.${key}">${display}</div>
      <div v-else style="max-width:520px;">${editControl}</div>
    </div>
    <q-btn v-if="!editing.${key}" flat round dense icon="edit" color="grey-6" @click="editing.${key} = true" style="flex:none;"><q-tooltip>Edit</q-tooltip></q-btn>
  </div>`

// Field-type fragments.
const imgDisplay = `<div class="row items-center q-gutter-sm text-grey-6"><q-icon name="hide_image" size="24px" color="grey-5" /><i>No image provided.</i></div>`
const imgEdit = `<q-input outlined dense hide-bottom-space readonly placeholder="Choose Image"><template #append><q-icon name="attach_file" color="grey-6" size="20px" /></template></q-input>`
const valOr = (k, ph = 'Not provided.') => `<span class="text-grey-9">{{ vals.${k} }}</span><i v-if="!vals.${k}" class="text-grey-6">${ph}</i>`
const inp = (k, ph = '') => `<q-input outlined dense hide-bottom-space v-model="vals.${k}"${ph ? ` placeholder="${ph}"` : ''} />`
const flag = (k) => `<q-select outlined dense hide-bottom-space v-model="vals.${k}" :options="['Yes','No']" />`

/* Same pencil row, but keyed by a runtime expression (for v-for'd lists that can
   grow via "Add another…"). `editKey` is a JS expr like editing['diImg'+i]. */
const dynRow = (label, editKey, display, editControl) => `
  <div class="row items-start justify-between no-wrap q-gutter-md">
    <div class="col column q-gutter-xs" style="min-width:0;">
      <div class="text-grey-7" style="font-size:0.8125rem; font-weight:700;">${label}</div>
      <div v-if="!${editKey}">${display}</div>
      <div v-else style="max-width:520px;">${editControl}</div>
    </div>
    <q-btn v-if="!${editKey}" flat round dense icon="edit" color="grey-6" @click="${editKey} = true" style="flex:none;"><q-tooltip>Edit</q-tooltip></q-btn>
  </div>`
// Redirect-URL fragments bound to the loop item (img / ad).
const redirectDisplay = (it) => `<span class="text-grey-9">{{ ${it}.redirect }}</span><i v-if="!${it}.redirect" class="text-grey-6">Not provided.</i>`
const redirectEdit = (it) => `<q-input outlined dense hide-bottom-space v-model="${it}.redirect" placeholder="https://www.example.com" />`

export const Default = page({
  active: 'events',
  org: 'Halpern Travel',
  user: 'Justin Girard',
  components: { DsPageHeader, DsInfoGrid, DsSectionHeader, DsCard, DsLink, DsConfirmDialog },
  setup: () => {
    const editing = reactive({})
    const vals = reactive({
      eventDesc: '', hideLanding: 'No',
      showMap: 'Yes', hideHotel: 'No',
      serviceEmail: 'test@eventpipe.com', phone: '(888) 640-6400', phoneToll: '',
      serviceHours: 'Monday through Friday, 8:30am-5:30pm Eastern Time',
    })
    const displayImages = reactive([{ redirect: '' }])
    const ads = reactive([{ redirect: '' }])
    const addImage = () => displayImages.push({ redirect: '' })
    const addAd = () => ads.push({ redirect: '' })
    const confirmOpen = ref(false)
    const pending = ref(null) // { type: 'image' | 'ad', index }
    const askDelete = (type, i) => { pending.value = { type, index: i }; confirmOpen.value = true }
    const confirmDelete = () => {
      if (!pending.value) return
      if (pending.value.type === 'ad') ads.splice(pending.value.index, 1)
      else displayImages.splice(pending.value.index, 1)
      pending.value = null
    }
    const anyEditing = computed(() => Object.values(editing).some(Boolean))
    const saveAll = () => { for (const k in editing) editing[k] = false }
    return { meta: EVENT_META, eventTabs: EVENT_TABS, tab: ref('customize'), editing, vals, displayImages, ads, addImage, addAd, confirmOpen, pending, askDelete, confirmDelete, anyEditing, saveAll }
  },
  slot: `
    <div style="padding:22px 32px 0; background:var(--ds-color-surface); border-bottom:1px solid var(--ds-color-border-container);">
      ${eventHeader}
    </div>

    <div style="padding:24px 32px 48px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-y-lg">

        <!-- Event Logo — Save appears here (where Edit Information was) while editing -->
        <div>
          <div class="row items-center justify-between no-wrap" style="min-height:40px; margin-bottom:24px;">
            <ds-section-header title="Event Logo" variant="accent" class="col" />
            <q-btn v-if="anyEditing" unelevated no-caps color="primary" label="Save" @click="saveAll" style="flex:none;" />
          </div>
          <ds-card padding="lg">
            <div class="row items-center q-gutter-md no-wrap">
              <div style="width:64px; height:64px; flex:none; border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-sm); display:flex; align-items:center; justify-content:center; background:var(--ds-color-surface-sunken);">
                <q-icon name="image" size="28px" color="grey-5" />
              </div>
              <div>
                <div class="text-weight-bold text-grey-9">EP Logo.png</div>
                <div class="text-grey-7" style="font-size:0.8125rem;">Size: 14.7 kB</div>
                <a href="#" class="row items-center text-negative" style="text-decoration:none; gap:4px; font-size:0.875rem; margin-top:2px;" @click.prevent><q-icon name="delete" size="16px" />Delete</a>
              </div>
            </div>
          </ds-card>
        </div>

        <!-- Landing Page Details + Display Images -->
        <div>
          <ds-section-header title="Landing Page Details" variant="accent" style="margin-bottom:24px;" />
          <ds-card padding="lg">
            <div class="column q-gutter-y-lg">
              ${row('landingLogo', 'Landing Page Logo', imgDisplay, imgEdit)}
              ${row('landingBg', 'Landing Page Background', imgDisplay, imgEdit)}
              ${row('eventDesc', 'Event Description', '<i class="text-grey-6">No description provided.</i>', inp('eventDesc'))}
              ${row('hideLanding', 'Hide Event Name and Event Date on Landing Page?', valOr('hideLanding'), flag('hideLanding'))}
            </div>
            <q-separator class="q-my-lg" />
            <ds-section-header title="Display Images" variant="accent" class="q-mb-md" />
            <div class="column q-gutter-y-lg">
              <div v-for="(img, i) in displayImages" :key="'di'+i" class="column q-gutter-y-lg">
                ${dynRow('Display Image {{ i + 1 }}', "editing['diImg'+i]", imgDisplay, imgEdit)}
                ${dynRow('Redirect URL', "editing['diUrl'+i]", redirectDisplay('img'), redirectEdit('img'))}
                <a href="#" class="row items-center text-negative" style="text-decoration:none; gap:4px; font-size:0.875rem; width:fit-content;" @click.prevent="askDelete('image', i)"><q-icon name="delete" size="16px" />Delete</a>
              </div>
              <div><ds-link href="#" @click.prevent="addImage">Add another image</ds-link></div>
            </div>
          </ds-card>
        </div>

        <!-- Hotel List Details + Advertisements -->
        <div>
          <ds-section-header title="Hotel List Details" variant="accent" style="margin-bottom:24px;" />
          <ds-card padding="lg">
            <div class="column q-gutter-y-lg">
              ${row('hotelLogo', 'Hotel List Logo', imgDisplay, imgEdit)}
              ${row('hotelBg', 'Hotel List Background', imgDisplay, imgEdit)}
              ${row('showMap', 'Show Map View on Hotel List page', valOr('showMap'), flag('showMap'))}
              ${row('hideHotel', 'Hide Event Name and Event Date on Hotel List?', valOr('hideHotel'), flag('hideHotel'))}
            </div>
            <q-separator class="q-my-lg" />
            <ds-section-header title="Advertisements" variant="accent" class="q-mb-md" />
            <div class="column q-gutter-y-lg">
              <div v-for="(ad, i) in ads" :key="'ad'+i" class="column q-gutter-y-lg">
                ${dynRow('Advertisement {{ i + 1 }}', "editing['adImg'+i]", imgDisplay, imgEdit)}
                ${dynRow('Redirect URL', "editing['adUrl'+i]", redirectDisplay('ad'), redirectEdit('ad'))}
                <a href="#" class="row items-center text-negative" style="text-decoration:none; gap:4px; font-size:0.875rem; width:fit-content;" @click.prevent="askDelete('ad', i)"><q-icon name="delete" size="16px" />Delete</a>
              </div>
              <div><ds-link href="#" @click.prevent="addAd">Add another advertisement</ds-link></div>
            </div>
          </ds-card>
        </div>

        <!-- Customer Service Details (NEW, same data as 02) -->
        <div>
          <ds-section-header title="Customer Service Details" variant="accent" style="margin-bottom:24px;" />
          <ds-card padding="lg">
            <div class="column q-gutter-y-lg">
              ${row('serviceEmail', 'Service Email', valOr('serviceEmail'), inp('serviceEmail'))}
              ${row('phone', 'Phone Number', valOr('phone'), inp('phone'))}
              ${row('phoneToll', 'Phone Number (Toll Free)', valOr('phoneToll'), inp('phoneToll', 'Toll Free Phone number'))}
              ${row('serviceHours', 'Service Hours', valOr('serviceHours'), inp('serviceHours'))}
            </div>
          </ds-card>
        </div>

      </div>

      <ds-confirm-dialog v-model="confirmOpen" title="Delete this row?" destructive
        confirm-label="Delete" cancel-label="Cancel" @confirm="confirmDelete">
        <template #body>This removes the {{ pending && pending.type === 'ad' ? 'advertisement' : 'display image' }} and its Redirect URL. This can't be undone.</template>
      </ds-confirm-dialog>
    </div>`,
})
Default.parameters = { layout: 'fullscreen' }

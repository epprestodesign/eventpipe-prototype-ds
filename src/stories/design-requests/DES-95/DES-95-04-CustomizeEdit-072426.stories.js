/** DES-95 / 04 · Customized Event Site Edits 072426 — working duplicate.
 *
 *  A 072426 working copy of the "Customize Event Site" component (edit + read-only
 *  states). This round breaks each section out into its own white card with margin
 *  between them (matching the live Housing Company Policies layout), and pre-loads
 *  3 uploaded images in both the Display Images and Advertisements sections. In the
 *  editable state each image row carries a delete button to its right. */
import { ref, reactive } from 'vue'
import { page } from '../../pages/_shell'
import DsPageHeader from '../../../components/DsPageHeader.vue'
import DsInfoGrid from '../../../components/DsInfoGrid.vue'
import DsSectionHeader from '../../../components/DsSectionHeader.vue'
import DsField from '../../../components/DsField.vue'
import DsInput from '../../../components/DsInput.vue'
import DsFileField from '../../../components/DsFileField.vue'
import DsRichTextEditor from '../../../components/DsRichTextEditor.vue'
import DsLink from '../../../components/DsLink.vue'
import DsCard from '../../../components/DsCard.vue'
import DsNotification from '../../../components/DsNotification.vue'
import { eventHeader, browseField, checkRow, EVENT_META, EVENT_TABS } from './_des95'

const STORY_BASE = 'design-requests-des-95-customized-page-revamp-customized-event-site-edits-072426'

export default {
  title: 'Design Requests/DES-95 Customized Page Revamp/Customized Event Site Edits 072426',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '**072426 working duplicate** of Customize Event Site. Each section is its own card with margin between them (matching the live Housing Company Policies layout). Display Images and Advertisements are pre-loaded with 3 uploaded images each; in the editable state every image row has a delete button.' } },
  },
}

export const Default = page({
  active: 'events',
  org: 'Halpern Travel',
  user: 'Justin Girard',
  components: { DsPageHeader, DsInfoGrid, DsSectionHeader, DsField, DsInput, DsFileField, DsRichTextEditor, DsLink, DsCard },
  setup: () => {
    const displayImages = reactive([
      { file: null, name: 'landing-display-1.png', redirect: 'https://www.example.com' },
      { file: null, name: 'landing-display-2.png', redirect: 'https://www.example.com' },
      { file: null, name: 'landing-display-3.png', redirect: 'https://www.example.com' },
    ])
    const ads = reactive([
      { file: null, name: 'advertisement-1.png', redirect: 'https://www.example.com' },
      { file: null, name: 'advertisement-2.png', redirect: 'https://www.example.com' },
      { file: null, name: 'advertisement-3.png', redirect: 'https://www.example.com' },
    ])
    const addImage = () => displayImages.push({ file: null, name: '', redirect: '' })
    const addAd = () => ads.push({ file: null, name: '', redirect: '' })
    const removeImage = (i) => displayImages.splice(i, 1)
    const removeAd = (i) => ads.splice(i, 1)
    return {
      meta: EVENT_META, eventTabs: EVENT_TABS, tab: ref('customize'),
      checks: reactive({ hideLanding: false, showMap: true, hideHotel: false }),
      files: reactive({ eventLogo: null, landingLogo: null, landingBg: null, hotelLogo: null, hotelBg: null }),
      displayImages, ads, addImage, addAd, removeImage, removeAd,
    }
  },
  slot: `
    <div style="padding:22px 32px 0; background:var(--ds-color-surface); border-bottom:1px solid var(--ds-color-border-container);">
      ${eventHeader}
    </div>

    <div style="padding:24px 32px 48px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div>
        <div class="row items-center justify-between q-gutter-md no-wrap q-mb-md">
          <div style="font-size:1.25rem; font-weight:700; color:var(--ds-color-text-brand);">Customize Event Booking Site</div>
          <div class="row items-center q-gutter-sm no-wrap" style="flex:none;">
            <q-btn outline no-caps color="primary" label="Cancel" href="/?path=/story/${STORY_BASE}--saved" target="_top" />
            <q-btn unelevated no-caps color="primary" label="Save Changes" href="/?path=/story/${STORY_BASE}--saved" target="_top" />
          </div>
        </div>

        <div class="column q-gutter-y-lg">

          <!-- Event Logo -->
          <ds-card padding="lg">
            <ds-section-header title="Event Logo" variant="section" class="q-mb-md" />
            ${browseField('Event Logo', 'The logo shown on the booking site.', 'eventLogo', 'EP Logo.png')}
          </ds-card>

          <!-- Landing Page Details -->
          <ds-card padding="lg">
            <div class="column q-gutter-y-md">
              <ds-section-header title="Landing Page Details" variant="section" />
              ${browseField('Landing Page Logo', 'Displayed on the landing page.', 'landingLogo')}
              ${browseField('Landing Page Background', 'Background image for the landing page.', 'landingBg')}
              <ds-rich-text-editor label="Event Description" min-height="200px" model-value="" layout="description" />
              ${checkRow('Hide Event Name and Event Date on Landing Page.', 'hideLanding')}
            </div>
          </ds-card>

          <!-- Display Images -->
          <ds-card padding="lg">
            <div class="column q-gutter-y-md">
              <ds-section-header title="Display Images" variant="section" />
              <div class="text-grey-8">You can add up to 3 display images to your event booking site landing page. Use PNG or JPG files. Recommended size: 345px x 215px.</div>
              <div v-for="(img, i) in displayImages" :key="'di'+i" class="row items-start q-gutter-md no-wrap">
                <ds-file-field :label="'Display Image ' + (i + 1)" tooltip="Shown on the landing page." v-model="img.file" :display-value="img.name" class="col" />
                <ds-field label="Redirect URL" class="col"><ds-input v-model="img.redirect" placeholder="https://www.example.com" /></ds-field>
                <div style="flex:none; padding-top:23px;">
                  <q-btn flat round dense icon="delete" color="negative" @click="removeImage(i)" style="width:40px; height:40px;"><q-tooltip>Delete</q-tooltip></q-btn>
                </div>
              </div>
              <div><ds-link href="#" @click.prevent="addImage">Add another image</ds-link></div>
            </div>
          </ds-card>

          <!-- Hotel List Details -->
          <ds-card padding="lg">
            <div class="column q-gutter-y-md">
              <ds-section-header title="Hotel List Details" variant="section" />
              ${browseField('Hotel List Logo', 'Displayed on the hotel list page.', 'hotelLogo')}
              ${browseField('Hotel List Background', 'Background image for the hotel list page.', 'hotelBg')}
              ${checkRow('Show Map View on Hotel List page', 'showMap')}
              ${checkRow('Hide Event Name and Event Date on Hotel List.', 'hideHotel')}
            </div>
          </ds-card>

          <!-- Advertisements -->
          <ds-card padding="lg">
            <div class="column q-gutter-y-md">
              <ds-section-header title="Advertisements" variant="section" />
              <div class="text-grey-8">You can add up to 3 display images to your event booking site hotel list page. Use PNG or JPG files. Recommended size: 160px x 320px.</div>
              <div v-for="(ad, i) in ads" :key="'ad'+i" class="row items-start q-gutter-md no-wrap">
                <ds-file-field :label="'Advertisement ' + (i + 1)" tooltip="Shown on the hotel list page." v-model="ad.file" :display-value="ad.name" class="col" />
                <ds-field label="Redirect URL" class="col"><ds-input v-model="ad.redirect" placeholder="https://www.example.com" /></ds-field>
                <div style="flex:none; padding-top:23px;">
                  <q-btn flat round dense icon="delete" color="negative" @click="removeAd(i)" style="width:40px; height:40px;"><q-tooltip>Delete</q-tooltip></q-btn>
                </div>
              </div>
              <div><ds-link href="#" @click.prevent="addAd">Add another advertisement</ds-link></div>
            </div>
          </ds-card>

          <!-- Customer Service Details -->
          <ds-card padding="lg">
            <div class="column q-gutter-y-lg">
              <ds-section-header title="Customer Service Details" variant="section" />
              <div style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); column-gap:32px; row-gap:16px;">
                <div><ds-input label="Service Email" required type="email" model-value="test@eventpipe.com" /></div>
                <div><ds-input label="Phone Number" required type="tel" model-value="(888) 640-6400" /></div>
                <div><ds-input label="Phone Number (Toll Free)" type="tel" placeholder="Toll Free Phone number" /></div>
                <div style="grid-column:1 / span 2;"><ds-input label="Service Hours" required model-value="Monday through Friday, 8:30am-5:30pm Eastern Time" /></div>
              </div>
            </div>
          </ds-card>

        </div>
      </div>
    </div>`,
})
Default.storyName = 'Customize Edits'
Default.parameters = { layout: 'fullscreen' }

/* ------------------------------------------------------------------------- *
 * Read-only state after the user saves — the same page, fields committed and
 * shown as read-only values, each section in its own card. Display Images and
 * Advertisements show the 3 uploaded assets.
 * ------------------------------------------------------------------------- */
const roField = (label, value) => `
  <div class="column q-gutter-xs">
    <div class="text-grey-7" style="font-size:0.8125rem; font-weight:700;">${label}</div>
    <div class="text-grey-9">${value}</div>
  </div>`
const roImg = (label) => `
  <div class="column q-gutter-xs">
    <div class="text-grey-7" style="font-size:0.8125rem; font-weight:700;">${label}</div>
    <div class="row items-center q-gutter-sm text-grey-6"><q-icon name="hide_image" size="24px" color="grey-5" /><i>No image provided.</i></div>
  </div>`
const roNone = (t) => `<i class="text-grey-6">${t}</i>`

/* A read-only uploaded-image block laid out as two columns — image (thumbnail +
   filename) on the left, Redirect URL on the right — with a right-justified red
   delete button. Both column bodies share a 64px band with vertically-centered
   content, so the filename and the URL value line up with the thumbnail. Labels
   sit at the top of each column, aligned with each other and the card title.
   Used 3× in each of Display Images and Advertisements. */
/* v-for'd read-only image rows bound to a reactive `arr`; the delete button calls
   `deleteFn(i)`, which removes the row and raises an Undo toast.
   Built with an explicit CSS grid + fixed gaps (NO q-gutter — nested q-gutters
   apply conflicting negative margins and make the spacing messy). Each row is a
   3-column grid: image | redirect URL | delete. In every cell the label sits at
   the top (13px text + 8px gap = 25px), then a 64px band with vertically-centered
   content, so labels line up across columns and the filename / URL / trash all
   share the same 64px band. Rows are spaced by the parent's `gap`. */
const roImgLabel = `font-size:0.8125rem; font-weight:700; line-height:1.3; color:var(--ds-color-text-subtle); margin-bottom:8px;`
const roImageRows = (arr, deleteFn) => `
  <div v-for="(it, i) in ${arr}" :key="'${arr}'+i"
    style="display:grid; grid-template-columns:1fr 1fr auto; column-gap:32px; align-items:start;">
    <div style="min-width:0;">
      <div style="${roImgLabel}">{{ it.label }}</div>
      <div style="display:flex; align-items:center; gap:16px; min-height:64px;">
        <div style="width:64px; height:64px; flex:none; border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-sm); display:flex; align-items:center; justify-content:center; background:var(--ds-color-surface-sunken);">
          <q-icon name="image" size="28px" color="grey-5" />
        </div>
        <div class="text-weight-bold text-grey-9" style="min-width:0; overflow-wrap:anywhere;">{{ it.name }}</div>
      </div>
    </div>
    <div style="min-width:0;">
      <div style="${roImgLabel}">Redirect URL</div>
      <div style="display:flex; align-items:center; min-height:64px;"><span class="text-grey-9" style="overflow-wrap:anywhere;">{{ it.redirect }}</span></div>
    </div>
    <div style="padding-top:25px;">
      <div style="height:64px; display:flex; align-items:center;">
        <q-btn flat round dense icon="delete" color="negative" @click="${deleteFn}(i)"><q-tooltip>Delete</q-tooltip></q-btn>
      </div>
    </div>
  </div>`

export const Saved = page({
  active: 'events',
  org: 'Halpern Travel',
  user: 'Justin Girard',
  components: { DsPageHeader, DsInfoGrid, DsSectionHeader, DsCard, DsNotification },
  setup: () => {
    const displayImages = reactive([
      { label: 'Display Image 1', name: 'landing-display-1.png', redirect: 'https://www.example.com' },
      { label: 'Display Image 2', name: 'landing-display-2.png', redirect: 'https://www.example.com' },
      { label: 'Display Image 3', name: 'landing-display-3.png', redirect: 'https://www.example.com' },
    ])
    const ads = reactive([
      { label: 'Advertisement 1', name: 'advertisement-1.png', redirect: 'https://www.example.com' },
      { label: 'Advertisement 2', name: 'advertisement-2.png', redirect: 'https://www.example.com' },
      { label: 'Advertisement 3', name: 'advertisement-3.png', redirect: 'https://www.example.com' },
    ])
    // Floating DsNotification stack (bottom-right) — the delete uses the design
    // system's Notification component, NOT a toast/snackbar. Undo is the only CTA;
    // it re-inserts the removed row at its original index and clears the note.
    const notes = reactive([])
    let seq = 0
    const dismissNote = (id) => {
      const idx = notes.findIndex((n) => n.id === id)
      if (idx !== -1) notes.splice(idx, 1)
    }
    const deleteWithUndo = (arr, i) => {
      const [removed] = arr.splice(i, 1)
      const id = ++seq
      notes.push({
        id,
        title: `${removed.label} deleted`,
        description: `“${removed.name}” and its redirect URL were removed from your booking site.`,
        undo: () => { arr.splice(i, 0, removed); dismissNote(id) },
      })
      setTimeout(() => dismissNote(id), 7000)
    }
    const deleteImage = (i) => deleteWithUndo(displayImages, i)
    const deleteAd = (i) => deleteWithUndo(ads, i)
    return { meta: EVENT_META, eventTabs: EVENT_TABS, tab: ref('customize'), displayImages, ads, deleteImage, deleteAd, notes, dismissNote }
  },
  slot: `
    <div style="padding:22px 32px 0; background:var(--ds-color-surface); border-bottom:1px solid var(--ds-color-border-container);">
      ${eventHeader}
    </div>

    <div style="padding:24px 32px 48px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div>
        <div class="row items-center justify-between q-gutter-md no-wrap q-mb-md">
          <div style="font-size:1.25rem; font-weight:700; color:var(--ds-color-text-brand);">Customize Event Booking Site</div>
          <q-btn unelevated no-caps color="primary" label="Edit Information" style="flex:none;"
            href="/?path=/story/${STORY_BASE}--default" target="_top" />
        </div>

        <div class="column q-gutter-y-lg">

          <!-- Event Logo -->
          <ds-card padding="lg">
            <ds-section-header title="Event Logo" variant="section" class="q-mb-md" />
            <div class="row items-center q-gutter-md no-wrap">
              <div style="width:64px; height:64px; flex:none; border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-sm); display:flex; align-items:center; justify-content:center; background:var(--ds-color-surface-sunken);">
                <q-icon name="image" size="28px" color="grey-5" />
              </div>
              <div>
                <div class="text-weight-bold text-grey-9">EP Logo.png</div>
                <div class="text-grey-7" style="font-size:0.8125rem;">Size: 14.7 kB</div>
              </div>
            </div>
          </ds-card>

          <!-- Landing Page Details -->
          <ds-card padding="lg">
            <ds-section-header title="Landing Page Details" variant="section" class="q-mb-md" />
            <div class="column q-gutter-y-lg" style="padding-bottom:12px;">
              ${roImg('Landing Page Logo')}
              ${roImg('Landing Page Background')}
              ${roField('Event Description', roNone('No description provided.'))}
              ${roField('Hide Event Name and Event Date on Landing Page', 'No')}
            </div>
          </ds-card>

          <!-- Display Images -->
          <ds-card padding="lg">
            <ds-section-header title="Display Images" variant="section" class="q-mb-md" />
            <div style="display:flex; flex-direction:column; gap:24px; padding-bottom:12px;">
              ${roImageRows('displayImages', 'deleteImage')}
            </div>
          </ds-card>

          <!-- Hotel List Details -->
          <ds-card padding="lg">
            <ds-section-header title="Hotel List Details" variant="section" class="q-mb-md" />
            <div class="column q-gutter-y-lg">
              ${roImg('Hotel List Logo')}
              ${roImg('Hotel List Background')}
              ${roField('Show Map View on Hotel List page', 'Yes')}
              ${roField('Hide Event Name and Event Date on Hotel List', 'No')}
            </div>
          </ds-card>

          <!-- Advertisements -->
          <ds-card padding="lg">
            <ds-section-header title="Advertisements" variant="section" class="q-mb-md" />
            <div style="display:flex; flex-direction:column; gap:24px;">
              ${roImageRows('ads', 'deleteAd')}
            </div>
          </ds-card>

          <!-- Customer Service Details -->
          <ds-card padding="lg">
            <ds-section-header title="Customer Service Details" variant="section" class="q-mb-md" />
            <div style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); column-gap:32px; row-gap:24px;">
              <div>${roField('Service Email', 'test@eventpipe.com')}</div>
              <div>${roField('Phone Number', '(888) 640-6400')}</div>
              <div>${roField('Phone Number (Toll Free)', roNone('Not provided.'))}</div>
              <div style="grid-column:1 / span 2;">${roField('Service Hours', 'Monday through Friday, 8:30am-5:30pm Eastern Time')}</div>
            </div>
          </ds-card>

        </div>
      </div>

      <!-- Delete feedback: DsNotification (Feedback & Status) rendered in a fixed
           bottom-right stack — not a toast/snackbar. Undo is the only CTA. -->
      <teleport to="body">
        <transition-group tag="div" name="dsn-toast"
          style="position:fixed; right:24px; bottom:24px; z-index:9999; display:flex; flex-direction:column; gap:12px;">
          <ds-notification v-for="n in notes" :key="n.id"
            variant="default" icon="delete_outline" :title="n.title" :description="n.description"
            @close="dismissNote(n.id)">
            <template #actions>
              <q-btn flat no-caps dense color="primary" label="Undo" @click="n.undo()" />
            </template>
          </ds-notification>
        </transition-group>
      </teleport>
    </div>`,
})
Saved.storyName = 'Customize Read Only'
Saved.parameters = { layout: 'fullscreen' }

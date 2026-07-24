/** DES-95 / 02 · Customize tab — EDIT mode ("Customize Event Booking Site").
 *
 *  Current-state baseline of the Contracted event Customize tab in its editable
 *  form (the half of today's view/edit split that the revamp collapses into a
 *  single editable page). Recreated with DS components; nav position is a
 *  screen-capture artifact and not reproduced. Note: this baseline already shows
 *  the "Show Map View on Hotel List page" flag under Hotel List Details. */
import { ref, reactive } from 'vue'
import { page } from '../../../pages/_shell'
import DsPageHeader from '../../../../components/DsPageHeader.vue'
import DsInfoGrid from '../../../../components/DsInfoGrid.vue'
import DsSectionHeader from '../../../../components/DsSectionHeader.vue'
import DsField from '../../../../components/DsField.vue'
import DsInput from '../../../../components/DsInput.vue'
import DsFileField from '../../../../components/DsFileField.vue'
import DsRichTextEditor from '../../../../components/DsRichTextEditor.vue'
import DsLink from '../../../../components/DsLink.vue'
import DsCard from '../../../../components/DsCard.vue'
import { eventHeader, browseField, checkRow, EVENT_META, EVENT_TABS } from '../_des95'

export default {
  title: 'Design Requests/DES-95 Customized Page Revamp/Archive/Customize Event Site',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Current-state **Customize** tab in EDIT mode. One half of the view/edit split the revamp will collapse into a single editable page. The **Show Map View on Hotel List page** flag already lives under Hotel List Details here.' } },
  },
}

export const Default = page({
  active: 'events',
  org: 'Halpern Travel',
  user: 'Justin Girard',
  components: { DsPageHeader, DsInfoGrid, DsSectionHeader, DsField, DsInput, DsFileField, DsRichTextEditor, DsLink, DsCard },
  setup: () => {
    const displayImages = reactive([{ file: null, redirect: '' }])
    const ads = reactive([{ file: null, redirect: '' }])
    const addImage = () => displayImages.push({ file: null, redirect: '' })
    const addAd = () => ads.push({ file: null, redirect: '' })
    return {
      meta: EVENT_META, eventTabs: EVENT_TABS, tab: ref('customize'),
      checks: reactive({ hideLanding: false, showMap: true, hideHotel: false }),
      files: reactive({ eventLogo: null, landingLogo: null, landingBg: null, hotelLogo: null, hotelBg: null }),
      displayImages, ads, addImage, addAd,
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
            <q-btn outline no-caps color="primary" label="Cancel" href="/?path=/story/design-requests-des-95-customized-page-revamp-archive-customize-event-site--saved" target="_top" />
            <q-btn unelevated no-caps color="primary" label="Save Changes" href="/?path=/story/design-requests-des-95-customized-page-revamp-archive-customize-event-site--saved" target="_top" />
          </div>
        </div>

        <ds-card padding="lg">
          <div class="column q-gutter-y-lg">

            <!-- Event Logo -->
            <div>
              <ds-section-header title="Event Logo" variant="section" class="q-mb-md" />
              ${browseField('Event Logo', 'The logo shown on the booking site.', 'eventLogo', 'EP Logo.png')}
            </div>

            <!-- Landing Page Details -->
            <div class="column q-gutter-y-md">
              <ds-section-header title="Landing Page Details" variant="section" />
              ${browseField('Landing Page Logo', 'Displayed on the landing page.', 'landingLogo')}
              ${browseField('Landing Page Background', 'Background image for the landing page.', 'landingBg')}
              <ds-rich-text-editor label="Event Description" min-height="200px" model-value="" layout="description" />
              ${checkRow('Hide Event Name and Event Date on Landing Page.', 'hideLanding')}
            </div>

            <!-- Display Images -->
            <div class="column q-gutter-y-md">
              <ds-section-header title="Display Images" variant="section" />
              <div class="text-grey-8">You can add up to 3 display images to your event booking site landing page. Use PNG or JPG files. Recommended size: 345px x 215px.</div>
              <div v-for="(img, i) in displayImages" :key="'di'+i" class="row items-start q-gutter-md no-wrap">
                <ds-file-field :label="'Display Image ' + (i + 1)" tooltip="Shown on the landing page." v-model="img.file" class="col" />
                <ds-field label="Redirect URL" class="col"><ds-input v-model="img.redirect" placeholder="https://www.example.com" /></ds-field>
              </div>
              <div><ds-link href="#" @click.prevent="addImage">Add another image</ds-link></div>
            </div>

            <!-- Hotel List Details -->
            <div class="column q-gutter-y-md">
              <ds-section-header title="Hotel List Details" variant="section" />
              ${browseField('Hotel List Logo', 'Displayed on the hotel list page.', 'hotelLogo')}
              ${browseField('Hotel List Background', 'Background image for the hotel list page.', 'hotelBg')}
              ${checkRow('Show Map View on Hotel List page', 'showMap')}
              ${checkRow('Hide Event Name and Event Date on Hotel List.', 'hideHotel')}
            </div>

            <!-- Advertisements -->
            <div class="column q-gutter-y-md">
              <ds-section-header title="Advertisements" variant="section" />
              <div class="text-grey-8">You can add up to 3 display images to your event booking site hotel list page. Use PNG or JPG files. Recommended size: 160px x 320px.</div>
              <div v-for="(ad, i) in ads" :key="'ad'+i" class="row items-start q-gutter-md no-wrap">
                <ds-file-field :label="'Advertisement ' + (i + 1)" tooltip="Shown on the hotel list page." v-model="ad.file" class="col" />
                <ds-field label="Redirect URL" class="col"><ds-input v-model="ad.redirect" placeholder="https://www.example.com" /></ds-field>
              </div>
              <div><ds-link href="#" @click.prevent="addAd">Add another advertisement</ds-link></div>
            </div>

            <!-- Customer Service Details (NEW) -->
            <div class="column q-gutter-y-lg">
              <ds-section-header title="Customer Service Details" variant="section" />
              <div style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); column-gap:32px; row-gap:16px;">
                <div><ds-input label="Service Email" required type="email" model-value="test@eventpipe.com" /></div>
                <div><ds-input label="Phone Number" required type="tel" model-value="(888) 640-6400" /></div>
                <div><ds-input label="Phone Number (Toll Free)" type="tel" placeholder="Toll Free Phone number" /></div>
                <div style="grid-column:1 / span 2;"><ds-input label="Service Hours" required model-value="Monday through Friday, 8:30am-5:30pm Eastern Time" /></div>
              </div>
            </div>

          </div>
        </ds-card>
      </div>
    </div>`,
})
Default.storyName = 'Customize Edits'
Default.parameters = { layout: 'fullscreen' }

/* ------------------------------------------------------------------------- *
 * Read-only state after the user saves — the same page, fields committed and
 * shown as read-only values, with an "Edit Information" button to re-enter edit.
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

export const Saved = page({
  active: 'events',
  org: 'Halpern Travel',
  user: 'Justin Girard',
  components: { DsPageHeader, DsInfoGrid, DsSectionHeader, DsCard },
  setup: () => ({ meta: EVENT_META, eventTabs: EVENT_TABS, tab: ref('customize') }),
  slot: `
    <div style="padding:22px 32px 0; background:var(--ds-color-surface); border-bottom:1px solid var(--ds-color-border-container);">
      ${eventHeader}
    </div>

    <div style="padding:24px 32px 48px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div>
        <div class="row items-center justify-between q-gutter-md no-wrap q-mb-md">
          <div style="font-size:1.25rem; font-weight:700; color:var(--ds-color-text-brand);">Customize Event Booking Site</div>
          <q-btn unelevated no-caps color="primary" label="Edit Information" style="flex:none;"
            href="/?path=/story/design-requests-des-95-customized-page-revamp-archive-customize-event-site--default" target="_top" />
        </div>

        <ds-card padding="lg">
          <div class="column q-gutter-y-lg">

            <!-- Event Logo -->
            <div>
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
            </div>

            <!-- Landing Page Details -->
            <div class="column q-gutter-y-lg">
              <ds-section-header title="Landing Page Details" variant="section" />
              ${roImg('Landing Page Logo')}
              ${roImg('Landing Page Background')}
              ${roField('Event Description', roNone('No description provided.'))}
              ${roField('Hide Event Name and Event Date on Landing Page', 'No')}
            </div>

            <!-- Display Images -->
            <div class="column q-gutter-y-lg">
              <ds-section-header title="Display Images" variant="section" />
              ${roImg('Display Image 1')}
              ${roField('Redirect URL', roNone('Not provided.'))}
            </div>

            <!-- Hotel List Details -->
            <div class="column q-gutter-y-lg">
              <ds-section-header title="Hotel List Details" variant="section" />
              ${roImg('Hotel List Logo')}
              ${roImg('Hotel List Background')}
              ${roField('Show Map View on Hotel List page', 'Yes')}
              ${roField('Hide Event Name and Event Date on Hotel List', 'No')}
            </div>

            <!-- Advertisements -->
            <div class="column q-gutter-y-lg">
              <ds-section-header title="Advertisements" variant="section" />
              ${roImg('Advertisement 1')}
              ${roField('Redirect URL', roNone('Not provided.'))}
            </div>

            <!-- Customer Service Details -->
            <div class="column q-gutter-y-lg">
              <ds-section-header title="Customer Service Details" variant="section" />
              <div class="row q-col-gutter-xl">
                <div class="col-12 col-md-4">${roField('Service Email', 'test@eventpipe.com')}</div>
                <div class="col-12 col-md-4">${roField('Phone Number', '(888) 640-6400')}</div>
                <div class="col-12 col-md-4">${roField('Phone Number (Toll Free)', roNone('Not provided.'))}</div>
              </div>
              <div class="row q-col-gutter-xl">
                <div class="col-12 col-md-8">${roField('Service Hours', 'Monday through Friday, 8:30am-5:30pm Eastern Time')}</div>
              </div>
            </div>

          </div>
        </ds-card>
      </div>
    </div>`,
})
Saved.storyName = 'Customize Read Only'
Saved.parameters = { layout: 'fullscreen' }

/** DES-95 / Revamp · Customize Page (single editable page).
 *
 *  A duplicate of the Live Event Edit layout (see References/01), reused as the
 *  new single editable Customize page — one page with Discard / Update buttons
 *  (replacing today's view/edit split, References/02 + 03). Two additions per the
 *  ticket, using existing components only (no new styling):
 *    1. "Show map view on hotel list page" flag (Hotel List Details).
 *    2. Customer Service Details — Service Email, Phone Number, Phone Number
 *       (Toll Free), Service Hours. */
import { reactive, ref } from 'vue'
import { page } from '../../pages/_shell'
import DsSectionHeader from '../../../components/DsSectionHeader.vue'
import DsField from '../../../components/DsField.vue'
import DsInput from '../../../components/DsInput.vue'
import DsSelect from '../../../components/DsSelect.vue'
import DsRichTextEditor from '../../../components/DsRichTextEditor.vue'
import DsLink from '../../../components/DsLink.vue'
import DsCard from '../../../components/DsCard.vue'
import DsPageHeader from '../../../components/DsPageHeader.vue'
import DsInfoGrid from '../../../components/DsInfoGrid.vue'
import { attachField, checkRow } from './_des95'

export default {
  title: 'Pages/Drafts/Customized Page (Edits)',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The revamped **single editable** Customize page (duplicate of References/01), with the **Show map view on hotel list page** flag and the new **Customer Service Details** fields added per the ticket. No new styling — existing components only.' } },
  },
}

// Two Landing-Page display images from the reference.
const displayImages = [
  { file: 'MediaGraphic-200x200.png', url: 'halperntravel.com' },
  { file: 'Mediagraphic-HaveQuestions-200x200.png', url: 'https://halperntravel.com/contact-us/' },
]

export const Default = page({
  active: 'events',
  org: 'Halpern Travel',
  user: 'Justin Girard',
  components: { DsSectionHeader, DsField, DsInput, DsSelect, DsRichTextEditor, DsLink, DsCard },
  setup: () => ({ displayImages,
    checks: reactive({ hideLandingLive: false, hideHotelLive: false, showMap: false }) }),
  slot: `
    <!-- Page header -->
    <div style="padding:22px 32px 18px; background:var(--ds-color-surface-sunken);">
      <div class="row items-start justify-between q-gutter-md no-wrap">
        <div>
          <div style="font-size:1.5rem; font-weight:700; color:var(--ds-color-text);">Edit Live Event</div>
          <div class="text-grey-7" style="margin-top:4px;">All fields marked with <span class="text-negative">*</span> are required.</div>
        </div>
        <div class="row items-center q-gutter-sm no-wrap" style="flex:none;">
          <q-btn outline no-caps color="primary" label="Discard Changes" />
          <q-btn unelevated no-caps color="primary" label="Update Event" />
        </div>
      </div>
    </div>

    <div style="padding:24px 32px 48px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-y-lg">

        <!-- Details -->
        <ds-card padding="lg">
          <ds-section-header title="Details" variant="section" class="q-mb-md" />
          <div class="column q-gutter-y-md">
            <ds-input label="Event Name" required model-value="Demo - Live Inventory Event" style="max-width:480px;" />
            <ds-input label="Default Location" model-value="304 Brick Meetinghouse Rd, North East," clearable style="max-width:360px;" />
            <ds-input label="Default Check-in and Check-out Dates" type="date" model-value="07/16/2026 - 07/18/2026" clearable style="max-width:360px;" />
            <ds-field label="Live Inventory Reservation Fee" style="max-width:480px;">
              <div class="row items-center q-gutter-sm no-wrap">
                <ds-select class="col" :options="['Per Reservation','Per Room Night','Per Room']" model-value="Per Reservation" />
                <div class="ds-fee-group" style="flex:none;">
                  <q-btn-dropdown flat no-caps label="$" class="ds-fee-group__cur">
                    <q-list>
                      <q-item clickable v-close-popup><q-item-section>$</q-item-section></q-item>
                      <q-item clickable v-close-popup><q-item-section>%</q-item-section></q-item>
                    </q-list>
                  </q-btn-dropdown>
                  <input class="ds-fee-group__amt" value="1" />
                </div>
              </div>
            </ds-field>
          </div>
        </ds-card>

        <!-- Booking Site Customization (accordion) -->
        <q-card flat bordered>
          <q-expansion-item default-opened label="Booking Site Customization" header-class="des95-acc__hdr">
            <q-separator />
            <div class="column q-gutter-y-lg" style="padding:20px 28px;">
            <ds-link href="https://learn.eventpipe.com/eventpipe-knowledge-base/booking-site-customization-guide" external>Booking Site Customization Guide</ds-link>

            <!-- Event Logo -->
            <div>
              <ds-section-header title="Event Logo" variant="accent" class="q-mb-sm" />
              ${attachField('Event Logo', 'The logo shown on the booking site.')}
            </div>

            <!-- Landing Page Details -->
            <div class="column q-gutter-y-md">
              <ds-section-header title="Landing Page Details" variant="accent" />
              ${attachField('Landing Page Logo', 'Displayed on the landing page.')}
              ${attachField('Landing Page Background', 'Background image for the landing page.')}
              <ds-rich-text-editor label="Event Description" min-height="200px" model-value="" layout="description" />
              ${checkRow('Hide Event Name and Event Date on Landing Page', 'hideLandingLive')}
            </div>

            <!-- Landing Page Display Images -->
            <div class="column q-gutter-y-lg">
              <ds-section-header title="Landing Page Display Images" variant="accent" />
              <ds-field v-for="(img, i) in displayImages" :key="i" :label="'Display Image ' + (i + 1)" tooltip="Shown on the landing page.">
                <div class="row items-center q-gutter-lg no-wrap">
                  <div style="width:120px; height:120px; flex:none; border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-sm); display:flex; align-items:center; justify-content:center; background:var(--ds-color-surface-sunken);">
                    <q-icon name="image" size="40px" color="grey-5" />
                  </div>
                  <div class="text-weight-medium text-grey-8" style="width:230px; word-break:break-word;">{{ img.file }}</div>
                  <ds-field label="Redirect URL" class="col" style="max-width:360px;">
                    <ds-input :model-value="img.url" />
                  </ds-field>
                  <q-btn flat no-caps color="negative" icon="delete" label="Delete" style="flex:none;" />
                </div>
              </ds-field>
              <div><ds-link href="#">+ Add Image</ds-link></div>
            </div>

            <!-- Hotel List Details -->
            <div class="column q-gutter-y-md">
              <ds-section-header title="Hotel List Details" variant="accent" />
              ${attachField('Hotel List Logo', 'Displayed on the hotel list page.')}
              ${attachField('Hotel List Background', 'Background image for the hotel list page.')}
              ${checkRow('Show map view on hotel list page', 'showMap')}
              ${checkRow('Hide Event Name and Event Date on Hotel List', 'hideHotelLive')}
            </div>

            <!-- Advertisements -->
            <div>
              <ds-section-header title="Advertisements" variant="accent" class="q-mb-sm" />
              <ds-link href="#">+ Add Image</ds-link>
            </div>
            </div>
          </q-expansion-item>
        </q-card>

        <!-- Customer Service Details (NEW) -->
        <ds-card padding="lg">
          <ds-section-header title="Customer Service Details" variant="section" class="q-mb-md" />
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4"><ds-input label="Service Email" required type="email" model-value="test@eventpipe.com" /></div>
            <div class="col-12 col-md-4"><ds-input label="Phone Number" required type="tel" model-value="(888) 640-6400" /></div>
            <div class="col-12 col-md-4"><ds-input label="Phone Number (Toll Free)" type="tel" placeholder="Toll Free Phone number" /></div>
          </div>
          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-12 col-md-8"><ds-input label="Service Hours" required model-value="Monday through Friday, 8:30am-5:30pm Eastern Time" /></div>
          </div>
        </ds-card>

        <!-- Advanced Settings (accordion) -->
        <q-card flat bordered>
          <q-expansion-item default-opened label="Advanced Settings" header-class="des95-acc__hdr">
            <q-separator />
            <div class="column q-gutter-y-md" style="padding:20px 28px;">
              <ds-input label="Start/End Dates" type="date" placeholder="mm/dd/yyyy - mm/dd/yyyy" style="max-width:360px;" />
              <ds-select label="Event Producer" :options="['Afrim\\'s Sports','365 Sports Travel','Halpern Travel']" placeholder="Event Producer" style="max-width:360px;" />
            </div>
          </q-expansion-item>
        </q-card>

      </div>
    </div>`,
})
Default.parameters = { layout: 'fullscreen' }

/* ------------------------------------------------------------------------- *
 * Live Inventory Event → Reservations — the event detail page that holds the
 * entry points into this Customize flow ("Booking Site" + "Edit Event").
 * ------------------------------------------------------------------------- */
const eventMeta = [
  { label: 'Default Location:', value: 'North East, MD' },
  { label: 'Default Check-in and Check-out Dates:', value: 'Thu, 07/16/2026 - Sat, 07/18/2026' },
  { label: 'Reservation Fee:', value: '' },
]

const reservations = [
  { name: 'SILVERBERG, JOSHUA', phone: '(518) 796-3050', email: 'joshuahsilverberg20@gmail.com', reservedOn: 'Tue 07/07/2026 4:43PM EDT', origin: 'Live',
    hotel: 'Great Wolf Lodge Perryville', address: '1240 Chesapeke Overlook Parkway', roomType: 'Family Suite', dates: 'Thu, 07/16/2026 - Sat, 07/18/2026',
    confirmation: '- -', resId: '319858494415291', status: 'Confirmed' },
  { name: 'SILVERBERG, JOSHUA', phone: '(518) 796-3050', email: 'joshuahsilverberg20@gmail.com', reservedOn: 'Fri 05/29/2026 1:45PM EDT', origin: 'Live',
    hotel: 'Renaissance Montreal Downtown Hotel', address: '1250 Boulevard Robert-Bourassa', roomType: 'Suite, 1 Bedroom', dates: 'Thu, 07/16/2026 - Sat, 07/18/2026',
    confirmation: '- -', resId: '432952208937413', status: 'Confirmed' },
]

export const LiveInventoryEventReservations = page({
  active: 'events',
  org: 'Halpern Travel',
  user: 'Justin Girard',
  components: { DsPageHeader, DsInfoGrid, DsCard },
  setup: () => ({ reservations, meta: eventMeta, tab: ref('reservations'), sort: ref('Create Date'), order: ref('9-0/Z-A') }),
  slot: `
    <div style="padding:22px 32px 0; background:var(--ds-color-surface); border-bottom:1px solid var(--ds-color-border-container);">
      <ds-page-header title="Demo - Live Inventory Event">
        <template #breadcrumb>
          <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2">
            <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
            <q-breadcrumbs-el label="Events" />
            <q-breadcrumbs-el label="Demo - Live Inventory Event" class="text-grey-6" />
          </q-breadcrumbs>
        </template>
        <template #badge>
          <q-btn dense no-caps unelevated color="positive" text-color="white" class="q-px-sm" style="border-radius:6px;">Active <q-icon name="arrow_drop_down" size="20px" /></q-btn>
        </template>
        <template #actions>
          <q-btn-group unelevated>
            <q-btn no-caps color="primary" label="Booking Site" />
            <q-btn color="primary" icon="link" />
          </q-btn-group>
          <q-btn outline no-caps color="grey-7" text-color="grey-8" label="Edit Event" />
        </template>
        <template #meta>
          <div style="display:grid; grid-template-columns:max-content 1fr; row-gap:2px; column-gap:56px; max-width:960px; font-size:0.9375rem;">
            <template v-for="(m, i) in meta" :key="i">
              <div style="color:var(--ds-color-text-subtle);">{{ m.label }}</div>
              <div style="color:var(--ds-color-text);">{{ m.value }}</div>
            </template>
          </div>
        </template>
        <template #tabs>
          <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left" class="text-grey-7">
            <q-tab name="reservations" label="Reservations" />
            <q-tab name="live-hotels" label="Live Hotels" />
          </q-tabs>
        </template>
      </ds-page-header>
    </div>

    <div style="padding:20px 32px 8px; background:var(--ds-color-surface-sunken);">
      <div class="row items-center q-gutter-md no-wrap">
        <div style="font-size:1.25rem; font-weight:700; color:var(--ds-color-text-brand); line-height:40px;">Reservations</div>
        <q-input outlined dense bg-color="white" placeholder="Search" style="width:320px" hide-bottom-space><template #append><q-icon name="search" /></template></q-input>
        <div class="row items-center q-gutter-sm no-wrap">
          <span class="text-grey-7">Sort By</span>
          <q-select v-model="sort" :options="['Create Date','Guest Name','Hotel']" outlined dense bg-color="white" style="width:160px" hide-bottom-space />
          <q-select v-model="order" :options="['9-0/Z-A','0-9/A-Z']" outlined dense bg-color="white" style="width:120px" hide-bottom-space />
        </div>
        <q-space />
        <q-btn unelevated no-caps color="primary" label="Export" />
        <q-btn outline no-caps color="grey-7" text-color="grey-8" label="Filters" />
      </div>
    </div>

    <div style="padding:16px 32px 48px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-y-md">
        <ds-card v-for="(r, i) in reservations" :key="i" padding="lg">
          <div class="row no-wrap items-stretch">
            <!-- Guest -->
            <div style="flex:1 1 26%; padding-right:24px;">
              <a href="#" class="text-primary text-weight-bold" style="text-decoration:none; font-size:1.0625rem;" @click.prevent>{{ r.name }}</a>
              <div class="text-grey-6" style="font-size:0.8125rem; margin:2px 0 8px;">{{ r.phone }}</div>
              <div style="font-size:0.875rem;" class="text-weight-bold">Email Address:</div>
              <div class="text-grey-8" style="font-size:0.875rem; margin-bottom:6px;">{{ r.email }}</div>
              <div style="font-size:0.875rem;"><span class="text-weight-bold">Reserved On:</span> <span class="text-grey-8">{{ r.reservedOn }}</span></div>
              <div style="font-size:0.875rem;"><span class="text-weight-bold">Origin:</span> <span class="text-grey-8">{{ r.origin }}</span></div>
            </div>
            <!-- Hotel -->
            <div style="flex:1 1 32%; padding:0 24px; border-left:1px solid var(--ds-color-border-container);">
              <div class="text-weight-bold" style="font-size:1rem; margin-bottom:2px;">{{ r.hotel }}</div>
              <div class="text-grey-8" style="font-size:0.875rem; margin-bottom:8px;">{{ r.address }}</div>
              <div style="font-size:0.875rem;"><span class="text-weight-bold">Room Type:</span> <span class="text-grey-8">{{ r.roomType }}</span></div>
              <div style="font-size:0.875rem;"><span class="text-weight-bold">Check In/Out Dates:</span> <span class="text-grey-8">{{ r.dates }}</span></div>
            </div>
            <!-- Hotel Confirmation -->
            <div style="flex:1 1 18%; padding:0 24px; border-left:1px solid var(--ds-color-border-container);">
              <div class="text-grey-9" style="font-size:0.9375rem; margin-bottom:4px;">{{ r.confirmation }}</div>
              <div class="text-grey-6" style="font-size:0.8125rem;">Hotel Confirmation</div>
            </div>
            <!-- Reservation ID -->
            <div style="flex:1 1 24%; padding-left:24px; border-left:1px solid var(--ds-color-border-container); display:flex; align-items:flex-start; justify-content:space-between; gap:12px;">
              <div>
                <div class="text-grey-9" style="font-size:0.9375rem;">{{ r.resId }}</div>
                <div class="text-grey-6" style="font-size:0.8125rem;">Reservation ID (Pipe ID) or Group ID</div>
                <div class="text-grey-7" style="font-size:0.8125rem; margin-top:6px;">Reservation</div>
              </div>
              <span v-if="r.status" style="display:inline-flex; align-items:center; background:var(--ds-color-text-brand); color:#fff; font-weight:600; font-size:0.9375rem; padding:8px 20px; border-radius:9999px; white-space:nowrap; flex:none;">{{ r.status }}</span>
            </div>
          </div>
        </ds-card>
      </div>
    </div>`,
})
LiveInventoryEventReservations.parameters = { layout: 'fullscreen' }

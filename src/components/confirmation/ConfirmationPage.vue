<script setup>
// ConfirmationPage — the post-checkout success screen.
// Three data modes:
//   reserve      → a single hotel stay (check-in / check-out / room features)
//   hold         → a group/team room block (one card per hotel, rooms held by night)
//   reservations → multiple room reservations (one card per reservation; rooms
//                  reuse the hold layout with per-room occupancy instead of nights)
// Below the booking summary both modes share a stack of post-booking modules:
// who's going, cancellation + manage, add-to-calendar, location, area tips,
// FAQ, help/contact, and an experience rating. Controls are presentational
// (visual states only). Accents use the DS primary (Zinc).
import { computed, reactive, ref } from 'vue'
import HotelMap from '../HotelMap.vue'
import heroImg from '../../assets/confirmation/soccer-luggage.png'

const props = defineProps({
  mode: { type: String, default: 'reserve' }, // reserve | hold | reservations
  data: { type: Object, default: () => ({}) },
})

const isHold = computed(() => props.mode === 'hold')
const isMulti = computed(() => props.mode === 'reservations')
const d = computed(() => props.data || {})
const hero = computed(() => d.value.heroImage || heroImg)
const heading = computed(() => d.value.heading || (isMulti.value ? 'Your reservations are confirmed!' : isHold.value ? 'Your block is confirmed!' : "You're confirmed!"))
const ctaLabel = computed(() => d.value.ctaLabel || (isMulti.value ? 'View your trips' : isHold.value ? 'Manage your block' : 'View your trip'))

// Meta rows shown under the heading (label → value), right-aligned values.
const meta = computed(() => {
  const rows = []
  if (d.value.itinerary) rows.push({ label: 'Itinerary #', value: d.value.itinerary })
  if (d.value.email) rows.push({ label: 'Contact email', value: d.value.email })
  return rows
})

// Teams held in the group block — accepts plain strings or {name,…} objects.
const teams = computed(() => (d.value.teams || []).map((t) => (typeof t === 'string' ? { name: t } : t)))
const hotels = computed(() => (isHold.value ? d.value.hotels || [] : d.value.hotel ? [d.value.hotel] : []))
const totalRooms = (h) => (h.rooms || []).reduce((sum, r) => sum + (r.nights || []).reduce((s, n) => s + (n.qty || 0), 0), 0)
// Multiple room reservations — one card per reservation (hotel + dates + rooms).
const reservations = computed(() => (isMulti.value ? d.value.reservations || [] : []))

// Who's going — avatar initials; an "unknown" status renders a ghost glyph.
const party = computed(() => d.value.party || [])
const initials = (name) => (name || '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')

// FAQ accordion — independently toggleable rows.
const faqs = computed(() => d.value.faqs || [])
const faqOpen = reactive({})
const toggleFaq = (i) => { faqOpen[i] = !faqOpen[i] }

// Experience rating (1–10). Selecting a score reveals a comment field.
const rating = ref(null)
const comment = ref('')
const scores = Array.from({ length: 10 }, (_, i) => i + 1)
</script>

<template>
  <div class="conf">
    <div class="conf__inner">
      <!-- hero -->
      <img class="conf__hero" :src="hero" alt="" aria-hidden="true" />

      <h1 class="conf__h1">{{ heading }}</h1>

      <!-- itinerary meta -->
      <dl v-if="meta.length" class="conf__meta">
        <div v-for="m in meta" :key="m.label" class="conf__metarow">
          <dt>{{ m.label }}</dt>
          <dd>{{ m.value }}</dd>
        </div>
      </dl>

      <q-btn unelevated no-caps class="conf__cta" :label="ctaLabel" />

      <!-- group block + teams (hold only) -->
      <section v-if="isHold && (d.blockName || teams.length)" class="conf__card conf__block">
        <span class="conf__blocklabel">Group block name</span>
        <h2 class="conf__blockname">{{ d.blockName || 'Group block' }}</h2>
        <template v-if="teams.length">
          <hr class="conf__rule" />
          <h3 class="conf__teamsh">Teams in this block ({{ teams.length }})</h3>
          <ul class="conf__teams">
            <li v-for="(t, ti) in teams" :key="ti">
              <q-icon name="groups" size="18px" />
              <span class="conf__teamname">{{ t.name }}</span>
              <span v-if="t.ageDivision || t.gender" class="conf__teammeta">{{ [t.ageDivision, t.gender].filter(Boolean).join(' · ') }}</span>
            </li>
          </ul>
        </template>
      </section>

      <!-- hotel / block cards -->
      <section v-for="(h, hi) in hotels" :key="hi" class="conf__card">
        <header class="conf__cardhead">
          <h2 class="conf__hotel">{{ h.name }}</h2>
          <p v-if="h.location" class="conf__loc">{{ h.location }}</p>
          <p v-if="h.rating" class="conf__rating">
            <strong>{{ h.rating.score }} - {{ h.rating.label }}</strong>
            <span v-if="h.rating.reviews"> ({{ h.rating.reviews.toLocaleString() }} reviews)</span>
          </p>
        </header>

        <!-- RESERVE body: check-in / check-out / room features -->
        <template v-if="!isHold">
          <hr class="conf__rule" />
          <div class="conf__stay">
            <div class="conf__when"><span class="conf__lbl">Check-in</span><strong>{{ h.checkIn }}</strong></div>
            <div class="conf__when"><span class="conf__lbl">Check-out</span><strong>{{ h.checkOut }}</strong></div>
          </div>
          <hr class="conf__rule" />
          <p v-if="h.roomTitle" class="conf__roomtitle">{{ h.roomTitle }}</p>
          <ul class="conf__features">
            <li v-for="(f, fi) in h.features || []" :key="fi"><q-icon :name="f.icon" size="18px" /> {{ f.label }}</li>
          </ul>
        </template>

        <!-- HOLD body: rooms held per night -->
        <template v-else>
          <hr class="conf__rule" />
          <div v-for="(r, ri) in h.rooms || []" :key="ri" class="conf__room">
            <div class="conf__roomhead">
              <span class="conf__roomtype">{{ r.type }}</span>
              <span v-if="r.summary" class="conf__roomsum">{{ r.summary }}</span>
            </div>
            <ul class="conf__nights">
              <li v-for="(n, ni) in r.nights || []" :key="ni"><span>{{ n.date }}</span><strong>{{ n.qty }} {{ n.qty === 1 ? 'room' : 'rooms' }}</strong></li>
            </ul>
          </div>
          <hr class="conf__rule" />
          <p class="conf__heldsum"><q-icon name="check_circle" size="18px" /> {{ totalRooms(h) }} room-nights held at this hotel</p>
        </template>
      </section>

      <!-- RESERVATIONS body: one card per reservation. Room details mirror the
           Group Hold layout (conf__room / conf__roomhead), with each room's
           occupancy in place of held nights. Each reservation carries its own
           hotel + dates, so different hotels / dates list as separate cards. -->
      <section v-for="(rsv, si) in reservations" :key="'rsv-' + si" class="conf__card">
        <span class="conf__rsveyebrow">Reservation {{ si + 1 }} of {{ reservations.length }}</span>
        <header class="conf__cardhead">
          <h2 class="conf__hotel">{{ rsv.hotel.name }}</h2>
          <p v-if="rsv.hotel.location" class="conf__loc">{{ rsv.hotel.location }}</p>
          <p v-if="rsv.hotel.rating" class="conf__rating">
            <strong>{{ rsv.hotel.rating.score }} - {{ rsv.hotel.rating.label }}</strong>
            <span v-if="rsv.hotel.rating.reviews"> ({{ rsv.hotel.rating.reviews.toLocaleString() }} reviews)</span>
          </p>
        </header>
        <hr class="conf__rule" />
        <div class="conf__stay">
          <div class="conf__when"><span class="conf__lbl">Check-in</span><strong>{{ rsv.checkIn }}</strong></div>
          <div class="conf__when"><span class="conf__lbl">Check-out</span><strong>{{ rsv.checkOut }}</strong></div>
        </div>
        <hr class="conf__rule" />
        <div v-for="(r, ri) in rsv.rooms || []" :key="ri" class="conf__room">
          <div class="conf__roomhead">
            <span class="conf__roomtype">{{ r.label ? r.label + ' · ' : '' }}{{ r.type }}</span>
            <span v-if="r.summary" class="conf__roomsum">{{ r.summary }}</span>
          </div>
          <ul class="conf__nights">
            <li><span>Guests</span><strong>{{ r.guests }}</strong></li>
            <li v-if="r.dates"><span>Dates</span><strong>{{ r.dates }}</strong></li>
          </ul>
        </div>
        <hr class="conf__rule" />
        <p class="conf__heldsum"><q-icon name="check_circle" size="18px" /> {{ (rsv.rooms || []).length }} {{ (rsv.rooms || []).length === 1 ? 'room' : 'rooms' }} confirmed</p>
      </section>

      <!-- who's going -->
      <section v-if="party.length" class="conf__card">
        <div class="conf__secthead">
          <div>
            <h2 class="conf__secttitle">{{ isHold ? "Who's organizing" : "Who's going" }}</h2>
            <p class="conf__sectsub">Share details or invite others on your trip.</p>
          </div>
          <button class="conf__iconbtn" type="button" aria-label="Share"><q-icon name="ios_share" size="20px" /></button>
        </div>
        <div class="conf__party">
          <div v-for="(p, pi) in party" :key="pi" class="conf__person">
            <span class="conf__avatar" :class="{ 'conf__avatar--unknown': p.status === 'unknown' }">
              <q-icon v-if="p.status === 'unknown'" name="person" size="22px" />
              <template v-else>{{ initials(p.name) }}</template>
            </span>
            <span class="conf__pname">{{ p.name }}</span>
            <span v-if="p.role" class="conf__prole">{{ p.role }}</span>
          </div>
          <button class="conf__person conf__invite" type="button">
            <span class="conf__avatar conf__avatar--add"><q-icon name="add" size="22px" /></span>
            <span class="conf__pname">Invite</span>
          </button>
        </div>
      </section>

      <!-- cancellation policy + manage -->
      <section v-if="d.cancellation" class="conf__card">
        <h2 class="conf__secttitle">Cancellation policy</h2>
        <p v-if="d.cancellation.freeUntil" class="conf__refund"><q-icon name="check_circle" size="16px" /> Free cancellation before {{ d.cancellation.freeUntil }}</p>
        <p class="conf__policytext">{{ d.cancellation.text }}</p>
        <div class="conf__managebtns">
          <button class="conf__manage" type="button">Change {{ isHold ? 'block' : 'reservation' }}</button>
          <button class="conf__manage conf__manage--danger" type="button">Cancel {{ isHold ? 'block' : 'reservation' }}</button>
        </div>
      </section>

      <!-- add to calendar -->
      <section v-if="d.calendar !== false" class="conf__card">
        <h2 class="conf__secttitle">Add to your calendar</h2>
        <p class="conf__sectsub">Save your dates so you don't miss check-in.</p>
        <div class="conf__calbtns">
          <button class="conf__calbtn" type="button"><q-icon name="event" size="18px" /> Google Calendar</button>
          <button class="conf__calbtn" type="button"><q-icon name="event" size="18px" /> Apple Calendar</button>
          <button class="conf__calbtn" type="button"><q-icon name="download" size="18px" /> Export (.ics)</button>
        </div>
      </section>

      <!-- location details -->
      <section v-if="d.location" class="conf__card">
        <div class="conf__secthead">
          <h2 class="conf__secttitle">Location details</h2>
          <button class="conf__textlink" type="button">Get directions</button>
        </div>
        <div class="conf__mapwrap">
          <hotel-map :hotels="[]" :event-location="{ lat: d.location.lat, lng: d.location.lng, label: d.location.label || hotels[0]?.name }" :zoom="14" :cluster="false" height="240px" />
        </div>
        <p class="conf__address"><q-icon name="place" size="18px" /> {{ d.location.address }}</p>
      </section>

      <!-- area tips -->
      <section v-if="(d.areaTips || []).length" class="conf__card">
        <h2 class="conf__secttitle">Explore the area</h2>
        <p class="conf__sectsub">A few things worth knowing nearby.</p>
        <ul class="conf__tips">
          <li v-for="(tip, ti) in d.areaTips" :key="ti">
            <q-icon :name="tip.icon || 'place'" size="20px" />
            <div><strong>{{ tip.title }}</strong><span>{{ tip.text }}</span></div>
          </li>
        </ul>
      </section>

      <!-- FAQ -->
      <section v-if="faqs.length" class="conf__card">
        <h2 class="conf__secttitle">Frequently asked questions</h2>
        <div class="conf__faq">
          <div v-for="(f, fi) in faqs" :key="fi" class="conf__faqrow">
            <button class="conf__faqq" type="button" :aria-expanded="!!faqOpen[fi]" @click="toggleFaq(fi)">
              <span>{{ f.q }}</span>
              <q-icon :name="faqOpen[fi] ? 'remove' : 'add'" size="20px" />
            </button>
            <p v-show="faqOpen[fi]" class="conf__faqa">{{ f.a }}</p>
          </div>
        </div>
      </section>

      <!-- help / contact -->
      <section v-if="d.help" class="conf__card">
        <h2 class="conf__secttitle">Need help?</h2>
        <p class="conf__sectsub">Reach out anytime for assistance with your booking.</p>
        <div class="conf__contact">
          <a v-if="d.help.phone" class="conf__contactrow" :href="`tel:${d.help.phone.replace(/[^0-9+]/g, '')}`">
            <span class="conf__contacticon"><q-icon name="call" size="20px" /></span>
            <span class="conf__contacttext"><strong>Call us</strong><span>{{ d.help.phone }}</span></span>
          </a>
          <a v-if="d.help.email" class="conf__contactrow" :href="`mailto:${d.help.email}`">
            <span class="conf__contacticon"><q-icon name="mail" size="20px" /></span>
            <span class="conf__contacttext"><strong>Email us</strong><span>{{ d.help.email }}</span></span>
          </a>
        </div>
      </section>

      <!-- experience rating -->
      <section class="conf__card conf__rating-card">
        <h2 class="conf__secttitle">Help us get better!</h2>
        <p class="conf__sectsub">Based on your experience, on a scale of 1–10, how likely are you to recommend us to your friends and family?</p>
        <div class="conf__scores" role="radiogroup" aria-label="Rating 1 to 10">
          <button v-for="s in scores" :key="s" type="button" class="conf__score" :class="{ 'is-on': rating === s }" role="radio" :aria-checked="rating === s" @click="rating = s">{{ s }}</button>
        </div>
        <div v-if="rating != null" class="conf__feedback">
          <label class="conf__fblabel">Thanks! Tell us a bit more about your experience <span>(optional)</span></label>
          <textarea v-model="comment" class="conf__fbinput" rows="3" placeholder="What went well, or what could we improve?" />
          <button class="conf__fbsubmit" type="button">Submit feedback</button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.conf { background: var(--ds-palette-neutral-100); min-height: 100vh; padding: 48px 24px 64px; }
.conf__inner { max-width: 600px; margin: 0 auto; }

/* hero */
.conf__hero { display: block; width: 132px; height: 132px; margin: 0 auto 24px; object-fit: contain; }

.conf__h1 { font-size: 2.125rem; font-weight: 800; line-height: 1.1; color: var(--ds-color-text); margin: 0 0 18px; text-align: center; }

/* itinerary meta */
.conf__meta { margin: 0 0 22px; }
.conf__metarow { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding: 2px 0; }
.conf__metarow dt { color: var(--ds-color-text-subtle); font-size: 0.9375rem; }
.conf__metarow dd { margin: 0; font-weight: 700; color: var(--ds-color-text); text-align: right; }

.conf__cta { display: flex; width: fit-content; margin: 0 auto 28px; height: 46px; padding: 0 26px; border-radius: var(--ds-radius-pill); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 0.9375rem; }

/* cards */
.conf__card { background: var(--ds-color-surface); border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); padding: 24px; margin-bottom: 16px; }
.conf__cardhead h2 { margin: 0; }
.conf__hotel { font-size: 1.4375rem; font-weight: 800; color: var(--ds-color-text); }
.conf__loc { margin: 4px 0 0; color: var(--ds-color-text-subtle); font-size: 0.875rem; }
.conf__rating { margin: 4px 0 0; font-size: 0.875rem; color: var(--ds-color-text); }
.conf__rule { border: 0; border-top: 1px solid var(--ds-color-border); margin: 18px 0; }

/* reservation eyebrow (multiple room reservations) */
.conf__rsveyebrow { display: block; margin-bottom: 8px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--ds-color-text-subtle); }

/* group block + teams */
.conf__blocklabel { display: block; color: var(--ds-color-text-subtle); font-size: 0.875rem; }
.conf__blockname { margin: 4px 0 0; font-size: 1.4375rem; font-weight: 800; color: var(--ds-color-text); }
.conf__teamsh { margin: 0 0 12px; font-size: 0.9375rem; font-weight: 700; color: var(--ds-color-text); }
.conf__teams { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.conf__teams li { display: flex; align-items: center; gap: 10px; font-size: 0.9375rem; color: var(--ds-color-text); }
.conf__teams .q-icon { color: var(--ds-color-text-subtle); flex: none; }
.conf__teamname { font-weight: 600; }
.conf__teammeta { color: var(--ds-color-text-subtle); font-size: 0.8125rem; }

/* reserve body */
.conf__stay { display: flex; flex-direction: column; gap: 16px; }
.conf__when { display: flex; flex-direction: column; gap: 4px; }
.conf__lbl { color: var(--ds-color-text-subtle); font-size: 0.875rem; }
.conf__when strong { font-size: 0.9375rem; color: var(--ds-color-text); }
.conf__roomtitle { margin: 0 0 14px; font-weight: 700; color: var(--ds-color-text); font-size: 0.9375rem; }
.conf__features { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; }
.conf__features li { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--ds-color-text); }
.conf__features .q-icon { color: var(--ds-color-text-subtle); }

/* hold body */
.conf__room { padding: 4px 0 14px; }
.conf__room + .conf__room { border-top: 1px solid var(--ds-color-border); padding-top: 14px; }
.conf__roomhead { display: flex; flex-direction: column; gap: 2px; margin-bottom: 10px; }
.conf__roomtype { font-weight: 700; color: var(--ds-color-text); font-size: 0.9375rem; }
.conf__roomsum { color: var(--ds-color-text-subtle); font-size: 0.8125rem; }
.conf__nights { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.conf__nights li { display: flex; align-items: center; justify-content: space-between; font-size: 0.875rem; color: var(--ds-color-text); }
.conf__nights span { color: var(--ds-color-text-subtle); }
.conf__heldsum { display: flex; align-items: center; gap: 8px; margin: 0; font-weight: 600; font-size: 0.875rem; color: var(--ds-color-text-success); }

/* shared section header */
.conf__secthead { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.conf__secttitle { margin: 0; font-size: 1.1875rem; font-weight: 800; color: var(--ds-color-text); }
.conf__sectsub { margin: 6px 0 0; color: var(--ds-color-text-subtle); font-size: 0.875rem; line-height: 1.45; }
.conf__iconbtn { width: 40px; height: 40px; flex: none; border: 1px solid var(--ds-color-border); border-radius: 50%; background: var(--ds-color-surface); color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.conf__iconbtn:hover { background: var(--ds-palette-zinc-100); }
.conf__textlink { background: none; border: 0; padding: 0; color: var(--ds-color-text); font-weight: 700; font-size: 0.875rem; cursor: pointer; }
.conf__textlink:hover { text-decoration: underline; }

/* who's going */
.conf__party { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 18px; }
.conf__person { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 64px; text-align: center; background: none; border: 0; padding: 0; cursor: default; }
.conf__avatar { width: 52px; height: 52px; border-radius: 50%; background: var(--ds-palette-zinc-200); color: var(--ds-color-text); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.0625rem; }
.conf__avatar--unknown { background: var(--ds-palette-zinc-100); color: var(--ds-color-text-subtle); border: 1px dashed var(--ds-color-border-bold); }
.conf__avatar--add { background: var(--ds-color-surface); border: 1px dashed var(--ds-color-border-bold); color: var(--ds-color-text); }
.conf__pname { font-size: 0.8125rem; font-weight: 600; color: var(--ds-color-text); line-height: 1.2; }
.conf__prole { font-size: 0.75rem; color: var(--ds-color-text-subtle); }
.conf__invite { cursor: pointer; }
.conf__invite:hover .conf__avatar--add { background: var(--ds-palette-zinc-100); }

/* cancellation + manage */
.conf__refund { display: inline-flex; align-items: center; gap: 6px; margin: 12px 0 0; color: var(--ds-color-text-success); font-weight: 600; font-size: 0.875rem; }
.conf__policytext { margin: 10px 0 0; color: var(--ds-color-text-subtle); font-size: 0.875rem; line-height: 1.5; }
.conf__managebtns { display: flex; flex-direction: column; gap: 10px; margin-top: 18px; }
.conf__manage { height: 46px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); color: var(--ds-color-text); font-weight: 700; font-size: 0.9375rem; cursor: pointer; }
.conf__manage:hover { background: var(--ds-palette-zinc-100); }
.conf__manage--danger { border-color: var(--ds-color-text-danger); color: var(--ds-color-text-danger); }
.conf__manage--danger:hover { background: var(--ds-color-background-danger, rgba(220,38,38,0.06)); }

/* calendar */
.conf__calbtns { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
.conf__calbtn { display: inline-flex; align-items: center; gap: 8px; height: 44px; padding: 0 18px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-pill); background: var(--ds-color-surface); color: var(--ds-color-text); font-weight: 600; font-size: 0.875rem; cursor: pointer; }
.conf__calbtn:hover { background: var(--ds-palette-zinc-100); }
.conf__calbtn .q-icon { color: var(--ds-color-text-subtle); }

/* location */
.conf__mapwrap { margin-top: 16px; }
.conf__address { display: flex; align-items: center; gap: 8px; margin: 14px 0 0; font-size: 0.9375rem; font-weight: 600; color: var(--ds-color-text); }
.conf__address .q-icon { color: var(--ds-color-text-subtle); flex: none; }

/* area tips */
.conf__tips { list-style: none; margin: 18px 0 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
.conf__tips li { display: flex; align-items: flex-start; gap: 12px; }
.conf__tips .q-icon { color: var(--ds-color-background-brand-bold); flex: none; margin-top: 1px; }
.conf__tips strong { display: block; font-size: 0.9375rem; color: var(--ds-color-text); }
.conf__tips span { color: var(--ds-color-text-subtle); font-size: 0.875rem; line-height: 1.45; }

/* FAQ */
.conf__faq { margin-top: 14px; border-top: 1px solid var(--ds-color-border); }
.conf__faqrow { border-bottom: 1px solid var(--ds-color-border); }
.conf__faqq { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; padding: 16px 0; background: none; border: 0; text-align: left; cursor: pointer; font-weight: 700; font-size: 0.9375rem; color: var(--ds-color-text); }
.conf__faqq .q-icon { color: var(--ds-color-text-subtle); flex: none; }
.conf__faqa { margin: 0; padding: 0 0 16px; color: var(--ds-color-text-subtle); font-size: 0.875rem; line-height: 1.55; }

/* help / contact */
.conf__contact { display: flex; flex-direction: column; gap: 12px; margin-top: 18px; }
.conf__contactrow { display: flex; align-items: center; gap: 14px; padding: 12px 14px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); text-decoration: none; }
.conf__contactrow:hover { background: var(--ds-palette-zinc-100); }
.conf__contacticon { width: 40px; height: 40px; flex: none; border-radius: 50%; background: var(--ds-palette-zinc-100); color: var(--ds-color-background-brand-bold); display: flex; align-items: center; justify-content: center; }
.conf__contacttext { display: flex; flex-direction: column; }
.conf__contacttext strong { font-size: 0.9375rem; color: var(--ds-color-text); }
.conf__contacttext span { font-size: 0.875rem; color: var(--ds-color-text-subtle); }

/* rating */
.conf__scores { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
.conf__score { width: 44px; height: 44px; flex: none; border: 0; border-radius: 50%; background: var(--ds-palette-zinc-100); color: var(--ds-color-text); font-weight: 700; font-size: 0.9375rem; cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard), color var(--ds-duration-fast) var(--ds-ease-standard); }
.conf__score:hover { background: var(--ds-palette-zinc-200); }
.conf__score.is-on { background: var(--ds-color-background-brand-bold); color: #fff; }
.conf__feedback { margin-top: 20px; }
.conf__fblabel { display: block; font-size: 0.875rem; font-weight: 600; color: var(--ds-color-text); margin-bottom: 8px; }
.conf__fblabel span { color: var(--ds-color-text-subtle); font-weight: 400; }
.conf__fbinput { width: 100%; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 12px 14px; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); outline: none; resize: vertical; }
.conf__fbinput:focus { border-color: var(--ds-color-border-focused); }
.conf__fbsubmit { margin-top: 12px; height: 44px; padding: 0 22px; border: 0; border-radius: var(--ds-radius-pill); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 0.9375rem; cursor: pointer; }
.conf__fbsubmit:hover { opacity: 0.92; }

@media (max-width: 560px) {
  .conf__scores { gap: 8px; }
  .conf__score { width: 40px; height: 40px; }
}
</style>

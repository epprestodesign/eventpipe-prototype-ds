<script setup>
// HotelMap — map-only listings view. Drops a price-pill marker per hotel;
// clicking a pill selects it (inverts to brand color) and opens a popup card.
// Auto-fits bounds to all pins. Falls back to a styled placeholder when no
// Google Maps key is configured (see src/lib/googleMaps.js).
import { ref, watch, onMounted } from 'vue'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import { loadGoogleMaps, hasMapsKey } from '../lib/googleMaps'

const props = defineProps({
  // [{ id, name, location, lat, lng, price, rating, reviews, image }]
  hotels: { type: Array, default: () => [] },
  // Pulsing "event location" anchor; the map stays centered on it. { lat, lng, label }
  eventLocation: { type: Object, default: null },
  center: { type: Object, default: null },
  zoom: { type: Number, default: 12 },
  currency: { type: String, default: '$' },
  mapId: { type: String, default: 'DEMO_MAP_ID' }, // required for AdvancedMarkerElement
  height: { type: String, default: '560px' },
  linkTarget: { type: String, default: '_self' }, // where the details link opens
  cluster: { type: Boolean, default: true }, // group nearby hotels into count bubbles
  // Search-radius overlay: a circle centered on the event location (or center),
  // sized live by `searchRadius`. 0 hides it. Auto-fits the map to the circle.
  searchRadius: { type: Number, default: 0 },
  radiusUnit: { type: String, default: 'mi' }, // mi | km
})

const mapEl = ref(null)
const status = ref('loading') // loading | ready | nokey | error
const selectedId = ref(null)
let map = null
let gmaps = null
let infoWindow = null
let clusterer = null
let radiusCircle = null
const markers = []

// --- Search-radius circle ---
const radiusCenter = () => props.eventLocation || props.center ||
  (props.hotels.length ? { lat: props.hotels[0].lat, lng: props.hotels[0].lng } : null)
function updateRadius () {
  if (!map || !gmaps) return
  const center = radiusCenter()
  if (props.searchRadius > 0 && center) {
    const meters = props.searchRadius * (props.radiusUnit === 'km' ? 1000 : 1609.344)
    if (!radiusCircle) {
      radiusCircle = new gmaps.Circle({
        map, center, radius: meters, clickable: false, zIndex: 1,
        strokeColor: '#18181B', strokeOpacity: 0.5, strokeWeight: 2,
        fillColor: '#18181B', fillOpacity: 0.08,
      })
    } else {
      radiusCircle.setCenter(center)
      radiusCircle.setRadius(meters)
    }
    // Auto-zoom so the whole circle stays in view as it grows/shrinks.
    map.fitBounds(radiusCircle.getBounds(), 48)
  } else if (radiusCircle) {
    radiusCircle.setMap(null)
    radiusCircle = null
  }
}
watch(() => [props.searchRadius, props.radiusUnit], updateRadius)

const money = (n) => props.currency + Number(n).toLocaleString('en-US')

// Default: solid black pill (white text). Selected: white pill, black text,
// thick black stroke. Border width stays constant so the pill doesn't resize.
const pillCss = (selected) =>
  `display:inline-block;background:${selected ? '#fff' : '#18181B'};color:${selected ? '#18181B' : '#fff'};` +
  'border:3px solid #18181B;border-radius:999px;padding:5px 12px;' +
  'font:600 13px/1 Poppins,system-ui,sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.3);cursor:pointer;white-space:nowrap;'

function popupNode (h) {
  const el = document.createElement('div')
  el.style.cssText = 'width:240px;font-family:Poppins,system-ui,sans-serif;'
  // Image + name link to the hotel details page (future functionality).
  const url = h.url || '#'
  const tgt = props.linkTarget
  el.innerHTML =
    (h.image ? `<a href="${url}" target="${tgt}" class="hm-link" style="display:block;margin-bottom:8px"><img src="${h.image}" alt="${h.name}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;display:block"></a>` : '') +
    `<a href="${url}" target="${tgt}" class="hm-link hm-link--name" style="font-weight:700;font-size:14px;color:#18181B;line-height:1.2;display:inline-block">${h.name}</a>` +
    (h.location ? `<div style="color:#71717A;font-size:12px;margin-top:2px">${h.location}</div>` : '') +
    '<div style="display:flex;align-items:center;gap:6px;margin-top:6px">' +
      (h.rating != null ? `<span style="background:#18181B;color:#fff;font-weight:700;font-size:12px;padding:2px 7px;border-radius:5px">${h.rating.toFixed(1)}</span>` : '') +
      (h.reviews ? `<span style="color:#71717A;font-size:12px">${Number(h.reviews).toLocaleString()} reviews</span>` : '') +
    '</div>' +
    `<div style="margin-top:8px;font-size:18px;font-weight:700;color:#18181B">${money(h.price)} <span style="font-size:12px;font-weight:500;color:#71717A">/ night</span></div>`
  return el
}

function select (id) {
  selectedId.value = id
  markers.forEach(({ hotel, pillEl }) => { pillEl.style.cssText = pillCss(hotel.id === id) })
}

function eventPopupNode (ev) {
  const el = document.createElement('div')
  el.style.cssText = 'font-family:Poppins,system-ui,sans-serif;padding:2px 4px;'
  el.innerHTML =
    '<div style="display:flex;align-items:center;gap:7px">' +
      '<span style="width:9px;height:9px;border-radius:50%;background:#18181B;display:inline-block;flex:0 0 auto"></span>' +
      `<span style="font-weight:700;font-size:14px;color:#18181B">${ev.label || 'Event location'}</span>` +
    '</div>' +
    (ev.sublabel ? `<div style="color:#71717A;font-size:12px;margin-top:3px;margin-left:16px">${ev.sublabel}</div>` : '')
  return el
}

async function initMap (keyOverride) {
  status.value = 'loading'
  try {
    const g = await loadGoogleMaps(keyOverride)
    gmaps = g
    const center = props.center || props.eventLocation ||
      (props.hotels.length ? { lat: props.hotels[0].lat, lng: props.hotels[0].lng } : { lat: 36.1627, lng: -86.7816 })
    map = new g.Map(mapEl.value, {
      center, zoom: props.zoom, mapId: props.mapId,
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false, clickableIcons: false,
    })
    // No close button (X); clicking anywhere off the card closes it.
    infoWindow = new g.InfoWindow({ headerDisabled: true })
    map.addListener('click', () => { infoWindow.close(); select(null) })

    const bounds = new g.LatLngBounds()
    const hotelMarkers = []
    props.hotels.forEach((h) => {
      const pillEl = document.createElement('div')
      pillEl.style.cssText = pillCss(false)
      pillEl.textContent = money(h.price)
      const marker = new g.marker.AdvancedMarkerElement({
        // When clustering, the clusterer controls map visibility (no `map` here).
        ...(props.cluster ? {} : { map }),
        position: { lat: h.lat, lng: h.lng }, content: pillEl, gmpClickable: true, title: h.name,
      })
      marker.addListener('click', () => {
        select(h.id)
        infoWindow.setContent(popupNode(h))
        infoWindow.open({ map, anchor: marker })
      })
      markers.push({ hotel: h, marker, pillEl })
      hotelMarkers.push(marker)
      bounds.extend({ lat: h.lat, lng: h.lng })
    })

    if (props.cluster && hotelMarkers.length) {
      // Black count bubbles for grouped hotels; click a cluster to zoom/expand.
      const renderer = {
        render: ({ count, position }) => {
          const el = document.createElement('div')
          const size = count < 10 ? 40 : count < 25 ? 48 : 56
          el.style.cssText = `display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;` +
            'border-radius:999px;background:#18181B;color:#fff;border:3px solid #fff;' +
            'font:700 14px/1 Poppins,system-ui,sans-serif;box-shadow:0 1px 6px rgba(0,0,0,.35);cursor:pointer;'
          el.textContent = String(count)
          return new g.marker.AdvancedMarkerElement({ position, content: el, zIndex: 1000 + count })
        },
      }
      clusterer = new MarkerClusterer({ map, markers: hotelMarkers, renderer })
    }

    if (props.eventLocation) {
      // Pulsing iOS-style "my location" dot for the event venue.
      const pulse = document.createElement('div')
      pulse.className = 'hm-pulse'
      pulse.innerHTML = '<span class="hm-pulse__ring"></span><span class="hm-pulse__dot"></span>'
      const eventMarker = new g.marker.AdvancedMarkerElement({
        map, position: { lat: props.eventLocation.lat, lng: props.eventLocation.lng },
        content: pulse, zIndex: 9999, gmpClickable: true, title: props.eventLocation.label || 'Event location',
      })
      eventMarker.addListener('click', () => {
        select(null) // clear any selected hotel pill
        infoWindow.setContent(eventPopupNode(props.eventLocation))
        infoWindow.open({ map, anchor: eventMarker })
      })
      // Keep the event location centered in the viewport (incl. on container resize).
      map.setCenter({ lat: props.eventLocation.lat, lng: props.eventLocation.lng })
      if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => map.setCenter({ lat: props.eventLocation.lat, lng: props.eventLocation.lng }))
        ro.observe(mapEl.value)
      }
    } else if (props.hotels.length > 1) {
      map.fitBounds(bounds, 64)
    }
    // Draw the search-radius circle (and fit to it) if a radius is set.
    updateRadius()
    status.value = 'ready'
  } catch (e) {
    status.value = keyOverride ? 'error' : 'nokey'
  }
}

// --- Runtime "bring your own key" entry (fallback when no build-time key) ---
const manualKey = ref('')
const SKEY = 'ds-gmaps-key'
function submitKey () {
  const k = manualKey.value.trim()
  if (!k) return
  try { sessionStorage.setItem(SKEY, k) } catch (e) { /* sandboxed storage */ }
  initMap(k)
}

onMounted(() => {
  // Google calls this on an invalid/unauthorized key.
  if (typeof window !== 'undefined') window.gm_authFailure = () => { status.value = 'authfail' }
  if (hasMapsKey()) { initMap(); return }
  let saved = ''
  try { saved = sessionStorage.getItem(SKEY) || '' } catch (e) { /* sandboxed */ }
  if (saved) { manualKey.value = saved; initMap(saved); return }
  status.value = 'nokey'
})
</script>

<template>
  <div class="hm" :style="{ height }">
    <div v-show="status === 'ready' || status === 'loading'" ref="mapEl" class="hm__map" />

    <div v-if="status === 'loading'" class="hm__overlay">Loading map…</div>

    <div v-if="status === 'nokey'" class="hm__overlay hm__fallback">
      <q-icon name="map" size="40px" />
      <div class="hm__fallback-title">Google Maps API key needed</div>
      <div class="hm__fallback-text">
        Enter a Maps JavaScript API key to load the interactive map with
        {{ hotels.length }} hotel pin{{ hotels.length === 1 ? '' : 's' }}. The key stays in
        your browser for this session only — it’s never committed or sent anywhere but Google.
      </div>
      <form class="hm__keyform" @submit.prevent="submitKey">
        <input v-model="manualKey" class="hm__keyinput" type="password" placeholder="Paste API key (AIza…)" autocomplete="off" spellcheck="false" />
        <button class="hm__keybtn" type="submit">Load map</button>
      </form>
    </div>

    <div v-if="status === 'authfail'" class="hm__overlay hm__fallback">
      <q-icon name="key_off" size="40px" />
      <div class="hm__fallback-title">That key didn’t work</div>
      <div class="hm__fallback-text">Google rejected the API key — it may be invalid, or not authorized for this site (HTTP-referrer restriction). Reload the page to try a different key.</div>
    </div>

    <div v-if="status === 'error'" class="hm__overlay hm__fallback">
      <q-icon name="error_outline" size="40px" />
      <div class="hm__fallback-title">Map failed to load</div>
      <div class="hm__fallback-text">Couldn’t load the Google Maps script. Check the key and that the Maps JavaScript API is enabled for this origin.</div>
    </div>
  </div>
</template>

<style scoped>
.hm { position: relative; width: 100%; border-radius: var(--ds-radius-lg); overflow: hidden; border: 1px solid var(--ds-color-border); background: var(--ds-palette-zinc-100); }
.hm__map { position: absolute; inset: 0; }
.hm__overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: var(--ds-color-text-subtle); }
.hm__fallback { flex-direction: column; gap: 8px; text-align: center; padding: 24px; }
.hm__fallback-title { font-weight: 700; font-size: 1.0625rem; color: var(--ds-color-text); }
.hm__fallback-text { max-width: 380px; color: var(--ds-color-text-subtle); font-size: 0.875rem; line-height: 1.45; }
.hm__fallback code { background: var(--ds-palette-zinc-200); padding: 1px 5px; border-radius: 4px; font-size: 0.8125em; }
.hm__keyform { display: flex; gap: 8px; margin-top: 14px; width: 100%; max-width: 420px; }
.hm__keyinput { flex: 1; height: 40px; padding: 0 12px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); font: inherit; font-size: 0.875rem; background: var(--ds-color-surface); color: var(--ds-color-text); }
.hm__keyinput:focus { outline: none; border-color: var(--ds-color-border-bold); box-shadow: 0 0 0 1px var(--ds-color-border-bold); }
.hm__keybtn { height: 40px; padding: 0 18px; border: 0; border-radius: var(--ds-radius-md); background: var(--ds-color-background-brand-bold); color: #fff; font: inherit; font-weight: 600; cursor: pointer; white-space: nowrap; }
.hm__keybtn:hover { opacity: 0.92; }
</style>

<!-- Unscoped: InfoWindow content is rendered by Google outside this component. -->
<style>
.hm-link { text-decoration: none; cursor: pointer; }
.hm-link--name:hover { text-decoration: underline; }
.hm-link img { transition: opacity .12s ease; }
.hm-link:hover img { opacity: .9; }
/* Hide the InfoWindow close (X); we close by clicking off the card instead. */
.gm-style-iw .gm-ui-hover-effect { display: none !important; }

/* iOS "my location"-style pulsing event marker. */
/* translateY(50%) centers the dot on the anchor (markers anchor bottom-center). */
.hm-pulse { position: relative; width: 20px; height: 20px; transform: translateY(50%); }
.hm-pulse__dot { position: absolute; inset: 0; margin: auto; width: 16px; height: 16px; border-radius: 50%; background: #18181B; border: 2px solid #fff; box-shadow: 0 0 1px 1px rgba(0,0,0,.2); }
.hm-pulse__ring { position: absolute; inset: 0; margin: auto; width: 20px; height: 20px; border-radius: 50%; background: #18181B; opacity: .55; animation: hm-pulse 1.8s ease-out infinite; }
@keyframes hm-pulse { 0% { transform: scale(.5); opacity: .55; } 70% { opacity: 0; } 100% { transform: scale(3); opacity: 0; } }
</style>

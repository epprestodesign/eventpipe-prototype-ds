<script setup>
/* Av2VideoGround — a pre-rendered video as the showcase ground (review concept).
 *
 * Goes in Av2Showcase's `ground` slot (authStep's `ground` option), usually
 * with `cards: false`, because each video is the WHOLE showcase panel —
 * background and floating cards — rendered offline. Only the headline and
 * subline (.av2sc__copy) stay live HTML above it; every video keeps its bottom
 * dark for that white text.
 *
 * Adapted from hyperFrames-demo/integration/EpLoginBrandLoop.vue, with the
 * fit changed from contain to cover (see the style block) and the failure path
 * removing the <video> outright, per the 2026-09-29 handoff.
 *
 * Behaviour
 *  - The poster <img> is always painted first and stays underneath, so the
 *    panel is never empty and nothing shifts.
 *  - muted · loop · playsinline · preload="none". Loading starts only after
 *    window.load (already fired in Storybook → document.readyState check), so
 *    it never competes with the sign-in form.
 *  - play() rejecting, the <video> erroring, or the LAST <source> erroring
 *    removes the video; the poster remains. (WebM failing alone is fine —
 *    Safari falls through to the MP4.)
 *  - prefers-reduced-motion: reduce, Save-Data, or `still` → the <video> is
 *    never created.
 *  - The media is aria-hidden. The Pause / Play control sits outside it
 *    (WCAG 2.2.2), bottom-right of the showcase, and appears once playback
 *    starts. Hiding the tab pauses; showing it resumes unless the user paused.
 *
 * A pre-rendered video needs neither the `shaders` licence nor WebGPU.
 */
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  /** Frame 0 of the loop, painted before (and instead of) the video. */
  poster: { type: String, required: true },
  /** VP9 WebM — offered first. */
  webm: { type: String, required: true },
  /** H.264 MP4 — the fallback (Safari). */
  mp4: { type: String, required: true },
  /** Poster only, never a <video> — reviews the reduced-motion state. */
  still: { type: Boolean, default: false },
})

const videoEl = ref(null)
const mounted = ref(false)
const reducedMotion = ref(false)
const saveData = ref(false)
const failed = ref(false)
const playing = ref(false)
const userPaused = ref(false)

let mqMotion
let alive = true

const useVideo = computed(() => mounted.value && !props.still && !reducedMotion.value && !saveData.value && !failed.value)

function onMotion () { reducedMotion.value = mqMotion.matches; if (useVideo.value) nextTick(start) }
function onPlaying () { playing.value = true }
function onFailure () { failed.value = true; playing.value = false }

async function start () {
  const v = videoEl.value
  if (!v || failed.value || userPaused.value || document.hidden) return
  try {
    v.muted = true // autoplay needs the property as well as the attribute
    if (v.preload !== 'auto') { v.preload = 'auto'; v.load() }
    await v.play()
  } catch (err) {
    // A pause (user, tab hidden) or an unmount interrupting a pending play()
    // is not a failure; anything else (autoplay blocked, unsupported) is.
    if (err && err.name === 'AbortError' && (!alive || userPaused.value || document.hidden)) return
    if (alive) onFailure()
  }
}

function toggle () {
  const v = videoEl.value
  if (!v) return
  if (userPaused.value) { userPaused.value = false; start() }
  else { userPaused.value = true; v.pause() }
}

function onVisibility () {
  const v = videoEl.value
  if (!v) return
  if (document.hidden) v.pause()
  else if (!userPaused.value) start()
}

function onLoad () { if (alive) nextTick(start) }

onMounted(() => {
  mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = mqMotion.matches
  saveData.value = !!(navigator.connection && navigator.connection.saveData)
  mqMotion.addEventListener('change', onMotion)
  document.addEventListener('visibilitychange', onVisibility)
  mounted.value = true
  if (document.readyState === 'complete') onLoad()
  else window.addEventListener('load', onLoad, { once: true })
})

onBeforeUnmount(() => {
  alive = false
  mqMotion?.removeEventListener('change', onMotion)
  document.removeEventListener('visibilitychange', onVisibility)
  window.removeEventListener('load', onLoad)
  videoEl.value?.pause()
})
</script>

<template>
  <div class="av2vg" :data-state="failed ? 'failed-still' : playing ? 'playing' : 'still'">
    <div class="av2vg__media" aria-hidden="true">
      <img class="av2vg__fill" :src="poster" alt="" decoding="async" />
      <video
        v-if="useVideo"
        ref="videoEl"
        class="av2vg__fill"
        :poster="poster"
        muted
        loop
        playsinline
        disablepictureinpicture
        disableremoteplayback
        preload="none"
        tabindex="-1"
        @playing="onPlaying"
        @pause="playing = false"
        @error="onFailure"
      >
        <source :src="webm" type="video/webm; codecs=&quot;vp9&quot;" />
        <!-- Only the LAST source failing means nothing can play. -->
        <source :src="mp4" type="video/mp4" @error="onFailure" />
      </video>
    </div>

    <button
      v-if="useVideo && (playing || userPaused)"
      type="button"
      class="av2vg__toggle"
      :aria-label="userPaused ? 'Play background animation' : 'Pause background animation'"
      @click="toggle"
    >
      <svg v-if="userPaused" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z" /></svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
    </button>
  </div>
</template>

<style scoped>
.av2vg { position: absolute; inset: 0; background: var(--ds-color-surface-sidebar); }
.av2vg__media { position: absolute; inset: 0; }

/* cover, not contain: each video is the whole panel. 45% (not 50%) offsets
   the 32px (--av2-panel-radius) the showcase tucks under the panel's rounded
   corner; 42% keeps the card cluster above the live headline. Both concepts
   hold from 1024×768 to ultrawide. */
.av2vg__fill {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 45% 42%;
}

/* Outside the aria-hidden media, bottom-right of the showcase. z-index lifts
   it over .av2sc__copy, which spans the panel's full width. */
.av2vg__toggle {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 2;
  width: 40px;
  height: 40px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--ds-color-text-inverse) 28%, transparent);
  border-radius: var(--ds-radius-button);
  background: color-mix(in srgb, var(--ds-color-surface-sidebar) 72%, transparent);
  color: var(--ds-color-text-inverse);
  cursor: pointer;
}
.av2vg__toggle svg { width: 20px; height: 20px; fill: currentColor; }
.av2vg__toggle:hover { background: var(--ds-color-surface-sidebar); }
.av2vg__toggle:focus-visible { outline: 2px solid var(--ds-color-text-inverse); outline-offset: 2px; }
</style>

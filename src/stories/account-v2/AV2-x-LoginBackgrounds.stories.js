/** Account V2 / Concepts / Login Backgrounds.
 *
 *  The three animated grounds for the right-hand panel of the auth shell, from
 *  the shader compositions supplied on 09/28, retuned to the EventPipe design
 *  system: Azure #2561FA, the #01113E navy chrome and the #15AEB3 accent. The
 *  compositions themselves — layers, ordering, motion — are unchanged; only
 *  the colour stops moved.
 *
 *  Since 2026-09-29 the auth shell is a split screen (see _account.js) and the
 *  shader lives in its right panel, behind the showcase cards and headline.
 *  The Flows use 'liquid' by default; this story is where the three are
 *  compared. Each story passes its variant to authStep's `variant` option, so
 *  what you see here is exactly the shell the Flows render, ground swapped.
 *
 *  Two constraints decide whether any of these can ship, and both are listed
 *  in the docs below rather than buried: the package's licence, and WebGPU
 *  support. Every variant therefore has a static fallback, and the "Fallback"
 *  stories are how you review it without hunting for a second browser.
 *
 *  Since 2026-09-29 there are also two pre-rendered VIDEO grounds (concepts B
 *  and C, from hyperFrames-demo). Each video is the whole showcase panel —
 *  background and floating cards — so those stories pass `cards: false` and
 *  only the headline stays live HTML. See Av2VideoGround for the playback
 *  rules (poster first, reduced motion, Pause/Play).
 *
 *  Read these as a set. The dark grounds make the product feel like a console;
 *  the light one makes it feel like a document. That is the actual choice being
 *  made here — the animation is the smaller half.
 */
import DsInput from '../../components/DsInput.vue'
import Av2VideoGround from './components/Av2VideoGround.vue'
import { authStep } from './_account'
import liquidPoster from '../../assets/login-loops/b-liquid-showcase-poster.webp'
import liquidWebm from '../../assets/login-loops/b-liquid-showcase-web-1080.webm'
import liquidMp4 from '../../assets/login-loops/b-liquid-showcase-web-1080.mp4'
import venuePoster from '../../assets/login-loops/c-venue-journey-poster.webp'
import venueWebm from '../../assets/login-loops/c-venue-journey-web-1080.webm'
import venueMp4 from '../../assets/login-loops/c-venue-journey-web-1080.mp4'
import twoSidesPoster from '../../assets/login-loops/d-two-sides-poster.webp'
import twoSidesWebm from '../../assets/login-loops/d-two-sides-web-1080.webm'
import twoSidesMp4 from '../../assets/login-loops/d-two-sides-web-1080.mp4'

export default {
  title: 'Eventpipe Labs/Account V2/Concepts/Login Backgrounds',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
Three animated grounds for the right-hand panel of the sign-in shell, built from the
shader compositions supplied on 09/28 and retuned to the EventPipe design system — Azure \`#2561FA\`, the \`#01113E\` navy
chrome and the \`#15AEB3\` accent. The compositions are unchanged; only their colour
stops are. The Flows use **Liquid** by default.

### Before any of this ships

**Licence.** The \`shaders\` package is free for *personal, non-commercial and
evaluation* use. Storybook is internal review, which is evaluation. It is
deliberately **not** wired into the hosted \`/ep-pay/\` prototype — that is a
public commercial deployment and would need a paid licence from shaders.com first.

**WebGPU.** These render through WebGPU: Chrome and Edge yes, Safari partial,
Firefox behind a flag. Each variant has a CSS fallback painting the same colour
field, and the fallback renders whenever WebGPU is absent. A login screen that
renders nothing is a locked door, so the fallback is not optional — the
**Fallback** stories below are what a Safari or Firefox visitor actually sees.

### The three

| Variant | Composition | Colours | Reads as |
| --- | --- | --- | --- |
| **Depth** | Perspective · RadialGradient · Grid · DotGrid · ProgressiveBlur · FilmGrain | Navy \`#01113E\` carried down to near-black, grid lines in the sidebar-hover navy, dot field in the light Azure tint \`#A3C9F0\` | The app chrome taken to its darkest: a starfield receding to a horizon. The most serious of the three |
| **Liquid** | LinearGradient · Blob · DotGrid · Liquify · FilmGrain | Azure \`#2561FA\` into navy \`#01113E\`, blob in azure-400/800 with the accent green \`#15AEB3\` as its highlight | Slow-moving brand blue. The only one of the three that shows the accent, and only as a moving specular edge |
| **Wave** | LinearGradient · WaveDistortion · DotGrid | Azure tint \`#E8F1FB\` washing into azure-400 \`#4593E0\` | Light and flat. The only light ground, and the only one whose showcase headline runs in dark ink |

### Video concepts (pre-rendered)

Three review concepts where the **whole** showcase panel — ground and floating cards — is a
pre-rendered loop: 1080×1080, 24 s (B and C at 30 fps, D at 60 fps), no audio, seamless with \`<video loop>\`, poster = frame 0.
The shell's glass cards are switched off (\`cards: false\`); the headline and subline stay live
HTML, and every video keeps its bottom dark for that white text. All data is fictional
(Northshore Summit 2027); photos are from the DS imagery set (Unsplash, see
\`src/assets/hotel/CREDITS.md\`).

| Story | What plays | Size (WebM / MP4) |
| --- | --- | --- |
| **Video · B Liquid showcase** | The Liquid ground recreated in DS colours, with the V2 frosted cards cycling pickup → room block → booking confirmed → reservations +1 | 1.2 MB / 2.6 MB |
| **Video · C Venue journey** | A blurred DS lobby photo graded to navy; the camera pushes through an event booking site, then pulls back as a pickup-report card syncs in over a teal line | 1.3 MB / 2.8 MB |
| **Video · D Two sides, in sync** | Guest and housing team side by side; every guest action syncs to the team view along a teal line. 60 fps. Proposed headline 'Event housing. In sync.' (overridden for this story only via \`authStep({ headline })\`) | 2.1 MB / 3.1 MB |
| **Video · Reduced motion** | Concept B's poster only — what a visitor with *prefers-reduced-motion: reduce* (or Save-Data) sees. No \`<video>\` is ever created | 29 KB |

**Why a video.** A pre-rendered loop needs neither the \`shaders\` licence nor WebGPU: it is a
plain \`<video>\` that plays in every current browser (WebM/VP9 first, MP4 for Safari), with the
poster as the fallback when it cannot. These are **review encodes** (B and C at 30 fps, D at 60 fps), not final masters.

**Playback.** Poster painted first; muted · loop · playsinline · \`preload="none"\`, loading only
after \`window.load\` so it never competes with the form. If \`play()\` rejects, the video
errors or the last source errors, the video is removed and the poster stays. The media is
\`aria-hidden\`; a 40×40 **Pause / Play background animation** button (WCAG 2.2.2) sits outside
it, bottom-right, once playback starts. Hiding the tab pauses; returning resumes unless the user
paused. Fit is \`object-fit: cover\` at \`object-position: 45% 42%\` — the 45% offsets the 32px
the showcase tucks under the panel's rounded corner — and holds from 1024×768 to ultrawide.
` } },
  },
}

const STEP = `
  <h1 class="av2__title">Sign in to EventPipe</h1>
  <p class="av2__sub">Enter your email and password to continue.</p>
  <div class="column q-gutter-y-md">
    <ds-input label="Email" model-value="jeffrey.upp@yourhousingcompany.com" />
    <ds-input label="Password" type="password" model-value="supersecretpw" />
  </div>
  <div class="av2__actions">
    <q-btn unelevated no-caps color="primary" label="Sign in" class="av2__primary" />
  </div>`

// `wave` is the one pale ground — an Azure tint washing into azure-400 — so
// the showcase headline over it has to run in dark ink rather than white.
// `depth` and `liquid` both terminate in the navy and keep the white headline.
// `light` is what carries that (Av2Showcase's .av2sc--light); it is keyed to
// the ground's lightness, never to the presence of a shader.
const bg = (variant, forceFallback = false) => authStep({
  light: variant === 'wave',
  components: { DsInput },
  background: 'shader',
  variant,
  forceFallback,
  slot: STEP,
})

/** The navy app chrome carried down to near-black, with a light-Azure dot
 *  field receding to a horizon under a progressive blur. The most serious of
 *  the three, and the one that most makes the product feel like a console
 *  rather than a form. */
export const Depth = bg('depth')

/** Azure into navy with a slow liquifying blob, the accent green appearing
 *  only as the blob's highlight. The most explicitly branded of the three,
 *  which is the argument for it and also the risk — a login ground built out
 *  of the brand colours is the one that has to be redrawn when they move. */
export const Liquid = bg('liquid')

/** An Azure tint washing into a mid Azure, under a wave distortion and a
 *  twinkling dot grid. The only light ground of the three, which keeps the
 *  screen feeling like a document rather than a console. Its deep end stops at
 *  azure-400 rather than the full brand blue, so the dark-ink headline stays
 *  readable where the gradient is heaviest. */
export const Wave = bg('wave')

/* The fallbacks. Not decoration — this is what a Safari or Firefox visitor
   gets, so it is reviewed like any other state. */

/** Depth without WebGPU. */
export const DepthFallback = bg('depth', true)
DepthFallback.storyName = 'Depth · fallback (no WebGPU)'

/** Liquid without WebGPU. */
export const LiquidFallback = bg('liquid', true)
LiquidFallback.storyName = 'Liquid · fallback (no WebGPU)'

/** Wave without WebGPU. */
export const WaveFallback = bg('wave', true)
WaveFallback.storyName = 'Wave · fallback (no WebGPU)'


/* Pre-rendered video grounds. Each video is the whole showcase panel, cards
   included, so the shell's own glass cards are off (`cards: false`). */
const video = (loop, { still = false, headline = '' } = {}) => authStep({
  components: { DsInput, Av2VideoGround },
  setup: () => ({ loop, still }),
  background: 'video',
  cards: false,
  headline,
  ground: '<av2-video-ground :poster="loop.poster" :webm="loop.webm" :mp4="loop.mp4" :still="still" />',
  slot: STEP,
})

const LIQUID = { poster: liquidPoster, webm: liquidWebm, mp4: liquidMp4 }
const VENUE = { poster: venuePoster, webm: venueWebm, mp4: venueMp4 }
const TWO_SIDES = { poster: twoSidesPoster, webm: twoSidesWebm, mp4: twoSidesMp4 }

/** Concept B. The Liquid ground recreated in DS colours as a pre-rendered
 *  loop, with the V2 frosted cards cycling pickup → room block → booking
 *  confirmed → reservations +1. No shader licence, no WebGPU. */
export const VideoLiquidShowcase = video(LIQUID)
VideoLiquidShowcase.storyName = 'Video · B Liquid showcase'

/** Concept C. A blurred DS lobby photo graded to navy; the camera pushes
 *  through an event booking site, then pulls back as a pickup-report card
 *  syncs in over a teal line. */
export const VideoVenueJourney = video(VENUE)
VideoVenueJourney.storyName = 'Video · C Venue journey'

/** Concept D. Two V2 frosted cards on a diagonal — the guest's booking site
 *  upper left, the housing team's view of the same event lower right — joined
 *  by a teal line. Each guest action pulses down the line and the team card
 *  answers: Harborline Suites → its room block highlights; Two Queen Beds
 *  Thu–Sun → those nights light up; confirm $597.00 → reservations 128 → 129,
 *  room nights 344 → 347. 60 fps. Built around the proposed headline
 *  "Event housing. In sync.", overridden here only (live HTML, not in the
 *  video). Known at 1024×768: the guest card's left edge briefly leaves view
 *  as the camera leans toward the team card. */
export const VideoTwoSides = video(TWO_SIDES, { headline: 'Event housing. In sync.' })
VideoTwoSides.storyName = 'Video · D Two sides, in sync'

/** Concept B's poster alone — what prefers-reduced-motion: reduce (or
 *  Save-Data) gets. The <video> is never created and there is no Pause
 *  button, because nothing moves. */
export const VideoReducedMotion = video(LIQUID, { still: true })
VideoReducedMotion.storyName = 'Video · Reduced motion'

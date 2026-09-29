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
 *  Read these as a set. The dark grounds make the product feel like a console;
 *  the light one makes it feel like a document. That is the actual choice being
 *  made here — the animation is the smaller half.
 */
import DsInput from '../../components/DsInput.vue'
import { authStep } from './_account'

export default {
  title: 'Account V2/Concepts/Login Backgrounds',
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

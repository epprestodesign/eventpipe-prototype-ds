<script setup>
/* Av2Split — the shared auth shell: a white panel on the left, a shader
 * showcase on the right. Every pre-login step in Account V2 renders in it,
 * through authStep() in _account.js.
 *
 * Left panel, top to bottom: Av2TopBar (wordmark + "Get support"), the step's
 * content column (default slot) pinned high so it grows downward, the
 * `footnote` slot at the bottom of that column (authStep puts the
 * anti-phishing line there), and Av2Footer.
 *
 * Right: Av2Showcase — the shader ground, two frosted cards chosen by
 * `showcase`, and a headline. Illustration only; it is aria-hidden apart from
 * its headline.
 *
 * The panel's right-hand corners are rounded by --av2-panel-radius (32px,
 * defined once in src/css/account-v2.scss). That is a deliberate,
 * user-requested exception to the DS 4px radius scale for this layout only;
 * everything inside the panel and the showcase cards stays on DS radius tokens.
 * The showcase is pulled left under the panel by the same radius, so the
 * corner cut-outs show the shader, not a flat backdrop.
 *
 * Layout adapted on 2026-09-29 from the (removed) Hotel Partner concept's
 * split screen, with the hotel content taken out. Desktop only.
 */
import { ref } from 'vue'
import Av2TopBar from './Av2TopBar.vue'
import Av2Footer from './Av2Footer.vue'
import Av2SupportModal from './Av2SupportModal.vue'
import Av2Showcase from './Av2Showcase.vue'

const props = defineProps({
  supportEmail: { type: String, required: true },
  /** Which pair of cards the right panel shows — see Av2Showcase. */
  showcase: { type: String, default: 'platform' },
  /** Shader variant for the right panel: 'depth' | 'liquid' | 'wave'. */
  variant: { type: String, default: 'liquid' },
  forceFallback: { type: Boolean, default: false },
  /** The ground is pale, so the showcase headline runs in dark ink. */
  light: { type: Boolean, default: false },
  /** Show the showcase's frosted cards. Off for video grounds that bring their own. */
  cards: { type: Boolean, default: true },
  /** Passed to Av2Showcase: overrides its headline for one story. */
  headline: { type: String, default: '' },
  supportOpen: { type: Boolean, default: false },
})
const open = ref(props.supportOpen)
</script>

<template>
  <div class="av2sp">
    <div class="av2sp__panel">
      <div class="av2sp__bar"><Av2TopBar @support="open = true" /></div>
      <main class="av2sp__body">
        <div class="av2sp__col">
          <div class="av2sp__content"><slot /></div>
          <div v-if="$slots.footnote" class="av2sp__foot"><slot name="footnote" /></div>
        </div>
      </main>
      <div class="av2sp__bar"><Av2Footer /></div>
    </div>
    <Av2Showcase class="av2sp__show" :showcase="showcase" :variant="variant"
      :force-fallback="forceFallback" :light="light" :cards="cards" :headline="headline">
      <template v-if="$slots.ground" #ground><slot name="ground" /></template>
    </Av2Showcase>
    <Av2SupportModal v-model="open" :email="supportEmail" />
  </div>
</template>

<style scoped>
.av2sp {
  display: grid;
  /* Widened 2026-09-29 at the user's request (was minmax(560px, 44%)). */
  grid-template-columns: minmax(640px, 52%) 1fr;
  min-height: 100vh;
  /* Behind the showcase only while it loads; the shader or its fallback
     covers it. The navy is the DS app-chrome token. */
  background: var(--ds-color-surface-sidebar);
}
.av2sp__panel {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--ds-color-surface);
  border-radius: 0 var(--av2-panel-radius) var(--av2-panel-radius) 0;
  box-shadow: var(--ds-shadow-4);
  /* Generous gutters on every side (user request 2026-09-29 — the logo, Get
     support, Terms and © were sitting 48px from the edges). They scale with the
     viewport and are shared by the top bar, the body and the footer, so all
     three line up on one left and one right edge. */
  --av2-gutter-x: clamp(64px, 6.5vw, 120px);
  --av2-gutter-y: clamp(36px, 5vh, 64px);
  padding-block: var(--av2-gutter-y);
}
.av2sp__bar { padding: 0 var(--av2-gutter-x); }
.av2sp__body { flex: 1 1 auto; display: flex; padding: clamp(64px, 10vh, 120px) var(--av2-gutter-x) 32px; }
/* Pinned high rather than centred: the column grows downward as errors and
   escape hatches appear, instead of jumping as it re-centres. */
.av2sp__col { width: 100%; max-width: 440px; margin: 0 auto; display: flex; flex-direction: column; }
.av2sp__content { flex: none; }
/* The footnote sits at the bottom of the column, above the footer, and never
   closer than 32px to the content above it. */
.av2sp__foot { margin-top: auto; padding-top: 32px; }
/* Tuck the showcase under the panel's rounded edge so the corners show ground. */
.av2sp__show { margin-left: calc(-1 * var(--av2-panel-radius)); }
</style>

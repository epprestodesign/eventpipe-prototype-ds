<script setup>
/* Av2Showcase — the right half of the auth shell (Av2Split).
 *
 * A shader ground (Av2ShaderGround — evaluation-licensed, Storybook only), two
 * frosted cards floating over it, and a white headline at the bottom. What the
 * cards and headline say depends on where the user is in the flow:
 *
 *   platform   — sign in, pilot gate, SSO concept. What the platform does for
 *                every kind of staff user: an event's rooms, its pickup.
 *   security   — the emailed code (and the later authenticator challenge).
 *                A verified sign-in and a trusted device (ENG-3037).
 *   protection — forgot / set password. A reset link that expires in an hour
 *                and a password change that signs other sessions out
 *                (ENG-3020, ENG-3024).
 *
 * Frosted glass from DS tokens only: the surface token mixed toward
 * transparent, a backdrop blur, a hairline of the same surface, and the DS
 * shadow scale. Cards stay on the DS 4px radius.
 *
 * The cards are illustration, not UI: nothing in them is interactive, so the
 * cluster is aria-hidden and the headline carries the message.
 *
 * Copy: the platform subline reuses the design system's existing claim ("the
 * platform behind $1B+ in hotel bookings", from Account › Login). The figures
 * on the cards (92%, 412 rooms, Boston, …) are illustrative sample content,
 * like any mock screenshot — not claims.
 *
 * The `ground` slot replaces the default shader (authStep's `ground` option).
 * The default shader is aria-hidden by its wrapper; a slotted ground owns its
 * own semantics, because Av2VideoGround puts a Pause/Play control beside its
 * (aria-hidden) media and that control must not sit inside aria-hidden.
 *
 * `cards: false` drops the frosted card cluster (the stage stays, so the
 * headline keeps its place). Used by the pre-rendered video grounds, which
 * already carry their own cards. Defaults to true.
 */
import { inject } from 'vue'
import Av2ShaderGround from './Av2ShaderGround.vue'
import Av2VideoGround from './Av2VideoGround.vue'
import DsStat from '../../../components/DsStat.vue'

/* App-level ground override. An app can provide('av2ShowcaseGround',
   { poster, webm, mp4 }) to swap every showcase's shader for that pre-rendered
   video ground, with the frosted cards hidden (the video brings its own). The
   standalone EP Pay prototype does this with video concept C — the shader
   package is evaluation-licensed and must not ship there. Storybook never
   provides it, so every story renders exactly as before. */
const groundOverride = inject('av2ShowcaseGround', null)

defineProps({
  showcase: {
    type: String,
    default: 'platform',
    validator: (v) => ['platform', 'security', 'protection'].includes(v),
  },
  variant: { type: String, default: 'liquid' },
  forceFallback: { type: Boolean, default: false },
  /** Pale ground (the 'wave' shader): headline in dark ink. */
  light: { type: Boolean, default: false },
  /** Render the frosted card cluster. Off for grounds that bring their own. */
  cards: { type: Boolean, default: true },
  /** Story-level headline override (a concept testing new copy). Empty keeps
   *  the showcase's own headline; the subline is never overridden. */
  headline: { type: String, default: '' },
})

const COPY = {
  platform: {
    label: 'About EventPipe',
    headline: 'Event housing, all in one place',
    sub: 'The platform behind $1B+ in hotel bookings.',
  },
  security: {
    label: 'How sign-in codes protect your account',
    headline: 'Your account, protected',
    sub: 'A one-time code confirms it’s you. Trusted devices skip it for 30 days.',
  },
  protection: {
    label: 'How password resets are protected',
    headline: 'Back into your account, safely',
    sub: 'Reset links work once and expire in an hour. A new password signs you out everywhere else.',
  },
}
</script>

<template>
  <section class="av2sc" :class="{ 'av2sc--light': light }" :aria-label="COPY[showcase].label">
    <div class="av2sc__ground" :aria-hidden="$slots.ground || groundOverride ? undefined : 'true'">
      <Av2VideoGround v-if="groundOverride" v-bind="groundOverride" />
      <slot v-else name="ground">
        <Av2ShaderGround :variant="variant" :force-fallback="forceFallback" />
      </slot>
    </div>

    <div class="av2sc__stage" aria-hidden="true">
      <template v-if="cards && !groundOverride">
      <!-- platform: an event's room count behind this weekend's pickup. -->
      <div v-if="showcase === 'platform'" class="av2sc__cluster">
        <div class="av2sc__glass av2sc__rear">
          <div class="av2sc__head">
            <span class="av2sc__ico"><q-icon name="sports_football" size="20px" /></span>
            <div>
              <div class="av2sc__eyebrow">Event</div>
              <div class="av2sc__title">Steelers at Patriots</div>
            </div>
          </div>
          <div class="av2sc__meta">
            <span class="av2sc__tag"><q-icon name="location_on" size="16px" /> Gillette Stadium</span>
            <span class="av2sc__tag"><q-icon name="hotel" size="16px" /> 412 rooms booked</span>
          </div>
          <div class="av2sc__skel">
            <span style="width: 92%" /><span style="width: 78%" /><span style="width: 56%" />
          </div>
        </div>
        <div class="av2sc__glass av2sc__front">
          <div class="av2sc__eyebrow">This weekend</div>
          <DsStat value="92%" label="Event pickup" />
          <div class="av2sc__bar"><span style="width: 92%" /></div>
        </div>
      </div>

      <!-- security: a verified sign-in in front of the device it trusted. -->
      <div v-else-if="showcase === 'security'" class="av2sc__cluster">
        <div class="av2sc__glass av2sc__rear">
          <div class="av2sc__head">
            <span class="av2sc__ico"><q-icon name="laptop_mac" size="20px" /></span>
            <div>
              <div class="av2sc__eyebrow">Trusted device</div>
              <div class="av2sc__title">Chrome on macOS</div>
            </div>
          </div>
          <div class="av2sc__meta">
            <span class="av2sc__tag"><q-icon name="verified_user" size="16px" /> Trusted · 30 days</span>
          </div>
          <div class="av2sc__skel">
            <span style="width: 88%" /><span style="width: 64%" />
          </div>
        </div>
        <div class="av2sc__glass av2sc__front">
          <div class="av2sc__row">
            <span class="av2sc__ok"><q-icon name="check" size="16px" /></span>
            <div class="av2sc__strong">New sign-in verified</div>
          </div>
          <div class="av2sc__line">Chrome on macOS · Boston, MA</div>
          <div class="av2sc__line av2sc__line--quiet">just now</div>
        </div>
      </div>

      <!-- protection: the reset link behind the password it produced. -->
      <div v-else class="av2sc__cluster">
        <div class="av2sc__glass av2sc__rear">
          <div class="av2sc__head">
            <span class="av2sc__ico"><q-icon name="link" size="20px" /></span>
            <div>
              <div class="av2sc__eyebrow">Reset link</div>
              <div class="av2sc__title">Set a new password</div>
            </div>
          </div>
          <div class="av2sc__meta">
            <span class="av2sc__tag"><q-icon name="schedule" size="16px" /> Expires in 1 hour</span>
            <span class="av2sc__tag"><q-icon name="looks_one" size="16px" /> Single use</span>
          </div>
          <div class="av2sc__skel">
            <span style="width: 90%" /><span style="width: 60%" />
          </div>
        </div>
        <div class="av2sc__glass av2sc__front">
          <div class="av2sc__row">
            <span class="av2sc__ok"><q-icon name="check" size="16px" /></span>
            <div class="av2sc__strong">Password updated</div>
          </div>
          <div class="av2sc__bar av2sc__bar--ok"><span style="width: 100%" /></div>
          <div class="av2sc__line">Other sessions signed out</div>
        </div>
      </div>
      </template>
    </div>

    <div class="av2sc__copy">
      <h2 class="av2sc__headline">{{ headline || COPY[showcase].headline }}</h2>
      <p class="av2sc__sub">{{ COPY[showcase].sub }}</p>
    </div>
  </section>
</template>

<style scoped>
.av2sc {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--ds-color-surface-sidebar);
}
.av2sc__ground { position: absolute; inset: 0; }

/* The left edge of this section runs under the panel's rounded corner (see
   Av2Split), so the stage and the copy are inset by the same radius. */
.av2sc__stage {
  position: relative; flex: 1 1 auto;
  display: flex; align-items: center; justify-content: center;
  padding: 48px 48px 48px calc(48px + var(--av2-panel-radius));
}
.av2sc__cluster { position: relative; width: 380px; padding: 100px 0 0 64px; }

.av2sc__glass {
  background: color-mix(in srgb, var(--ds-color-surface) 72%, transparent);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  backdrop-filter: blur(18px) saturate(1.2);
  border: 1px solid color-mix(in srgb, var(--ds-color-surface) 55%, transparent);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-4);
  color: var(--ds-color-text);
}

/* The rear card is the larger one; the front card overlaps only its top
   padding, never its content. */
.av2sc__rear { padding: 20px 20px 22px; }
.av2sc__head { display: flex; align-items: center; gap: 12px; }
.av2sc__ico {
  width: 36px; height: 36px; flex: none; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--ds-color-background-selected); color: var(--ds-color-link);
}
.av2sc__eyebrow { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.02em; color: var(--ds-color-text-subtle); }
.av2sc__title { font-size: 1rem; font-weight: 700; line-height: 1.3; }
.av2sc__meta { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 16px; }
.av2sc__tag {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 3px 10px; font-size: 0.8125rem; font-weight: 600;
  border-radius: var(--ds-radius-sm);
  background: color-mix(in srgb, var(--ds-color-surface) 70%, transparent);
  border: 1px solid var(--ds-color-border-container);
}
.av2sc__skel { display: flex; flex-direction: column; gap: 8px; }
.av2sc__skel span { display: block; height: 8px; border-radius: var(--ds-radius-sm); background: var(--ds-color-background-neutral); }

.av2sc__front {
  position: absolute; top: 0; left: 0; width: 220px;
  padding: 14px 16px 16px;
}
.av2sc__front .av2sc__eyebrow { margin-bottom: 4px; }
.av2sc__row { display: flex; align-items: center; gap: 8px; }
.av2sc__ok {
  width: 22px; height: 22px; flex: none; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--ds-color-background-success-bold); color: var(--ds-color-text-inverse);
}
.av2sc__strong { font-size: 0.9375rem; font-weight: 700; line-height: 1.3; }
.av2sc__line { margin-top: 8px; font-size: 0.8125rem; line-height: 1.4; color: var(--ds-color-text-subtle); }
.av2sc__line--quiet { margin-top: 2px; color: var(--ds-color-text-subtlest); }

.av2sc__bar { margin-top: 10px; height: 6px; border-radius: var(--ds-radius-sm); background: var(--ds-color-background-neutral); overflow: hidden; }
.av2sc__bar span { display: block; height: 100%; background: var(--ds-color-background-brand-bold); }
.av2sc__bar--ok span { background: var(--ds-color-background-success-bold); }

.av2sc__copy {
  position: relative;
  padding: 0 56px 56px calc(56px + var(--av2-panel-radius));
  color: var(--ds-color-text-inverse);
}
.av2sc__headline { margin: 0 0 8px; font-size: 2rem; line-height: 1.2; font-weight: 700; max-width: 520px; color: var(--ds-color-text-inverse); }
.av2sc__sub { margin: 0; font-size: 1rem; line-height: 1.5; max-width: 520px; color: var(--ds-color-text-inverse); opacity: 0.85; }
/* The 'wave' ground is pale (an Azure tint into azure-400), so the headline
   runs in dark ink there — keyed to the ground's lightness via `light`, not
   to whether a shader is present. */
.av2sc--light .av2sc__headline, .av2sc--light .av2sc__sub { color: var(--ds-color-text); }
.av2sc--light .av2sc__sub { opacity: 1; }
</style>

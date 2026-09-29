<script setup>
/* Av2BannerAnnouncement — the reusable announcement banner ENG-3044 asks for.
 *
 * First use: "MFA is coming". Everything a rollout changes is a prop, because
 * the ticket makes the text, the date, the learn-more link and the on/off
 * switch config rather than code: the consumer passes what config says and
 * renders nothing when config says off.
 *
 * Why not DsNotification: that is a floating card (440px max, drop shadow,
 * featured-icon circle) built for toasts and stacked notification lists. An
 * announcement that runs across a page header is a different object. What this
 * reuses instead is the DS Banner pattern (Components › Feedback & Status ›
 * Banner) — icon, bold title, description, action link, dismiss — in its Info
 * appearance, with the same token triple: background-info surface,
 * background-info-bold edge, text-info accent. That pattern exists only as
 * story markup today, so this is a candidate to lift into a DsBanner.
 *
 * Two layouts:
 *   · strip  — full width, no radius, rule on the bottom edge only. For the
 *              in-app header, where it sits flush under the AppBar and must
 *              read as part of the chrome rather than as page content.
 *   · inline — bordered and rounded, for inside a card (the login page).
 *
 * `text` may contain {date}; it is replaced with `date` formatted long-form
 * ("November 2, 2026") and set in bold, so the one fact a reader needs is the
 * one that stands out and the date lives in exactly one config value.
 *
 * Dismissal is emitted, not stored. Persisting it is per user (the ticket:
 * "each user can dismiss it, persists across reload") and that belongs to the
 * consumer — a flag on the user record, or storage keyed by user id — not to
 * a presentational component that cannot know who is signed in.
 */
import { computed } from 'vue'

const props = defineProps({
  /** Bold lead-in. Optional; the strip reads fine without one. */
  title: { type: String, default: '' },
  /** Body copy. `{date}` is replaced with the formatted `date`. */
  text: { type: String, required: true },
  /** ISO date (YYYY-MM-DD) for the change being announced. */
  date: { type: String, default: '' },
  learnMoreHref: { type: String, default: '' },
  learnMoreLabel: { type: String, default: 'Learn more' },
  dismissible: { type: Boolean, default: true },
  icon: { type: String, default: 'info' },
  layout: {
    type: String,
    default: 'strip',
    validator: (v) => ['strip', 'inline'].includes(v),
  },
})
const emit = defineEmits(['dismiss'])

/* Formatted in UTC from a noon timestamp so the day cannot slip across a
   timezone boundary: a banner that says November 1 in California and
   November 2 in New York is worse than no banner. */
const formattedDate = computed(() => {
  if (!props.date) return ''
  const d = new Date(`${props.date}T12:00:00Z`)
  return d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' })
})

/* Split around {date} rather than v-html, so config copy can never inject
   markup into the chrome. */
const parts = computed(() => {
  const i = props.text.indexOf('{date}')
  if (i === -1 || !formattedDate.value) return { before: props.text, date: '', after: '' }
  return { before: props.text.slice(0, i), date: formattedDate.value, after: props.text.slice(i + 6) }
})
</script>

<template>
  <!-- aria-live="polite" per ENG-3044. It announces when the banner is
       inserted after load (config flips on mid-session) without interrupting
       whatever the user is doing. It is a labelled region too, so screen
       reader users can jump to it from the landmarks list. -->
  <section
    class="av2ban"
    :class="`av2ban--${layout}`"
    aria-live="polite"
    aria-label="Announcement">
    <q-icon :name="icon" size="20px" class="av2ban__icon" aria-hidden="true" />

    <p class="av2ban__text">
      <strong v-if="title" class="av2ban__title">{{ title }}</strong>
      {{ parts.before }}<strong v-if="parts.date">{{ parts.date }}</strong>{{ parts.after }}
      <a v-if="learnMoreHref && layout === 'inline'" :href="learnMoreHref" class="av2ban__link">{{ learnMoreLabel }}</a>
    </p>

    <!-- In the strip the link is its own item on the right, so it never wraps
         onto an orphan line under a long sentence. -->
    <a v-if="learnMoreHref && layout === 'strip'" :href="learnMoreHref"
      class="av2ban__link av2ban__link--end">{{ learnMoreLabel }}</a>

    <button
      v-if="dismissible"
      type="button"
      class="av2ban__close"
      aria-label="Dismiss announcement"
      @click="emit('dismiss')">
      <q-icon name="close" size="18px" />
    </button>
  </section>
</template>

<style scoped>
.av2ban {
  display: flex;
  align-items: flex-start;
  gap: var(--ds-space-3);
  background: var(--ds-color-background-info);
  color: var(--ds-color-text);
}
/* Strip: flush under the AppBar. Same left inset as the page content below it
   (28px, the Pages archetype gutter) so the icon lines up with the page title. */
.av2ban--strip {
  padding: var(--ds-space-3) 28px;
  border-bottom: 1px solid var(--ds-color-background-info-bold);
}
.av2ban--inline {
  padding: var(--ds-space-3) var(--ds-space-4);
  border: 1px solid var(--ds-color-background-info-bold);
  border-radius: var(--ds-radius-md);
}

.av2ban__icon { flex: none; color: var(--ds-color-text-info); margin-top: 1px; }

.av2ban__text {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}
.av2ban__title { color: var(--ds-color-text-info); margin-right: 4px; }
.av2ban__link {
  font-weight: 700;
  color: var(--ds-color-text-info);
  text-decoration: underline;
  text-underline-offset: 2px;
  white-space: nowrap;
}
.av2ban__link--end { flex: none; font-size: 0.875rem; line-height: 1.5; }

/* A real button, 32px target, visible focus ring from the DS focus colour. */
.av2ban__close {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: -6px -8px -6px 0;
  padding: 0;
  border: 0;
  border-radius: var(--ds-radius-sm);
  background: transparent;
  color: var(--ds-color-text-info);
  cursor: pointer;
}
.av2ban__close:hover { background: var(--ds-color-surface); }
.av2ban__close:focus-visible { outline: 2px solid var(--ds-color-border-focused); outline-offset: 1px; }
</style>

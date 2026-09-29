<script setup>
/* Av2ViewRow — one destination on the "Where to?" picker
 * (Account V2 › Concepts › Passwordless · Choose view). Structure after
 * Attio's workspace picker: a bordered row with a square tile, a name, a
 * sub-line and a chevron. Two kinds:
 *
 *   destination (default) — a merchant account, or the internal "EventPipe
 *     view". `tone` paints the square initial tile from DS bold backgrounds;
 *     tone 'eventpipe' puts the real EventPipe mark on the navy chrome colour
 *     instead of initials.
 *   action — the "+ Apply for a merchant account" row: centred label with a
 *     leading plus, no tile, no chevron.
 *
 * Why not DsListItem: it renders a <button> (or a <div>), and a destination is
 * navigation — an <a href> lets staff who work across merchants cmd/ctrl-click
 * to open two merchants in two tabs, and screen readers announce it as a link.
 * The anatomy, spacing and tokens follow DsListItem so the two read as one
 * family. Every row gets a full-row hover and a visible :focus-visible ring;
 * the tile and the chevron are decorative (aria-hidden), so the link's name is
 * the merchant name plus its sub-line.
 */
import mark from '../../../assets/logo/eventpipe-logo-fff.svg'

defineProps({
  href: { type: String, default: '#' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  /** One or two letters for the tile. Ignored for tone 'eventpipe'. */
  initials: { type: String, default: '' },
  /** 'success' | 'discovery' | 'info' | 'brand' | 'eventpipe' */
  tone: { type: String, default: 'brand' },
  /** The "+ Apply …" action row rather than a destination. */
  action: { type: Boolean, default: false },
})
</script>

<template>
  <a v-if="action" :href="href" class="av2vr av2vr--action">
    <q-icon name="add" size="18px" class="av2vr__plus" />
    <span class="av2vr__action-label">{{ title }}</span>
  </a>

  <a v-else :href="href" class="av2vr">
    <span class="av2vr__tile" :class="`av2vr__tile--${tone}`" aria-hidden="true">
      <!-- The real EventPipe logo file, cropped to its hexagon mark (the first
           28 of its 128 viewBox units) — no redrawn or invented mark. -->
      <span v-if="tone === 'eventpipe'" class="av2vr__mark"><img :src="mark" alt="" /></span>
      <template v-else>{{ initials }}</template>
    </span>
    <span class="av2vr__body">
      <span class="av2vr__title">{{ title }}</span>
      <span v-if="subtitle" class="av2vr__sub">{{ subtitle }}</span>
    </span>
    <q-icon name="chevron_right" size="20px" class="av2vr__chev" aria-hidden="true" />
  </a>
</template>

<style scoped>
.av2vr {
  display: flex; align-items: center; gap: 14px;
  width: 100%; min-height: 64px; padding: 12px 14px 12px 12px;
  border: 1px solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  text-decoration: none;
  transition:
    background var(--ds-duration-fast) var(--ds-ease-standard),
    border-color var(--ds-duration-fast) var(--ds-ease-standard);
}
.av2vr:hover { background: var(--ds-color-background-neutral); border-color: var(--ds-color-border-bold); }
.av2vr:focus-visible {
  outline: 2px solid var(--ds-color-border-focused);
  outline-offset: 2px;
  border-color: var(--ds-color-border-focused);
  background: var(--ds-color-background-brand-subtlest);
}

.av2vr__tile {
  flex: none; width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--ds-radius-md);
  font-size: 0.9375rem; font-weight: 700; letter-spacing: 0.02em;
  color: var(--ds-color-text-inverse);
}
.av2vr__tile--brand { background: var(--ds-color-background-brand-bold); }
.av2vr__tile--success { background: var(--ds-color-background-success-bold); }
.av2vr__tile--discovery { background: var(--ds-color-background-discovery-bold); }
.av2vr__tile--info { background: var(--ds-color-background-info-bold); }
.av2vr__tile--eventpipe { background: var(--ds-color-surface-sidebar); }

/* Crop window onto the logo file: 24px tall, 28/33 of that wide. */
.av2vr__mark { display: block; height: 24px; width: calc(24px * 28 / 33); overflow: hidden; }
.av2vr__mark img { display: block; height: 24px; width: auto; max-width: none; }

.av2vr__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.av2vr__title { font-size: 0.9375rem; font-weight: 700; line-height: 1.3; color: var(--ds-color-text); }
.av2vr__sub {
  font-size: 0.8125rem; line-height: 1.35; color: var(--ds-color-text-subtle);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.av2vr__chev {
  flex: none; color: var(--ds-color-icon-subtle);
  transition: transform var(--ds-duration-fast) var(--ds-ease-standard);
}
.av2vr:hover .av2vr__chev,
.av2vr:focus-visible .av2vr__chev { transform: translateX(2px); color: var(--ds-color-icon); }

/* Action row — centred, quieter, same edges and focus treatment. */
.av2vr--action {
  justify-content: center; gap: 8px; min-height: 40px; padding: 8px 14px;
  font-size: 0.875rem; font-weight: 600; color: var(--ds-color-link);
}
.av2vr__plus { color: inherit; }

@media (prefers-reduced-motion: reduce) {
  .av2vr, .av2vr__chev { transition: none; }
  .av2vr:hover .av2vr__chev, .av2vr:focus-visible .av2vr__chev { transform: none; }
}
</style>

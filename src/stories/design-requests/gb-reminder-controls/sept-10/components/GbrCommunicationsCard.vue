<script setup>
/* GbrCommunicationsCard — the Communications card on Registration Settings.
 *
 * Existing (Phase 2, DES-425): one toggle per company-level Teams Management
 * template, controlling only whether it sends for this event.
 *
 * A line naming the Compliance Reminder recipients was added here during the
 * first pass, to make the modal's third trigger condition visible from this
 * page. Scott asked for it to come out on 2026-09-09 (PP-44), so the card is
 * back to the Phase 2 original: one toggle per template, nothing else.
 *
 * The condition still drives the modal. It just is not shown here, which means
 * the modal can arrive without the user having seen the reason for it — worth
 * remembering if that ever gets raised as confusing.
 */
defineProps({
  /** [{ key, title, desc, on }] — mutated in place; the parent owns the array. */
  templates: { type: Array, required: true },
  maxWidth: { type: String, default: '780px' },
})
</script>

<template>
  <q-card flat bordered>
    <q-card-section style="padding:28px 32px;">
      <div class="gbr-card__title">Communications</div>

      <div class="gbr-card__intro" :style="{ maxWidth }">
        These are your company's Teams Management templates. Switching one off here only stops it
        sending <strong>for this event</strong> — the content itself is edited globally, in
        <strong>Company Settings &rsaquo; Notifications</strong>.
      </div>

      <div :style="{ maxWidth }">
        <div v-for="(t, ti) in templates" :key="t.key">
          <q-separator v-if="ti" />
          <div class="row items-center no-wrap" style="padding:14px 0; gap:24px;">
            <div style="flex:1; min-width:0;">
              <div class="gbr-card__name">{{ t.title }}</div>
              <div class="gbr-card__desc">{{ t.desc }}</div>
            </div>
            <q-toggle v-model="t.on" color="primary" style="flex:none;"
              :aria-label="'Send ' + t.title + ' for this event'" />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.gbr-card__title { color: var(--ds-color-background-brand-bold); font-size: 1.125rem; font-weight: 500; margin-bottom: 20px; }
.gbr-card__intro { color: var(--ds-color-text); line-height: 1.5; margin: -10px 0 4px; }
.gbr-card__name { font-weight: 700; color: var(--ds-color-text); }
.gbr-card__desc { font-size: 0.875rem; color: var(--ds-color-text-subtle); line-height: 1.45; margin-top: 2px; }
</style>

<script setup>
/* GbrCommunicationsCard — the Communications card on Registration Settings.
 *
 * Existing (Phase 2, DES-425): one toggle per company-level Teams Management
 * template, controlling only whether it sends for this event.
 *
 * NEW here, for PP-44: a line under Compliance Reminder naming the recipients.
 * Of the three conditions that raise the conflict modal, two are visible on
 * screen — this toggle, and group block reminders over on Email Settings. The
 * third, whether the company's recipient config includes group block contacts,
 * is invisible from this page, so the modal would otherwise arrive from nowhere.
 * Stating it here means the modal confirms something the user has already seen
 * rather than introducing it.
 *
 * It is a plain line, not a warning: on its own this is a fact about how the
 * company is configured, not a problem. It only becomes a problem when group
 * block reminders are also on, and that is what the modal is for.
 */
defineProps({
  /** [{ key, title, desc, on }] — mutated in place; the parent owns the array. */
  templates: { type: Array, required: true },
  /** Whether the company's Compliance Reminder recipients include group block contacts. */
  recipientsIncludeGroupBlockContacts: { type: Boolean, default: false },
  /** How many tiers that applies to — 1 reads "1 tier", 4 reads "4 tiers". */
  tiers: { type: Number, default: 1 },
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

              <div v-if="t.key === 'compliance-reminder' && recipientsIncludeGroupBlockContacts"
                class="gbr-card__recipients">
                <q-icon name="groups" size="15px" class="q-mr-xs" />
                Recipients for {{ tiers }} {{ tiers === 1 ? 'tier' : 'tiers' }} include
                <strong>group block contacts</strong>.
              </div>
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
.gbr-card__recipients { font-size: 0.8125rem; color: var(--ds-color-text-subtle); margin-top: 6px; }
</style>

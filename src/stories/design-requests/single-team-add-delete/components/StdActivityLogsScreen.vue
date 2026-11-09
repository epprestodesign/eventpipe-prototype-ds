<script setup>
// The event's Activity Logs tab, where STD-4 writes its entry — rebuilt from
// the TTS production capture: the standard event header, then the log table
// straight on the page (no card, no heading).
import StdActivityLog from './StdActivityLog.vue'

const props = defineProps({
  event: { type: Object, required: true },
  rows: { type: Array, default: () => [] },
})
const TABS = ['Hotels', 'RFPs', 'Venues', 'Notes', 'Groups', 'Reservations', 'Waitlist', 'Pickup', 'Registration', 'Customize', 'Activity Logs']
const meta = [
  ['City/State:', props.event.city], ['Room Night Goal:', props.event.roomGoal], ['Account Manager:', props.event.manager],
  ['Event Producer:', props.event.producer], ['Peak Night Goal:', props.event.peakGoal], ['Stay to Play:', props.event.stayToPlay],
  ['Start/End Dates:', props.event.dates],
]
</script>

<template>
  <div class="stdl">
    <div class="stdl__head">
      <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2 q-mb-sm">
        <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
        <q-breadcrumbs-el label="Events" class="text-primary" />
        <q-breadcrumbs-el :label="event.name" class="text-grey-7" />
      </q-breadcrumbs>
      <div class="row items-center q-gutter-md no-wrap">
        <h1 class="stdl__title">{{ event.name }}</h1>
        <q-chip dense :color="event.status === 'Active' ? 'positive' : 'grey-6'" text-color="white" icon-right="expand_more" :label="event.status" />
        <q-space />
        <q-btn unelevated no-caps color="primary" label="Edit Event" />
        <q-btn outline dense no-caps color="grey-6" icon="more_horiz" aria-label="More event actions" class="stdl__more" />
      </div>
      <div class="stdl__meta">
        <template v-for="([k, v], i) in meta" :key="i"><span>{{ k }}</span><span>{{ v }}</span></template>
      </div>
      <q-tabs model-value="Activity Logs" no-caps active-color="primary" indicator-color="primary" align="left" class="text-grey-7" style="margin:0 -8px;">
        <q-tab v-for="t in TABS" :key="t" :name="t" :label="t" />
      </q-tabs>
    </div>
    <div class="stdl__body">
      <std-activity-log :rows="rows" />
    </div>
  </div>
</template>

<style scoped>
.stdl { min-height: 100%; background: var(--ds-color-surface-sunken); }
.stdl__head { background: var(--ds-color-surface); padding: 20px 32px 0; border-bottom: 1px solid var(--ds-color-border); }
.stdl__title { margin: 0; font-size: 1.625rem; line-height: 1.3; font-weight: 700; letter-spacing: -0.01em; color: var(--ds-color-text); }
.stdl__more { min-width: 36px; }
.stdl__meta { display: grid; grid-template-columns: 160px minmax(0, 1.4fr) 150px minmax(0, 0.5fr) 150px minmax(0, 1fr); gap: 4px 16px; margin: 14px 0 18px; max-width: 1180px; font-size: 0.9375rem; }
.stdl__meta span:nth-child(odd) { color: var(--ds-color-text-subtle); }
.stdl__body { padding: 24px 32px 56px; }
</style>

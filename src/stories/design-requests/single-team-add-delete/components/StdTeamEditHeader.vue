<script setup>
// The Team Edit header card.
//
// STD-1 · ENG2-110 — "Delete Team" sits in this header for every registered
// team, set apart from Save (which lives down in the form card). It is never on
// Compliance list rows. Outline + danger colour so it reads as destructive
// without competing with the page's primary action. "Team" reads "Organization"
// for events that register Organizations.
//
// STA-3 · ENG2-117 — in create mode the header names the task instead of a team
// and the tabs are hidden until the first save.
defineProps({
  mode: { type: String, default: 'edit' },
  title: { type: String, default: '' },
  eventName: { type: String, default: '' },
  word: { type: String, default: 'Team' },
  tab: { type: String, default: 'details' },
})
const emit = defineEmits(['update:tab', 'delete', 'back'])
</script>

<template>
  <q-card flat bordered class="stdh">
    <q-card-section class="stdh__body">
      <button type="button" class="stdh__back" @click="emit('back')">
        <q-icon name="arrow_back" size="16px" /> Compliance
      </button>
      <div class="row items-start no-wrap q-gutter-md">
        <div class="col">
          <h1 class="stdh__title">{{ mode === 'create' ? `Add single ${word.toLowerCase()}` : title }}</h1>
          <div v-if="mode === 'create'" class="stdh__sub">
            Group blocks, reservations, communications, compliance credits and notes appear after the first save.
          </div>
          <div v-else class="stdh__sub">
            <span class="stdh__label">Event Name:</span> <strong>{{ eventName }}</strong>
          </div>
        </div>
        <q-btn v-if="mode !== 'create'" outline no-caps color="negative" icon="delete_outline"
          :label="`Delete ${word}`" class="stdh__delete" @click="emit('delete')" />
      </div>
      <q-tabs v-if="mode !== 'create'" :model-value="tab" no-caps active-color="primary" indicator-color="primary"
        align="left" class="text-grey-7 stdh__tabs" @update:model-value="(v) => emit('update:tab', v)">
        <q-tab name="details" label="Details / Notes" />
        <q-tab name="blocks" label="Group Blocks / Reservations" />
        <q-tab name="comms" label="Communications Log" />
      </q-tabs>
      <div v-else class="stdh__spacer" />
    </q-card-section>
  </q-card>
</template>

<style scoped>
.stdh { margin-bottom: 20px; }
.stdh__body { padding: 18px 30px 0; }
.stdh__back {
  display: inline-flex; align-items: center; gap: 4px; margin-bottom: 8px; padding: 0;
  background: none; border: 0; cursor: pointer; font: inherit; font-size: 0.8125rem; color: var(--ds-color-text-brand);
}
.stdh__title { margin: 0; font-size: 1.375rem; line-height: 1.3; font-weight: 700; letter-spacing: normal; color: var(--ds-color-text); }
.stdh__sub { margin: 6px 0 4px; font-size: 0.9375rem; color: var(--ds-color-text); }
.stdh__label { color: var(--ds-color-text-subtle); }
.stdh__delete { flex: none; }
.stdh__tabs { margin: 4px -8px 0; }
.stdh__spacer { height: 18px; }
</style>

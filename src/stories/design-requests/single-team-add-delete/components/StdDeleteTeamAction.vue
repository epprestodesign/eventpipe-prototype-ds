<script setup>
// STD-1 · ENG2-110 — where "Delete Team" lives on Team Edit. Four placements,
// so delete is possible but never tempting:
//
//   button — A. a trash-can "Delete Team" button in the header
//   save   — B. an icon-only trash button beside Cancel / Save Changes
//   menu   — C. a ••• overflow button in the header; its menu holds only
//                "Delete Team" for now (room for more actions later). Same
//                pattern as the event page's ••• beside Edit Event.
//   bottom — D. a "Delete Team" section at the bottom of the whole page, after
//                Notes, with a description and a delete button.
//
// Every placement opens the same confirmation modal (STD-2). "Team" reads
// "Organization" for events that register Organizations.
defineProps({
  variant: { type: String, default: 'menu' },
  word: { type: String, default: 'Team' },
})
const emit = defineEmits(['delete'])
</script>

<template>
  <!-- A · trash-can button -->
  <q-btn v-if="variant === 'button'" outline no-caps color="negative" icon="delete_outline"
    :label="`Delete ${word}`" class="stdda__btn" @click="emit('delete')" />

  <!-- B · icon-only trash beside Cancel / Save Changes -->
  <q-btn v-else-if="variant === 'save'" outline color="negative" icon="delete_outline"
    :aria-label="`Delete ${word}`" class="stdda__icon-btn" @click="emit('delete')">
    <q-tooltip>Delete {{ word }}</q-tooltip>
  </q-btn>

  <!-- C · overflow menu -->
  <q-btn v-else-if="variant === 'menu'" outline dense no-caps color="grey-7" icon="more_horiz"
    :aria-label="`More ${word.toLowerCase()} actions`" class="stdda__more">
    <q-menu anchor="bottom right" self="top right" :offset="[0, 6]">
      <q-list style="min-width:200px;" class="q-py-xs">
        <q-item v-close-popup clickable class="stdda__item" @click="emit('delete')">
          <q-item-section avatar class="stdda__icon"><q-icon name="delete_outline" size="20px" /></q-item-section>
          <q-item-section>Delete {{ word }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>

  <!-- D · bottom of the page -->
  <q-card v-else flat bordered class="stdda__zone">
    <q-card-section class="row items-center no-wrap q-gutter-md stdda__zone-body">
      <div class="col">
        <h2 class="stdda__h2">Delete {{ word }}</h2>
        <p class="stdda__p">
          Removes this {{ word.toLowerCase() }} from the event. Its group blocks and reservations move to Reconciliation.
        </p>
      </div>
      <q-btn outline no-caps color="negative" icon="delete_outline" :label="`Delete ${word}`" class="stdda__btn" @click="emit('delete')" />
    </q-card-section>
  </q-card>
</template>

<style scoped>
.stdda__btn { flex: none; }
.stdda__icon-btn { min-width: 40px; }
.stdda__more { min-width: 40px; min-height: 36px; border-color: var(--ds-color-border-bold); }
.stdda__item { color: var(--ds-color-text-danger, var(--q-negative)); }
.stdda__icon { min-width: 32px; color: inherit; }
.stdda__zone { margin-bottom: 20px; }
.stdda__zone-body { padding: 22px 30px; }
.stdda__h2 { margin: 0; font-size: 1.0625rem; line-height: 1.4; font-weight: 700; color: var(--ds-color-text); }
.stdda__p { margin: 4px 0 0; font-size: 0.875rem; color: var(--ds-color-text-subtle); }
</style>

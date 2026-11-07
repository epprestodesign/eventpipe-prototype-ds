<script setup>
// Team Edit — the team drill-in from Compliance, in two modes.
//
// create (STA-2 · STA-3 · STA-4 · STA-5): only the Event dropdown and the
//   Details fields. Tabs, Goals & Restrictions, Compliance Credits and Notes
//   are hidden until the first save. Cancel saves nothing. A valid Save emits
//   `created` with the new team; the parent then shows the normal Team Edit
//   with the auto-generated note.
// edit (STD-1 · STD-2 · STD-3): production's Team Edit plus "Delete Team" in
//   the header and the confirmation modal. Confirming emits `deleted`.
import { computed, inject, reactive, ref, nextTick, watch } from 'vue'
import DsAlert from '../../../../components/DsAlert.vue'
import DsSelect from '../../../../components/DsSelect.vue'
import StdTeamEditHeader from './StdTeamEditHeader.vue'
import StdEventField from './StdEventField.vue'
import StdTeamDetailsForm from './StdTeamDetailsForm.vue'
import StdDeleteTeamDialog from './StdDeleteTeamDialog.vue'
import StdNotes from './StdNotes.vue'
import { FILL_PRESETS, SAMPLE, complianceNeed, displayName, emptyTeamForm, entityWord, eventById, generatedTeamId, validateNewTeam } from '../_std'

const props = defineProps({
  mode: { type: String, default: 'edit' },
  /** edit: the team being edited */
  team: { type: Object, default: null },
  /** create: every registered team, for the uniqueness check */
  teams: { type: Array, default: () => [] },
  events: { type: Array, required: true },
  /** create: the Compliance list's event filter, if any (STA-2) */
  defaultEventId: { type: String, default: '' },
  notes: { type: Array, default: () => [] },
  /** Open with the delete modal up (review states). */
  confirmOpen: { type: Boolean, default: false },
  /** Open with the errors from an empty Save showing (review state). */
  showErrors: { type: Boolean, default: false },
})
const emit = defineEmits(['back', 'created', 'deleted'])

const isCreate = computed(() => props.mode === 'create')
const form = reactive(isCreate.value ? emptyTeamForm(props.defaultEventId) : { ...emptyTeamForm(props.team.eventId), ...props.team })
const errors = ref(isCreate.value && props.showErrors ? validateNewTeam(form, props.teams) : {})
const saving = ref(false)
const tab = ref('details')
const confirm = ref(props.confirmOpen)
const deleting = ref(false)
// Look events up in the live list (the prototype's Registered Entity switch
// changes it), falling back to the fixtures.
const evtOf = (id) => props.events.find((e) => e.id === id) || eventById(id)
const event = computed(() => evtOf(form.eventId))
// The spec swaps "Team" for "Organization" in the delete modal and log (STD-2,
// STD-4); create mode keeps the STA-1 wording, "Add single team".
const word = computed(() => (isCreate.value ? 'Team' : entityWord(evtOf(props.team.eventId))))
const errorCount = computed(() => Object.keys(errors.value).filter((k) => k !== 'org' || !errors.value.name).length)

/* Storybook-only autofill, driven by the prototype's review bar (provided as
   `stdAutofill`). Absent outside the prototype, so the screen works alone. */
const autofill = inject('stdAutofill', null)
function applyPreset(key) {
  const preset = FILL_PRESETS.find((p) => p.key === key)
  if (!preset) return
  Object.assign(form, emptyTeamForm(''), preset.values || {})
  errors.value = preset.validate ? validateNewTeam(form, props.teams) : {}
}
if (autofill) watch(() => autofill.seq, () => isCreate.value && applyPreset(autofill.preset))
/** Click to fill: an empty field gets its sample value when clicked. Filling
 *  also clears that field's error, as typing would. */
function onFocusIn(e) {
  if (!autofill?.click || !isCreate.value) return
  const key = e.target.closest?.('[data-field]')?.dataset.field
  if (!key || !(key in SAMPLE) || String(form[key] ?? '').trim()) return
  form[key] = SAMPLE[key]
  if (errors.value[key] || ((key === 'name' || key === 'org') && errors.value.name)) {
    const next = { ...errors.value }
    delete next[key]
    if (key === 'name' || key === 'org') { delete next.name; delete next.org }
    errors.value = next
  }
}

async function save() {
  errors.value = validateNewTeam(form, props.teams)
  if (Object.keys(errors.value).length) {
    await nextTick()
    document.querySelector('.stde .dsalert')?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    return
  }
  saving.value = true
  setTimeout(() => {
    saving.value = false
    emit('created', { ...form, teamId: form.teamId.trim() || generatedTeamId(form) })
  }, 600)
}
function confirmDelete() {
  deleting.value = true
  setTimeout(() => { deleting.value = false; confirm.value = false; emit('deleted', props.team) }, 700)
}
const STATUS = ['No Override', 'Compliant', 'Non-Compliant', 'Exempt', 'Local', 'Not Coming']
const statusOverride = ref('No Override')
</script>

<template>
  <div class="stde">
    <std-team-edit-header :mode="mode" :title="team ? displayName(team) : ''" :event-name="event?.name || ''"
      :word="word" v-model:tab="tab" @back="emit('back')" @delete="confirm = true" />

    <!-- CREATE MODE -->
    <q-card v-if="isCreate" flat bordered class="stde__card" :class="{ 'stde--click-fill': autofill?.click }" @focusin="onFocusIn">
      <q-card-section class="stde__section">
        <div class="row items-start q-mb-lg">
          <h2 class="stde__h2">Team / Org Information</h2>
          <q-space />
          <div class="row q-gutter-sm">
            <q-btn outline no-caps color="grey-8" label="Cancel" :disable="saving" @click="emit('back')" />
            <q-btn unelevated no-caps color="primary" :label="`Save ${word}`" :loading="saving" @click="save" />
          </div>
        </div>
        <ds-alert v-if="errorCount" severity="error" title="Check the highlighted fields" class="q-mb-lg">
          Nothing was created. Fix {{ errorCount === 1 ? 'the field' : `the ${errorCount} fields` }} below and save again.
        </ds-alert>
        <div style="max-width:408px;"><std-event-field v-model="form.eventId" data-field="eventId" :events="events" :error="errors.eventId" /></div>
        <q-separator class="q-my-lg" />
        <std-team-details-form v-model:form="form" :errors="errors" mode="create" />
      </q-card-section>
    </q-card>

    <!-- EDIT MODE (normal Team Edit) -->
    <template v-else>
      <div v-show="tab === 'details'">
        <q-card flat bordered class="stde__card">
          <q-card-section class="stde__section">
            <div class="row items-start q-mb-md">
              <h2 class="stde__h2">Goals &amp; Restrictions</h2>
              <q-space />
              <div class="row q-gutter-sm">
                <q-btn outline no-caps color="grey-8" label="Cancel" />
                <q-btn unelevated no-caps color="primary" label="Save Changes" />
              </div>
            </div>
            <div class="stde__goals">
              <div class="stde__cap">Compliance Status</div><div class="stde__cap">Calculated</div><div class="stde__cap">Override</div>
              <div /><div>{{ complianceNeed(team) }}</div><div style="max-width:170px;"><ds-select v-model="statusOverride" :options="STATUS" /></div>
              <div class="stde__cap">Compliance Goal</div><div>{{ team.goal }} Room Nights</div><div><q-input outlined dense hide-bottom-space style="width:70px;" aria-label="Compliance goal override" /></div>
            </div>
            <h2 class="stde__h2 q-mt-lg q-mb-md">Team / Org Information</h2>
            <std-team-details-form v-model:form="form" mode="edit" />
          </q-card-section>
        </q-card>
        <q-card flat bordered class="stde__card">
          <q-card-section class="stde__section">
            <h2 class="stde__h2 q-mb-md">Compliance Credits</h2>
            <q-btn outline no-caps color="primary" label="+ Add New Compliance Credit" />
          </q-card-section>
        </q-card>
        <q-card flat bordered class="stde__card">
          <q-card-section class="stde__section">
            <h2 class="stde__h2 q-mb-md">Notes</h2>
            <std-notes :notes="notes" />
          </q-card-section>
        </q-card>
      </div>
      <q-card v-show="tab === 'blocks'" flat bordered class="stde__card">
        <q-card-section class="stde__section stde__empty">
          {{ team.openBlocks ? `${team.openBlocks} open group block${team.openBlocks === 1 ? '' : 's'} linked to this ${word.toLowerCase()}.` : `No group blocks or reservations are linked to this ${word.toLowerCase()} yet.` }}
        </q-card-section>
      </q-card>
      <q-card v-show="tab === 'comms'" flat bordered class="stde__card">
        <q-card-section class="stde__section stde__empty">No communications have been sent to this {{ word.toLowerCase() }} yet.</q-card-section>
      </q-card>

      <std-delete-team-dialog v-model="confirm" :word="word" :deleting="deleting" @confirm="confirmDelete" />
    </template>
  </div>
</template>

<style scoped>
.stde { padding: 20px 28px 56px; background: var(--ds-color-surface-sunken); min-height: 100%; }
.stde__card { margin-bottom: 20px; }
.stde__section { padding: 26px 30px; }
.stde__h2 { margin: 0; font-size: 1.0625rem; line-height: 1.4; font-weight: 700; letter-spacing: normal; color: var(--ds-color-text); }
.stde__goals { display: grid; grid-template-columns: 170px 170px 1fr; gap: 8px 16px; align-items: center; max-width: 560px; }
.stde__cap { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
.stde__empty { color: var(--ds-color-text-subtle); }
/* Click to fill is on: a pointer cursor hints that fields fill on click. */
.stde--click-fill :deep([data-field] input) { cursor: copy; }
</style>

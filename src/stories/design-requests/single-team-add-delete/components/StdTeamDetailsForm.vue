<script setup>
// STA-3 · ENG2-117 + STA-4 · ENG2-118 — the Details fields (Team / Org
// Information) of Team Edit, with the uploader's validation.
//
// create — every field editable. Required: Team Name OR Organization Name,
//          plus Contact Email. Team ID is optional; left blank it is generated
//          from the names, and the field says what it will be.
// edit   — production's normal Team Edit: Team Name and Contact Name locked.
//
// Each field carries data-field="<key>" so the prototype's Click to fill can
// tell which field was clicked.
import { computed } from 'vue'
import DsField from '../../../../components/DsField.vue'
import DsInput from '../../../../components/DsInput.vue'
import DsSelect from '../../../../components/DsSelect.vue'
import { VENUES, generatedTeamId } from '../_std'

// Two-way bound with v-model:form; the parent owns the reactive form object.
const form = defineModel('form', { type: Object, required: true })
const props = defineProps({
  errors: { type: Object, default: () => ({}) },
  mode: { type: String, default: 'create' },
})
const create = computed(() => props.mode === 'create')
const idPreview = computed(() => (create.value && !form.value.teamId.trim() ? generatedTeamId(form.value) : ''))
const idHint = computed(() => {
  if (!create.value) return ''
  if (idPreview.value) return `Optional. Left blank, it will be saved as “${idPreview.value}”.`
  return 'Optional. Left blank, it’s generated from the Team Name and Organization Name.'
})
</script>

<template>
  <div class="stdf">
    <div class="stdf__grid">
      <template v-if="create">
        <ds-input v-model="form.name" data-field="name" label="Team Name" :error="errors.name" />
        <ds-input v-model="form.org" data-field="org" label="Organization Name" :error="errors.org" />
      </template>
      <template v-else>
        <ds-field label="Team Name">
          <q-input :model-value="form.name" outlined dense readonly hide-bottom-space>
            <template #append><q-icon name="lock" size="18px" color="grey-7" aria-label="Locked" /></template>
          </q-input>
        </ds-field>
        <ds-input v-model="form.org" data-field="org" label="Organization Name" />
      </template>
      <ds-input v-model="form.teamId" data-field="teamId" label="Team/Org ID" :hint="idHint" :error="errors.teamId" class="stdf__full" />
      <template v-if="create">
        <ds-input v-model="form.contactName" data-field="contactName" label="Contact Name" />
      </template>
      <ds-field v-else label="Contact Name">
        <q-input :model-value="form.contactName" outlined dense readonly hide-bottom-space>
          <template #append><q-icon name="lock" size="18px" color="grey-7" aria-label="Locked" /></template>
        </q-input>
      </ds-field>
      <ds-input v-model="form.contactEmail" data-field="contactEmail" type="email" label="Contact Email" :required="create" :error="errors.contactEmail" />
      <ds-input v-model="form.contactPhone" data-field="contactPhone" type="tel" label="Contact Phone" />
      <ds-input v-model="form.address" data-field="address" label="Team Address" class="stdf__full" />
      <ds-input v-model="form.city" data-field="city" label="Team City" />
      <div class="stdf__pair">
        <ds-input v-model="form.state" data-field="state" label="Team State/Province" />
        <ds-input v-model="form.zip" data-field="zip" label="Team Zip/Postal Code" />
      </div>
      <ds-input v-model="form.participants" data-field="participants" type="number" label="# of Team Participants" />
      <ds-input v-model="form.teamsCount" data-field="teamsCount" type="number" label="# of Teams" />
      <ds-select v-model="form.venue" data-field="venue" :options="VENUES" label="Venue" placeholder="Select a venue" class="stdf__full" />
    </div>
    <p v-if="create" class="stdf__req">Enter a Team Name, an Organization Name, or both. Contact Email is required.</p>
  </div>
</template>

<style scoped>
.stdf__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 24px; max-width: 840px; }
.stdf__full { grid-column: 1 / -1; }
.stdf__pair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.stdf__req { margin: 16px 0 0; font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
@media (max-width: 720px) { .stdf__grid { grid-template-columns: 1fr; } }
</style>

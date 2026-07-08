<script setup lang="ts">
// Phase-2 compliance-reminder config. Each field is an independent v-model so the
// parent owns the data and this stays a thin, controlled form.
import DsField from '../../components/DsField.vue'
import DsInput from '../../components/DsInput.vue'
import DsSelect from '../../components/DsSelect.vue'
import RecurrenceField from './RecurrenceField.vue'

const begin = defineModel<number>('begin', { default: 30 })
const end = defineModel<number>('end', { default: 3 })
const recurrence = defineModel<string>('recurrence', { default: '' })
const statuses = defineModel<string[]>('statuses', { default: () => [] })
const recipients = defineModel<string[]>('recipients', { default: () => [] })

const COMPLIANCE_STATUSES = ['Non-Compliant', 'At Risk', 'Compliant', 'Pending Review']
const RECIPIENTS = [
  { label: 'Team Manager', value: 'team-manager' },
  { label: 'Group Block Contacts', value: 'group-block-contacts' },
]
</script>

<template>
  <q-card flat bordered class="reminder-settings">
    <q-card-section class="reminder-settings__body">
      <div class="text-primary text-weight-medium q-mb-md">Compliance Reminder Settings</div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <ds-input v-model="begin" type="number" unit="days" label="Days until Event Start to Begin Reminders" :min="0" />
        </div>
        <div class="col-12 col-sm-6">
          <ds-input v-model="end" type="number" unit="days" label="Days until Event Start to End Reminders" :min="0" />
        </div>
      </div>

      <div class="row q-col-gutter-md q-mt-xs">
        <div class="col-12 col-sm-6"><recurrence-field v-model="recurrence" /></div>
        <div class="col-12 col-sm-6">
          <ds-select v-model="statuses" label="Compliance Statuses to Include" multiple :options="COMPLIANCE_STATUSES" />
        </div>
      </div>

      <ds-field label="Recipients" required class="q-mt-md">
        <q-option-group v-model="recipients" type="checkbox" color="primary" inline :options="RECIPIENTS" />
      </ds-field>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.reminder-settings { background: var(--ds-color-surface-sunken); }
.reminder-settings__body { padding: 24px 28px; }
</style>

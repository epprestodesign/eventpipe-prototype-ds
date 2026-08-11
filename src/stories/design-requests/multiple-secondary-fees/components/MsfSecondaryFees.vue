<script setup>
/* MsfSecondaryFees — the secondary-custom-fee editor, three slots.
 *
 * DES-451 / DES-452. Today each level (event, event hotel) has one "Secondary
 * Custom Fee" toggle with four fields under it. This renders that same control
 * three times, as three independent toggles — Secondary Custom Fee 1 / 2 / 3 —
 * so a user can turn on exactly the ones they need and the fields they already
 * know don't move.
 *
 * Two things carry the "these are three of the same thing" reading without
 * adding new controls:
 *   • each enabled slot's fields sit in an indented block with a hairline rule,
 *     so three configured fees stay scannable instead of running together;
 *   • the required * appears on a slot only once it's on — an off slot has
 *     nothing to fill in, so it shouldn't read as an unmet requirement.
 *
 * Fee objects are mutated in place (they're reactive); the parent owns the array.
 */
import DsField from '../../../../components/DsField.vue'
import DsInput from '../../../../components/DsInput.vue'
import DsSelect from '../../../../components/DsSelect.vue'
import { CHARGE_TYPES } from '../_msf'

defineProps({
  fees: { type: Array, required: true },       // [{ enabled, chargeType, amount, label, description }]
  chargeTypes: { type: Array, default: () => CHARGE_TYPES },
  // The event-hotel page words the charge types the other way round in its
  // reference capture; both levels accept the same two values.
  fieldWidth: { type: String, default: '720px' },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <div class="msf-fees">
    <div v-for="(fee, i) in fees" :key="i" class="msf-fees__slot">
      <q-toggle v-model="fee.enabled" color="primary" dense :disable="disabled" class="msf-fees__toggle">
        <span class="msf-fees__label">
          Secondary Custom Fee {{ i + 1 }}
          <span v-if="fee.enabled" class="msf-fees__req" aria-hidden="true">*</span>
        </span>
      </q-toggle>

      <div v-if="fee.enabled" class="msf-fees__body" :style="{ maxWidth: fieldWidth }">
        <div class="row items-start no-wrap q-gutter-sm">
          <DsSelect v-model="fee.chargeType" :options="chargeTypes" :disabled="disabled" style="width:250px; flex:none;" />
          <DsInput v-model="fee.amount" type="currency" :disabled="disabled" placeholder="0" style="width:190px; flex:none;" />
        </div>

        <DsInput v-model="fee.label" label="Display Label" required :disabled="disabled"
          placeholder="Shown to the guest, e.g. Resort Fee" />

        <DsField label="Description" required>
          <q-input v-model="fee.description" type="textarea" outlined dense :disable="disabled"
            rows="4" :input-style="{ minHeight: '92px' }" hide-bottom-space
            placeholder="Explains the charge wherever the fee is shown" />
        </DsField>
      </div>
    </div>
  </div>
</template>

<style scoped>
.msf-fees { display: flex; flex-direction: column; gap: 20px; }
.msf-fees__label { font-size: 0.9375rem; color: var(--ds-color-text); }
.msf-fees__req { color: var(--ds-color-text-danger); font-weight: 700; }

/* Fields belong to the toggle above them: indented to the toggle's label and
   held by a hairline rule, so three fee blocks stack without blurring. */
.msf-fees__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 12px 0 4px 12px;
  padding: 4px 0 4px 24px;
  border-left: 2px solid var(--ds-color-border);
}
</style>

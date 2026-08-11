<script setup>
/* MsfHousingPolicies — Event Hotel › Housing Company Policies, view + edit.
 *
 * DES-452. The page already has the two modes; the change is that its Fees card
 * has to hold up to three secondary custom fees instead of one, and every fee
 * saved in edit mode has to come back on the view.
 *
 * Both modes live in one component so Edit → Save → view is a real round trip:
 * what you type is what the view renders. Cancel restores the snapshot taken on
 * entering edit, so a discarded change is genuinely discarded.
 *
 * View-mode fee rows keep the shape the single fee has today — name and rate on
 * one line, label and description beneath — and repeat it per fee. Three of them
 * read as a list without needing a table or a new pattern.
 */
import { ref, reactive, computed } from 'vue'
import DsField from '../../../../components/DsField.vue'
import DsInput from '../../../../components/DsInput.vue'
import DsSelect from '../../../../components/DsSelect.vue'
import DsLink from '../../../../components/DsLink.vue'
import DsSectionHeader from '../../../../components/DsSectionHeader.vue'
import DsRichTextEditor from '../../../../components/DsRichTextEditor.vue'
import MsfSecondaryFees from './MsfSecondaryFees.vue'
import { feeRate, activeFees, RES_FEE_NOTE } from '../_msf'

const props = defineProps({
  fees: { type: Array, required: true },
  initialMode: { type: String, default: 'view' }, // view | edit
})

const mode = ref(props.initialMode)
const saved = ref(false)

/* The rest of the page — unchanged by this ticket, but it has to be here or the
 * Fees card can't be judged against the cards it sits with. */
const form = reactive({
  epFeeOn: true, epFeeType: 'Flat Fee', epFeeAmount: 0,
  addlFeeOn: true, addlFeeType: 'Flat Fee', addlFeeAmount: 0,
  waitlistOn: true, waitlistMax: 5, waitlistExpiration: 0,
  cancellationDetails: '', cancellationWindow: 'Effective Date',
})

const FEE_TYPES = ['Flat Fee', 'Percentage']
const shown = computed(() => activeFees(props.fees))

let snapshot = null
function edit() {
  snapshot = { form: JSON.parse(JSON.stringify(form)), fees: JSON.parse(JSON.stringify(props.fees)) }
  saved.value = false
  mode.value = 'edit'
}
function cancel() {
  if (snapshot) {
    Object.assign(form, snapshot.form)
    snapshot.fees.forEach((fee, i) => Object.assign(props.fees[i], fee))
  }
  mode.value = 'view'
}
function save() {
  mode.value = 'view'
  saved.value = true
  setTimeout(() => { saved.value = false }, 2600)
}
</script>

<template>
  <div style="padding:26px 32px 64px; background:var(--ds-color-surface-sunken); min-height:100%;">
    <div class="msfp" style="max-width:1080px; margin:0 auto;">

      <transition name="msfp-fade">
        <div v-if="saved" class="msfp__toast">Housing company policies updated</div>
      </transition>

      <div class="row items-center justify-between no-wrap q-mb-lg">
        <div class="text-primary" style="font-size:1.375rem; font-weight:700;">Housing Company Policies</div>
        <div class="row items-center q-gutter-sm no-wrap" style="flex:none;">
          <q-btn v-if="mode === 'view'" unelevated no-caps color="primary" label="Edit" @click="edit" />
          <template v-else>
            <q-btn outline no-caps color="primary" label="Cancel" @click="cancel" />
            <q-btn unelevated no-caps color="primary" label="Save" @click="save" />
          </template>
        </div>
      </div>

      <!-- ============================ FEES ============================ -->
      <q-card flat bordered class="q-mb-lg">
        <div style="padding:24px 28px 28px;">
          <DsSectionHeader title="Fees" variant="accent" class="q-mb-md" />

          <!-- View -->
          <template v-if="mode === 'view'">
            <div class="msfp__row">
              <span class="msfp__row-label">EventPipe Reservation Fee</span>
              <span class="msfp__row-value">${{ Number(form.epFeeAmount).toFixed(2) }} per reservation</span>
            </div>
            <div class="msfp__row">
              <span class="msfp__row-label">Additional Reservation Fee</span>
              <span class="msfp__row-value">${{ Number(form.addlFeeAmount).toFixed(2) }} per reservation</span>
            </div>
            <div class="msfp__note">{{ RES_FEE_NOTE.replace('* ', '') }}</div>

            <q-separator class="q-my-md" />

            <div v-if="!shown.length" class="msfp__empty">No secondary custom fees configured</div>
            <div v-for="fee in shown" :key="fee.slot" class="msfp__fee">
              <div class="msfp__row">
                <span class="msfp__row-label">Secondary Custom Fee {{ fee.slot }}</span>
                <span class="msfp__row-value">{{ feeRate(fee) }}</span>
              </div>
              <div class="msfp__fee-detail">{{ fee.name }}</div>
              <div class="msfp__fee-detail">{{ fee.description }}</div>
            </div>
          </template>

          <!-- Edit -->
          <template v-else>
            <div class="column q-gutter-y-md">
              <div>
                <q-toggle v-model="form.epFeeOn" color="primary" dense>
                  <span class="msfp__toggle-label">EventPipe Reservation Fee <span class="msfp__req">*</span></span>
                </q-toggle>
                <div v-if="form.epFeeOn" class="row items-start no-wrap q-gutter-sm" style="margin-top:10px;">
                  <DsSelect v-model="form.epFeeType" :options="FEE_TYPES" style="width:250px; flex:none;" />
                  <DsInput v-model="form.epFeeAmount" type="currency" style="width:250px; flex:none;" />
                </div>
              </div>

              <div>
                <q-toggle v-model="form.addlFeeOn" color="primary" dense>
                  <span class="msfp__toggle-label">Additional Reservation Fee <span class="msfp__req">*</span></span>
                </q-toggle>
                <div v-if="form.addlFeeOn" class="row items-start no-wrap q-gutter-sm" style="margin-top:10px;">
                  <DsSelect v-model="form.addlFeeType" :options="FEE_TYPES" style="width:250px; flex:none;" />
                  <DsInput v-model="form.addlFeeAmount" type="currency" style="width:250px; flex:none;" />
                </div>
              </div>

              <div class="msfp__note">{{ RES_FEE_NOTE }}</div>

              <MsfSecondaryFees :fees="fees" />
            </div>
          </template>
        </div>
      </q-card>

      <!-- ========================== WAITLIST =========================== -->
      <q-card flat bordered class="q-mb-lg">
        <div style="padding:24px 28px 28px;">
          <template v-if="mode === 'view'">
            <DsSectionHeader title="Waitlist" variant="accent" class="q-mb-md" />
            <div class="msfp__row">
              <span class="msfp__row-label">Waitlist Max</span>
              <span class="msfp__row-value">{{ form.waitlistMax }} reservations per night</span>
            </div>
            <div class="msfp__row">
              <span class="msfp__row-label">Waitlist Expiration Date</span>
              <span class="msfp__row-value">Sat, 09/05/2026</span>
            </div>
            <div class="msfp__fee-detail">{{ form.waitlistExpiration }} days from hotel cutoff (Sat, 09/05/2026)</div>
          </template>
          <template v-else>
            <q-toggle v-model="form.waitlistOn" color="primary" dense>
              <span class="text-primary" style="font-size:1.125rem; font-weight:500;">Waitlist</span>
            </q-toggle>
            <div v-if="form.waitlistOn" class="column q-gutter-y-md" style="margin-top:14px; max-width:340px;">
              <DsInput label="Waitlist Max" v-model="form.waitlistMax" type="number"
                tooltip="Maximum reservations per night on the waitlist." />
              <DsInput label="Waitlist Expiration" v-model="form.waitlistExpiration" type="number"
                tooltip="Days prior to the hotel cut-off date." />
            </div>
          </template>
        </div>
      </q-card>

      <!-- ======================== CANCELLATION ========================= -->
      <q-card flat bordered>
        <div style="padding:24px 28px 28px;">
          <DsSectionHeader title="Cancellation" variant="accent" class="q-mb-md" />
          <template v-if="mode === 'view'">
            <div class="msfp__sub">Cancellation Policy Details</div>
            <div class="msfp__empty q-mb-lg">None configured</div>
            <div class="msfp__sub">Tiers</div>
            <div class="msfp__empty">None configured</div>
          </template>
          <template v-else>
            <div class="column q-gutter-y-md">
              <DsLink href="https://learn.eventpipe.com/eventpipe-knowledge-base/cancellation-refund-policies" external>
                How To Configure Cancellation &amp; Refund Policies
              </DsLink>
              <DsRichTextEditor label="Cancellation Policy Details" v-model="form.cancellationDetails"
                min-height="200px" layout="description" />
              <DsField label="Cancellation Window" required>
                <q-option-group v-model="form.cancellationWindow" color="primary" type="radio"
                  :options="[{ label: 'Effective Date', value: 'Effective Date' }, { label: 'Effective Days Prior to Check-in', value: 'Effective Days Prior to Check-in' }]" />
              </DsField>
              <div>
                <DsSectionHeader title="Tiers" variant="section" />
                <div class="msfp__empty">None configured</div>
                <q-btn outline no-caps color="primary" icon="add" label="New Tier" class="q-mt-md" />
              </div>
            </div>
          </template>
        </div>
      </q-card>
    </div>
  </div>
</template>

<style scoped>
.msfp__row { display: flex; align-items: baseline; justify-content: space-between; gap: 32px; padding: 4px 0; }
.msfp__row-label { color: var(--ds-color-text-subtle); font-size: 0.9375rem; }
.msfp__row-value { color: var(--ds-color-text); font-size: 0.9375rem; }
.msfp__fee { padding: 10px 0; }
.msfp__fee + .msfp__fee { border-top: 1px solid var(--ds-color-border); }
.msfp__fee-detail { color: var(--ds-color-text-subtle); font-size: 0.875rem; padding-left: 18px; line-height: 1.5; }
.msfp__note { color: var(--ds-color-text-subtle); font-size: 0.8125rem; line-height: 1.5; margin-top: 10px; max-width: 640px; }
.msfp__sub { color: var(--ds-color-text-subtle); font-size: 0.9375rem; margin-bottom: 6px; }
.msfp__empty {
  border: 1px solid var(--ds-color-border-container); border-radius: var(--ds-radius-md);
  padding: 20px; text-align: center; color: var(--ds-color-text-subtle);
}
.msfp__toggle-label { font-size: 0.9375rem; color: var(--ds-color-text); }
.msfp__req { color: var(--ds-color-text-danger); font-weight: 700; }

.msfp__toast {
  position: sticky; top: 12px; z-index: 5; width: fit-content; margin: 0 auto 14px;
  background: var(--ds-color-background-success-bold, #21ba45); color: #fff; font-weight: 600;
  padding: 10px 22px; border-radius: var(--ds-radius-md); box-shadow: var(--ds-shadow-card);
}
.msfp-fade-enter-active, .msfp-fade-leave-active { transition: opacity var(--ds-duration-fast, 150ms) ease; }
.msfp-fade-enter-from, .msfp-fade-leave-to { opacity: 0; }
</style>

<script setup>
/* Av2SecurityPage — AccountSecurityView (`/account/security`), ENG-3024.
 *
 * The body that sits inside the admin app shell (pages/_shell.js page()). It is
 * a logged-in page, so it follows the product-screen conventions of Teams Mgmt
 * Comms Phase 2 — a title card, then `q-card flat bordered` sections, tables in
 * `q-table.ds-table` — not the centred auth card.
 *
 * Three cards, in the order people come here for them:
 *   1. Password — change it (current, new, confirm). Success signs out every
 *      other session and says so.
 *   2. Two-factor authentication — launch: "Email code — on", no action.
 *      ENG-3033 attaches authenticator setup here later (Av2SecurityTwoFactor).
 *   3. Trusted devices — revoke one or all, each behind a confirm.
 *
 * One component rather than markup in each story, because the same page is the
 * backdrop for the launch stories AND the Later (ENG-3033) setup and recovery
 * code stories, and they must not drift apart.
 */
import { computed, ref } from 'vue'
import DsPageHeader from '../../../components/DsPageHeader.vue'
import DsInput from '../../../components/DsInput.vue'
import DsNotification from '../../../components/DsNotification.vue'
import DsConfirmDialog from '../../../components/DsConfirmDialog.vue'
import DsEmptyState from '../../../components/DsEmptyState.vue'
import Av2SetPwStrength, { MIN_LENGTH } from './Av2SetPwStrength.vue'
import Av2SecurityDevices, { TRUSTED_DEVICES, describeUserAgent } from './Av2SecurityDevices.vue'
import Av2SecurityTwoFactor from './Av2SecurityTwoFactor.vue'

const props = defineProps({
  account: { type: Object, required: true },
  devices: { type: Array, default: () => TRUSTED_DEVICES },
  /** Show the post-change success notice (other sessions signed out). */
  passwordChanged: { type: Boolean, default: false },
  /** Show the wrong-current-password error, with the form filled. */
  pwError: { type: Boolean, default: false },
  /** Open a confirm on load: '' | 'revoke' | 'revoke-all'. */
  confirm: { type: String, default: '' },
  /** Device the 'revoke' confirm targets. */
  revokeId: { type: String, default: 'dev-3' },
  /** Two-factor card state — see Av2SecurityTwoFactor. */
  totp: { type: String, default: 'launch' },
  recoveryRemaining: { type: Number, default: 10 },
  recoveryLastUsed: { type: String, default: '' },
})
defineEmits(['setup', 'regenerate'])

/* --- Change password ---------------------------------------------------- */
const current = ref(props.pwError ? 'correct-horse-staple' : '')
const pw1 = ref(props.pwError ? 'Harbour-lantern-quietly-7' : '')
const pw2 = ref(props.pwError ? 'Harbour-lantern-quietly-7' : '')
const currentError = computed(() =>
  props.pwError && current.value === 'correct-horse-staple'
    ? 'That isn’t your current password.'
    : '')
const mismatch = computed(() =>
  !!pw2.value && pw2.value.length >= pw1.value.length && pw1.value !== pw2.value)
const ready = computed(() =>
  !!current.value && pw1.value.length >= MIN_LENGTH && pw1.value === pw2.value)

/* --- Trusted devices ---------------------------------------------------- */
const list = ref([...props.devices])
const revokeOpen = ref(props.confirm === 'revoke')
const revokeAllOpen = ref(props.confirm === 'revoke-all')
const target = ref(props.devices.find((d) => d.id === props.revokeId) || props.devices[0] || null)
const targetLabel = computed(() => (target.value ? describeUserAgent(target.value.ua).label : ''))

function askRevoke (row) { target.value = row; revokeOpen.value = true }
function doRevoke () { list.value = list.value.filter((d) => d.id !== target.value?.id) }
function doRevokeAll () { list.value = [] }
</script>

<template>
  <div class="av2sec">
    <q-card flat bordered class="av2sec__card">
      <q-card-section class="av2sec__head">
        <ds-page-header title="Account security" />
        <div class="av2sec__meta">
          {{ account.name }} · {{ account.email }}
        </div>
      </q-card-section>
    </q-card>

    <!-- Page-level notices: the password-changed confirmation, and whatever a
         caller adds (the Later stories put the authenticator-on notice here). -->
    <ds-notification v-if="passwordChanged" variant="success" flat :closable="false"
      class="av2sec__notice" title="Your password has been changed"
      description="We signed you out of every other browser and device. Anyone signed in elsewhere will need your new password." />
    <slot name="notice" />

    <!-- 1 · Password -------------------------------------------------------->
    <q-card flat bordered class="av2sec__card">
      <q-card-section class="av2sec__body">
        <h2 class="av2sec__h2">Password</h2>
        <p class="av2sec__caption">
          Last changed {{ passwordChanged ? 'today' : 'Aug 14, 2026' }}. Changing it signs you out
          everywhere else.
        </p>

        <q-form class="av2sec__form" @submit.prevent>
          <ds-input label="Current password" type="password" v-model="current" :error="currentError" />
          <div>
            <ds-input label="New password" type="password" v-model="pw1" />
            <av2-set-pw-strength :password="pw1" />
          </div>
          <ds-input label="Confirm new password" type="password" v-model="pw2"
            :error="mismatch ? 'These passwords don’t match.' : ''" />
          <div>
            <q-btn type="submit" unelevated no-caps color="primary" label="Change password"
              :disable="!ready" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- 2 · Two-factor ------------------------------------------------------>
    <q-card flat bordered class="av2sec__card">
      <q-card-section class="av2sec__body">
        <h2 class="av2sec__h2">Two-factor authentication</h2>
        <av2-security-two-factor :totp="totp" :email-masked="account.emailMasked"
          :recovery-remaining="recoveryRemaining" :recovery-last-used="recoveryLastUsed"
          @setup="$emit('setup')" @regenerate="$emit('regenerate')" />
      </q-card-section>
    </q-card>

    <!-- 3 · Trusted devices ------------------------------------------------->
    <q-card flat bordered class="av2sec__card">
      <q-card-section class="av2sec__body">
        <div class="row items-start no-wrap">
          <div>
            <h2 class="av2sec__h2">Trusted devices</h2>
            <p class="av2sec__caption">
              Devices where you ticked “Trust this device” after entering a code. They skip the code
              for 30 days. Revoke one and the next sign-in from it will ask for a code again.
            </p>
          </div>
          <q-space />
          <q-btn v-if="list.length" outline no-caps color="negative" label="Revoke all"
            @click="revokeAllOpen = true" />
        </div>

        <av2-security-devices v-if="list.length" :devices="list" @revoke="askRevoke" />
        <div v-else class="av2sec__empty">
          <ds-empty-state icon="devices" title="No trusted devices"
            description="Every sign-in will ask for a code. Tick “Trust this device for 30 days” on the code step to skip it on a computer you use often." />
        </div>
      </q-card-section>
    </q-card>

    <ds-confirm-dialog v-model="revokeOpen" destructive
      :title="'Revoke ' + targetLabel + (target && target.current ? ' (this device)' : '') + '?'"
      confirm-label="Revoke device" cancel-label="Keep it" @confirm="doRevoke">
      <template #body>
        <template v-if="target && target.current">
          This is the device you're using now. The next time you sign in here, we'll ask for a
          code.
        </template>
        <template v-else>
          The next time anyone signs in from this device, we'll ask for a code sent to
          {{ account.emailMasked }}. Last used {{ target ? target.lastUsed : '' }}.
        </template>
      </template>
    </ds-confirm-dialog>

    <ds-confirm-dialog v-model="revokeAllOpen" destructive
      :title="'Revoke all ' + list.length + ' trusted devices?'"
      confirm-label="Revoke all" cancel-label="Cancel" @confirm="doRevokeAll">
      <template #body>
        Every device, including this one, will ask for a code the next time it signs in.
      </template>
    </ds-confirm-dialog>
  </div>
</template>

<style scoped>
.av2sec { padding: 20px 28px 56px; background: var(--ds-color-surface-sunken); min-height: 100%; }
.av2sec__card { margin-bottom: 20px; }
.av2sec__head { padding: 22px 30px; }
.av2sec__meta { margin-top: 6px; font-size: 0.9375rem; color: var(--ds-color-text-subtle); }
.av2sec .av2sec__notice { max-width: none; margin-bottom: 20px; }
.av2sec__body { padding: 26px 30px; }
.av2sec__h2 { margin: 0 0 6px; font-size: 1.0625rem; font-weight: 700; line-height: 1.4; color: var(--ds-color-text); }
.av2sec__caption { margin: 0 0 18px; max-width: 640px; font-size: 0.875rem; line-height: 1.5; color: var(--ds-color-text-subtle); }
.av2sec__form { display: flex; flex-direction: column; gap: 16px; max-width: 400px; }
.av2sec__empty { border: 1px solid var(--ds-color-border-container); border-radius: var(--ds-radius-md); }
</style>

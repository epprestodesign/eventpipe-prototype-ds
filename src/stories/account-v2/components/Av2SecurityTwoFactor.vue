<script setup>
/* Av2SecurityTwoFactor — the "Two-factor authentication" card on Account
 * Security.
 *
 * At launch (ENG-3024) it is a statement, not a control: the only factor is an
 * emailed code, it is on, and there is nothing to set up — the spec has no
 * enrollment at launch. The card exists anyway because it is where ENG-3033's
 * authenticator-app setup attaches later, and a user who wonders "where do my
 * codes go?" should find the answer here.
 *
 *   totp="launch"    — email code only, no actions (ENG-3024, launch)
 *   totp="available" — adds an Authenticator app row with a setup button (ENG-3033, later)
 *   totp="on"        — authenticator app on, plus the recovery-codes row (ENG-3033, later)
 */
import DsStatus from '../../../components/DsStatus.vue'

defineProps({
  totp: { type: String, default: 'launch' },
  emailMasked: { type: String, required: true },
  recoveryTotal: { type: Number, default: 10 },
  recoveryRemaining: { type: Number, default: 10 },
  recoveryLastUsed: { type: String, default: '' },
})
defineEmits(['setup', 'regenerate'])
</script>

<template>
  <div>
    <p class="av2tf__intro">
      We ask for a code when you sign in from a device you haven't trusted.
    </p>

    <ul class="av2tf__list">
      <li class="av2tf__row">
        <q-icon name="mail_outline" size="22px" class="av2tf__icon" />
        <div class="av2tf__main">
          <div class="av2tf__name">
            Email code
            <ds-status v-if="totp === 'on'" label="Backup" tone="neutral" variant="pill" />
            <ds-status v-else label="On" tone="success" variant="pill" />
          </div>
          <div class="av2tf__desc">
            Codes go to <strong>{{ emailMasked }}</strong>.
            <!-- Assumption, flagged in the Later docs: ENG-3033 doesn't say
                 what happens to the email factor once an app is added. Shown as
                 the "try another way" fallback, matching the Later challenge. -->
            <template v-if="totp === 'on'">Used only if you choose another way to sign in.</template>
          </div>
        </div>
      </li>

      <li v-if="totp !== 'launch'" class="av2tf__row">
        <q-icon name="phonelink_lock" size="22px" class="av2tf__icon" />
        <div class="av2tf__main">
          <div class="av2tf__name">
            Authenticator app
            <ds-status v-if="totp === 'on'" label="On" tone="success" variant="pill" />
            <ds-status v-else label="Not set up" tone="neutral" variant="pill" />
          </div>
          <div v-if="totp === 'on'" class="av2tf__desc">
            Added Sep 29, 2026. We'll ask for a code from your app instead of emailing one.
          </div>
          <div v-else class="av2tf__desc">
            Get codes from an app like 1Password or Google Authenticator instead of waiting for an email.
          </div>
        </div>
        <q-btn v-if="totp === 'available'" outline no-caps color="primary"
          label="Set up authenticator app" class="av2tf__action" @click="$emit('setup')" />
      </li>

      <li v-if="totp === 'on'" class="av2tf__row">
        <q-icon name="password" size="22px" class="av2tf__icon" />
        <div class="av2tf__main">
          <div class="av2tf__name">
            Recovery codes
            <ds-status :label="recoveryRemaining + ' of ' + recoveryTotal + ' left'"
              :tone="recoveryRemaining <= 3 ? 'warning' : 'neutral'" variant="pill" />
          </div>
          <!-- Spent codes read as hollow, not missing: an empty slot is
               obviously a used one. -->
          <div class="av2tf__pips" aria-hidden="true">
            <span v-for="n in recoveryTotal" :key="n" class="av2tf__pip"
              :class="{ 'av2tf__pip--used': n > recoveryRemaining }" />
          </div>
          <div class="av2tf__desc">
            Single-use backups for when your phone isn't to hand.
            <template v-if="recoveryLastUsed">
              Last used <strong>{{ recoveryLastUsed }}</strong> — if that wasn't you, generate a new
              set and change your password.
            </template>
          </div>
        </div>
        <q-btn outline no-caps color="primary" label="Generate new codes" class="av2tf__action"
          @click="$emit('regenerate')" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.av2tf__intro { margin: -6px 0 14px; font-size: 0.875rem; color: var(--ds-color-text-subtle); }
.av2tf__list {
  list-style: none; margin: 0; padding: 0;
  border: 1px solid var(--ds-color-border-container); border-radius: var(--ds-radius-md);
}
.av2tf__row { display: flex; align-items: flex-start; gap: 14px; padding: 16px 18px; }
.av2tf__row + .av2tf__row { border-top: 1px solid var(--ds-color-border-container); }
.av2tf__icon { flex: none; margin-top: 1px; color: var(--ds-color-text-subtle); }
.av2tf__main { flex: 1; min-width: 0; }
.av2tf__name { display: flex; align-items: center; gap: 10px; font-weight: 700; color: var(--ds-color-text); }
.av2tf__desc { margin-top: 4px; font-size: 0.875rem; line-height: 1.5; color: var(--ds-color-text-subtle); }
.av2tf__action { flex: none; align-self: center; }
.av2tf__pips { display: flex; gap: 5px; max-width: 280px; margin-top: 10px; }
.av2tf__pip { flex: 1; height: 6px; border-radius: var(--ds-radius-sm); background: var(--ds-color-background-brand-bold); }
.av2tf__pip--used { background: transparent; border: 1px solid var(--ds-color-border-bold); }
</style>

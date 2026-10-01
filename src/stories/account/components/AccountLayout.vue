<script setup>
import logo from '../../../assets/logo/eventpipe-logo-fff.svg'
import AccountUpdates from './AccountUpdates.vue'
import '../account.css'
defineProps({ update: { type: Object, default: null } })
</script>

<template>
  <main class="ep-authx acct acct-refined">
    <aside class="ep-authx__brand acct__brand acct-refined__brand" aria-label="EventPipe">
      <img :src="logo" alt="EventPipe" class="acct__logo" />
      <slot name="updates">
        <account-updates v-if="update" v-bind="update" class="acct-refined__update" />
      </slot>
    </aside>
    <div class="ep-authx__form acct__form">
      <div class="acct__content acct-refined__content"><slot /></div>
    </div>
  </main>
</template>

<style scoped>
.acct-refined__brand { gap: var(--ds-space-6); }
.acct-refined__content { max-width: 440px; }
.acct-refined__update { width: 70%; max-width: 480px; }
@media (max-width: 900px) {
  .acct-refined { flex-direction: column-reverse; }
  .acct-refined__brand { display: flex; flex: none; padding: var(--ds-space-6) var(--ds-space-5); }
  .acct-refined__brand .acct__logo { width: 180px; }
  .acct-refined__update { width: 100%; }
  .acct-refined .acct__form { flex: 1; }
}
</style>

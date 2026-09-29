<script setup>
import logo from '../../../assets/logo/eventpipe-logo-fff.svg'
import AccountV1Updates from './AccountV1Updates.vue'
import '../account-v1.css'
defineProps({ update: { type: Object, default: null } })
</script>

<template>
  <main class="ep-authx account-v1 av1-refined">
    <aside class="ep-authx__brand account-v1__brand av1-refined__brand" aria-label="EventPipe">
      <img :src="logo" alt="EventPipe" class="account-v1__logo" />
      <slot name="updates">
        <account-v1-updates v-if="update" v-bind="update" class="av1-refined__update" />
      </slot>
    </aside>
    <div class="ep-authx__form account-v1__form">
      <div class="account-v1__content av1-refined__content"><slot /></div>
    </div>
  </main>
</template>

<style scoped>
.av1-refined__brand { gap: var(--ds-space-6); }
.av1-refined__content { max-width: 440px; }
.av1-refined__update { width: 70%; max-width: 480px; }
@media (max-width: 900px) {
  .av1-refined { flex-direction: column-reverse; }
  .av1-refined__brand { display: flex; flex: none; padding: var(--ds-space-6) var(--ds-space-5); }
  .av1-refined__brand .account-v1__logo { width: 180px; }
  .av1-refined__update { width: 100%; }
  .av1-refined .account-v1__form { flex: 1; }
}
</style>

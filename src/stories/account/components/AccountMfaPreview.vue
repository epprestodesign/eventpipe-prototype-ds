<script setup>
// Storybook-only review controls. Never part of the customer login screen.
import { computed, ref } from 'vue'
import AccountLayout from './AccountLayout.vue'
import AccountCredentials from './AccountCredentials.vue'
import AccountVerification from './AccountVerification.vue'

const props = defineProps({
  states: { type: Array, required: true },
  initialMethod: { type: String, default: 'authenticator' },
  fullFlow: { type: Boolean, default: false },
})
const selected = ref(props.states[0].value)
const revision = ref(0)
const atLogin = ref(props.fullFlow)
const active = computed(() => props.states.find(state => state.value === selected.value) || props.states[0])
const verificationProps = computed(() => ({ initialMethod: props.initialMethod, ...active.value.props }))
function restart() {
  atLogin.value = props.fullFlow && !active.value.props?.initialMethod
  revision.value++
}
</script>

<template>
  <div class="acct-milestone">
    <aside class="acct-milestone__tools bg-ds-neutral-subtle" aria-label="Storybook preview controls">
      <span class="text-weight-bold">Preview only</span>
      <q-select v-model="selected" :options="states" option-label="label" option-value="value" emit-value map-options
        outlined dense options-dense label="Preview state" class="acct-milestone__select" @update:model-value="restart" />
      <q-btn flat no-caps color="primary" label="Restart preview" @click="restart" />
    </aside>
    <account-layout :key="revision">
      <account-credentials v-if="atLogin" demo-prefill @authenticated="atLogin = false" />
      <account-verification v-else v-bind="verificationProps" @back="atLogin = true" />
    </account-layout>
  </div>
</template>

<style scoped>
.acct-milestone { display: flex; flex-direction: column; min-height: 100vh; }
.acct-milestone__tools { display: flex; align-items: center; flex-wrap: wrap; gap: var(--ds-space-4); padding: var(--ds-space-3) var(--ds-space-5); border-bottom: 1px solid var(--ds-color-border); }
.acct-milestone__select { width: 260px; max-width: 100%; }
.acct-milestone > .ep-authx { flex: 1; min-height: 0; }
</style>

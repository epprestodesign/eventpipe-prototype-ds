<script setup>
// Storybook-only review controls. Never part of the customer login screen.
import { computed, ref } from 'vue'
import AccountV1Layout from './AccountV1Layout.vue'
import AccountV1Credentials from './AccountV1Credentials.vue'
import AccountV1Verification from './AccountV1Verification.vue'

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
  <div class="av1-milestone">
    <aside class="av1-milestone__tools bg-ds-neutral-subtle" aria-label="Storybook preview controls">
      <span class="text-weight-bold">Preview only</span>
      <q-select v-model="selected" :options="states" option-label="label" option-value="value" emit-value map-options
        outlined dense options-dense label="Preview state" class="av1-milestone__select" @update:model-value="restart" />
      <q-btn flat no-caps color="primary" label="Restart preview" @click="restart" />
    </aside>
    <account-v1-layout :key="revision">
      <account-v1-credentials v-if="atLogin" demo-prefill @authenticated="atLogin = false" />
      <account-v1-verification v-else v-bind="verificationProps" @back="atLogin = true" />
    </account-v1-layout>
  </div>
</template>

<style scoped>
.av1-milestone { display: flex; flex-direction: column; min-height: 100vh; }
.av1-milestone__tools { display: flex; align-items: center; flex-wrap: wrap; gap: var(--ds-space-4); padding: var(--ds-space-3) var(--ds-space-5); border-bottom: 1px solid var(--ds-color-border); }
.av1-milestone__select { width: 260px; max-width: 100%; }
.av1-milestone > .ep-authx { flex: 1; min-height: 0; }
</style>

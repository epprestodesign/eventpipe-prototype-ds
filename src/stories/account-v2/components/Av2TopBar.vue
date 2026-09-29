<script setup>
/* Av2TopBar — the top of the auth panel: the EventPipe wordmark left, "Get
 * support" right. The wordmark is Av2Brand — the real logo from src/assets,
 * never a mark drawn here — and it lives here, once, instead of at the top of
 * every step's markup.
 */
import Av2Brand from './Av2Brand.vue'

defineEmits(['support'])
</script>

<template>
  <header class="av2tb">
    <Av2Brand />
    <q-btn outline no-caps color="primary" icon="help_outline" label="Get support"
      class="av2tb__support" aria-haspopup="dialog" @click="$emit('support')" />
  </header>
</template>

<style scoped>
.av2tb {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 72px;
  flex: none;
}
.av2tb__support { font-weight: 600; }
</style>

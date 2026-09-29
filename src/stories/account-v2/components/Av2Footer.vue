<script setup>
/* Av2Footer — the bottom of the auth panel: "Terms and Conditions" left,
 * "EventPipe © 2026" right. */
</script>

<template>
  <footer class="av2ft">
    <a href="#" class="av2ft__link">Terms and Conditions</a>
    <span>EventPipe © 2026</span>
  </footer>
</template>

<style scoped>
.av2ft {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  height: 56px; flex: none;
  font-size: 0.8125rem; color: var(--ds-color-text-subtle);
}
.av2ft__link { color: var(--ds-color-text-subtle); text-decoration: none; }
.av2ft__link:hover { color: var(--ds-color-link); text-decoration: underline; }
</style>

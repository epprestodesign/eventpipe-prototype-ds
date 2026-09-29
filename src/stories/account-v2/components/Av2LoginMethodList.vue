<script setup>
/* Av2LoginMethodList — the "Try another way" chooser on the authenticator-app
 * challenge (Later · ENG-3033). Not used at launch: the launch factor is the
 * emailed code and there is nothing else to choose between.
 *
 * Rows commit on click, with a chevron, rather than radio-plus-Continue: the
 * user is only here because the method they tried did not work, and a
 * select-then-confirm pair adds a click to the unhappiest path in the flow.
 * The shape is borrowed from Attio's workspace picker — bordered row, icon,
 * name over detail, chevron right.
 *
 * The weakest method carries its own badge. The reference enrolment flow ranks
 * methods and warns on SMS explicitly (SIM swap, unencrypted transport), and a
 * staff login should not present a SIM-swappable factor as the equal of a
 * security key just because both happen to be enrolled. (Nothing in the current
 * scope sets `weak`; the badge is kept for when a weaker factor is added.)
 */
defineProps({
  /** [{ key, icon, label, detail, current?, weak? }] in rank order. */
  methods: { type: Array, required: true },
})
</script>

<template>
  <ul class="av2lml">
    <li v-for="m in methods" :key="m.key">
      <button type="button" class="av2lml__row">
        <q-icon :name="m.icon" size="22px" class="av2lml__icon" />
        <span class="av2lml__body">
          <span class="av2lml__name">
            {{ m.label }}
            <span v-if="m.current" class="av2lml__tag">Current</span>
            <span v-else-if="m.weak" class="av2lml__tag av2lml__tag--weak">Least secure</span>
          </span>
          <span class="av2lml__detail">{{ m.detail }}</span>
        </span>
        <q-icon name="chevron_right" size="20px" class="av2lml__chev" />
      </button>
    </li>
  </ul>
</template>

<style scoped>
.av2lml { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }

.av2lml__row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 14px 14px 16px;
  background: var(--ds-color-surface);
  border: 1px solid var(--ds-color-border-container);
  border-radius: var(--ds-radius-md);
  cursor: pointer;
  text-align: left;
  font: inherit;
}
.av2lml__row:hover { border-color: var(--ds-color-border-brand); background: var(--ds-color-surface-sunken); }
.av2lml__row:focus-visible { outline: 2px solid var(--ds-color-border-focused); outline-offset: 2px; }

.av2lml__icon { flex: none; color: var(--ds-color-text-brand); }
.av2lml__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }

.av2lml__name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ds-color-text);
}
.av2lml__detail { font-size: 0.8125rem; line-height: 1.4; color: var(--ds-color-text-subtle); }

.av2lml__tag {
  flex: none;
  padding: 1px 7px;
  border-radius: var(--ds-radius-pill);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--ds-color-text-subtle);
  background: var(--ds-color-surface-sunken);
  border: 1px solid var(--ds-color-border);
}
.av2lml__tag--weak {
  color: var(--ds-color-text-danger);
  background: var(--ds-color-background-danger);
  border-color: var(--ds-color-background-danger-bold);
}

.av2lml__chev { flex: none; color: var(--ds-color-icon-subtle); }
</style>

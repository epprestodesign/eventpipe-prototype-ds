<script>
/* Fixtures live with the component that renders them so every story that shows
 * the Account Security page — launch (ENG-3024) and Later (ENG-3033) — shows
 * the same three devices. Dates are fixed; today is 2026-09-29. */
export const TRUSTED_DEVICES = [
  {
    id: 'dev-1',
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    created: 'Sep 15, 2026',
    lastUsed: 'Today, 8:42 AM',
    current: true,
  },
  {
    id: 'dev-2',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    created: 'Sep 8, 2026',
    lastUsed: 'Sep 26, 2026',
    current: false,
  },
  {
    id: 'dev-3',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
    created: 'Sep 2, 2026',
    lastUsed: 'Sep 4, 2026',
    current: false,
  },
]

/* The backend stores the raw user-agent string (ENG-3024 says "user agent").
 * Nobody recognises their laptop from a UA string, so the table leads with a
 * readable "Browser on OS" and keeps the raw string underneath for the person
 * who wants to check. Order matters: Edge and Chrome both claim Safari, and
 * Edge also claims Chrome. */
export function describeUserAgent (ua = '') {
  const browser =
    /Edg\//.test(ua) ? 'Edge'
      : /Firefox\//.test(ua) ? 'Firefox'
        : /Chrome\//.test(ua) ? 'Chrome'
          : /Safari\//.test(ua) ? 'Safari'
            : 'Unknown browser'
  const os =
    /iPhone/.test(ua) ? 'iPhone'
      : /iPad/.test(ua) ? 'iPad'
        : /Android/.test(ua) ? 'Android'
          : /Mac OS X/.test(ua) ? 'macOS'
            : /Windows/.test(ua) ? 'Windows'
              : /Linux/.test(ua) ? 'Linux'
                : 'an unknown system'
  const icon = /iPhone|Android/.test(ua) ? 'smartphone' : /iPad/.test(ua) ? 'tablet_mac' : 'computer'
  return { label: `${browser} on ${os}`, icon }
}
</script>

<script setup>
/* Av2SecurityDevices — the Trusted devices table on Account Security (ENG-3024).
 *
 * A device lands here when its owner ticks "Trust this device for 30 days" on
 * the code step (ENG-3037). Columns are the three the ticket names — user
 * agent, created, last used — plus the revoke action. The device the user is
 * on now is marked, because revoking it is the one revoke with an effect they
 * will feel on their next sign-in.
 */
import { computed } from 'vue'

const props = defineProps({
  devices: { type: Array, default: () => TRUSTED_DEVICES },
})
defineEmits(['revoke'])

const rows = computed(() => props.devices.map((d) => ({ ...d, ...describeUserAgent(d.ua) })))

const columns = [
  { name: 'device', label: 'Device', field: 'label', align: 'left' },
  { name: 'created', label: 'Trusted since', field: 'created', align: 'left' },
  { name: 'lastUsed', label: 'Last used', field: 'lastUsed', align: 'left' },
  { name: 'actions', label: '', field: 'id', align: 'right' },
]
</script>

<template>
  <q-table class="ds-table" :rows="rows" :columns="columns" row-key="id"
    flat bordered hide-bottom :pagination="{ rowsPerPage: 0 }">
    <template #body-cell-device="p">
      <q-td :props="p">
        <div class="av2dev">
          <q-icon :name="p.row.icon" size="22px" class="av2dev__icon" />
          <div class="av2dev__text">
            <div class="av2dev__name">
              {{ p.row.label }}
              <q-badge v-if="p.row.current" rounded color="primary" class="av2dev__this">This device</q-badge>
            </div>
            <div class="av2dev__ua" :title="p.row.ua">{{ p.row.ua }}</div>
          </div>
        </div>
      </q-td>
    </template>
    <template #body-cell-actions="p">
      <q-td :props="p">
        <q-btn flat dense no-caps color="negative" label="Revoke"
          :aria-label="'Revoke ' + p.row.label + (p.row.current ? ' (this device)' : '')"
          @click="$emit('revoke', p.row)" />
      </q-td>
    </template>
  </q-table>
</template>

<style scoped>
.av2dev { display: flex; align-items: flex-start; gap: 12px; min-width: 0; }
.av2dev__icon { flex: none; margin-top: 1px; color: var(--ds-color-text-subtle); }
.av2dev__text { min-width: 0; }
.av2dev__name { display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--ds-color-text); }
.av2dev__this { font-size: 0.6875rem; font-weight: 700; padding: 3px 8px; }
/* The raw UA is secondary: one line, truncated, full string on hover. */
.av2dev__ua {
  max-width: 520px; margin-top: 2px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.75rem;
  color: var(--ds-color-text-subtlest);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
</style>

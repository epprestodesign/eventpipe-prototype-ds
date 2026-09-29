<script setup>
/* Av2EnrollCodeSheet — the ten recovery codes and the three ways to keep them.
 *
 * Two columns of five in a monospace grid. Monospace is not decoration: these
 * codes get transcribed by hand and read aloud to colleagues, and a
 * proportional font makes 0/O and 1/l/I ambiguous at exactly the moment the
 * user has no other way into their account.
 *
 * Copy, Download and Print are all offered because they are three different
 * users, not three routes for one: Copy is the password-manager user, Download
 * is the "put it in the safe / 1Password vault as a file" user, Print is the
 * finance office that keeps a folder. Offering only Copy quietly excludes the
 * people most likely to actually still have the codes in a year.
 *
 * Codes are passed in rather than generated here so a story's screenshot is
 * stable and every step of the flow shows the same ten.
 */
import { computed, ref } from 'vue'

const props = defineProps({
  codes: { type: Array, required: true },
  /** Filename stem for the download. */
  name: { type: String, default: 'eventpipe-recovery-codes' },
})

const copied = ref(false)

/** Downloaded/copied as plain text with a header: a bare list of ten strings
 *  found in a downloads folder in eighteen months is unidentifiable. */
const asText = computed(() =>
  [
    'EventPipe — two-factor recovery codes',
    'Each code works once. Keep this somewhere you can reach without your phone.',
    '',
    ...props.codes,
    '',
  ].join('\n')
)

function copy() {
  try {
    navigator.clipboard?.writeText(props.codes.join('\n'))
  } catch (_err) { /* codes are on screen; selection still works */ }
  copied.value = true
  setTimeout(() => { copied.value = false }, 1800)
}

function download() {
  try {
    const url = URL.createObjectURL(new Blob([asText.value], { type: 'text/plain' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `${props.name}.txt`
    a.click()
    URL.revokeObjectURL(url)
  } catch (_err) { /* prototype: a blocked download is not worth an error state */ }
}

function print() {
  try { window.print() } catch (_err) { /* no-op */ }
}
</script>

<template>
  <div class="av2sheet">
    <ol class="av2sheet__grid">
      <li v-for="(code, i) in codes" :key="code" class="av2sheet__code">
        <span class="av2sheet__num">{{ i + 1 }}</span>{{ code }}
      </li>
    </ol>

    <div class="av2sheet__actions">
      <q-btn outline no-caps dense color="primary" class="av2sheet__btn"
        :icon="copied ? 'check' : 'content_copy'" :label="copied ? 'Copied' : 'Copy'" @click="copy" />
      <q-btn outline no-caps dense color="primary" class="av2sheet__btn"
        icon="download" label="Download" @click="download" />
      <q-btn outline no-caps dense color="primary" class="av2sheet__btn"
        icon="print" label="Print" @click="print" />
    </div>
  </div>
</template>

<style scoped>
.av2sheet { margin-top: 16px; }

.av2sheet__grid {
  list-style: none; margin: 0; padding: 14px 16px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 9px 22px;
  /* Column-major so the numbering reads 1–5 down the left, 6–10 down the
     right — the way a printed list is read, not left-to-right in pairs. */
  grid-auto-flow: column; grid-template-rows: repeat(5, auto);
  background: var(--ds-color-surface-sunken);
  border: 1px solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
}
.av2sheet__code {
  display: flex; align-items: baseline; gap: 9px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.9375rem; letter-spacing: 0.04em;
  color: var(--ds-color-text);
}
.av2sheet__num {
  flex: none; width: 15px; text-align: right;
  font-family: inherit; font-size: 0.75rem; color: var(--ds-color-text-subtlest);
}

.av2sheet__actions { display: flex; gap: 8px; margin-top: 12px; }
.av2sheet__btn { flex: 1; }
</style>

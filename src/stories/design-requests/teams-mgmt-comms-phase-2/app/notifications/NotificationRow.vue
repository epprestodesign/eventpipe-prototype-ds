<script setup lang="ts">
// One email-template row: name (+ optional "Custom" badge), description, the
// Send-Email toggle (locked when required), and an Edit menu. Presentational —
// all state lives in the parent; interactions are emitted up.
import DsListItem from '../../components/DsListItem.vue'
import type { NotificationTemplate } from './useNotificationPreferences'

const props = defineProps<{ template: NotificationTemplate }>()

const emit = defineEmits<{
  'update:send': [value: boolean]
  edit: []
  preview: []
  revert: []
}>()
</script>

<template>
  <div class="ntf-row">
    <ds-list-item :bordered="false">
      <template #title>
        <span class="row items-center q-gutter-sm">
          <strong class="ntf-row__title">{{ template.title }}</strong>
          <q-badge v-if="template.custom" color="primary" class="q-px-sm q-py-xs">Custom</q-badge>
        </span>
      </template>

      <template #subtitle>
        <span class="ntf-row__desc">{{ template.desc }}</span>
      </template>

      <template #trailing>
        <div class="row items-center no-wrap">
          <div class="ntf-row__col ntf-row__col--send">
            <q-checkbox
              :model-value="template.send"
              :disable="template.forced"
              color="primary"
              :aria-label="`Send email: ${template.title}`"
              @update:model-value="emit('update:send', $event)"
            >
              <q-tooltip v-if="template.forced">Required — always sent</q-tooltip>
            </q-checkbox>
          </div>

          <div class="ntf-row__col ntf-row__col--tmpl">
            <q-btn-dropdown split unelevated no-caps color="primary" label="Edit" @click="emit('edit')">
              <q-list style="min-width: 190px">
                <q-item clickable v-close-popup @click="emit('edit')">
                  <q-item-section avatar><q-icon name="edit" /></q-item-section>
                  <q-item-section>Edit template</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="emit('preview')">
                  <q-item-section avatar><q-icon name="visibility" /></q-item-section>
                  <q-item-section>Preview</q-item-section>
                </q-item>
                <template v-if="template.custom">
                  <q-separator />
                  <q-item clickable v-close-popup @click="emit('revert')">
                    <q-item-section avatar><q-icon name="undo" color="negative" /></q-item-section>
                    <q-item-section class="text-negative">Revert to default</q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
      </template>
    </ds-list-item>
  </div>
</template>

<style scoped>
/* Column widths are shared with NotificationSection's header via CSS vars so the
   "Send Email" / "Template" labels stay aligned over the controls. */
.ntf-row { padding: 8px 28px; }
.ntf-row__title { font-size: 0.9375rem; font-weight: 500; color: var(--ds-color-text); }
.ntf-row__desc { display: block; font-size: 0.8125rem; color: var(--ds-color-text-subtle); line-height: 1.5; }
.ntf-row__col { display: flex; align-items: center; justify-content: center; }
.ntf-row__col--send { width: var(--ntf-col-send, 96px); }
.ntf-row__col--tmpl { width: var(--ntf-col-tmpl, 132px); margin-left: var(--ntf-col-gap, 24px); }
</style>

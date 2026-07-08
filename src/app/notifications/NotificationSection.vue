<script setup lang="ts">
// A collapsible section of notification rows (e.g. "Teams Management") with the
// aligned "Send Email" / "Template" column headers. Forwards each row's events
// up, tagged with the row index so the page can act on the right template.
import NotificationRow from './NotificationRow.vue'
import type { NotificationGroup } from './useNotificationPreferences'

const props = defineProps<{ group: NotificationGroup }>()

const emit = defineEmits<{
  'update:send': [index: number, value: boolean]
  edit: [index: number]
  preview: [index: number]
  revert: [index: number]
}>()
</script>

<template>
  <q-card flat bordered class="ntf-section">
    <q-expansion-item
      :default-opened="group.open"
      :label="group.name"
      header-class="text-primary text-weight-medium"
    >
      <q-separator />

      <div class="ntf-section__head" aria-hidden="true">
        <span class="ntf-section__col ntf-section__col--send">Send Email</span>
        <span class="ntf-section__col ntf-section__col--tmpl">Template</span>
      </div>

      <template v-for="(template, i) in group.items" :key="template.title">
        <q-separator v-if="i > 0" />
        <notification-row
          :template="template"
          @update:send="emit('update:send', i, $event)"
          @edit="emit('edit', i)"
          @preview="emit('preview', i)"
          @revert="emit('revert', i)"
        />
      </template>
    </q-expansion-item>
  </q-card>
</template>

<style scoped>
.ntf-section__head {
  display: flex;
  justify-content: flex-end;
  padding: 14px 28px 4px;
}
.ntf-section__col {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ds-color-text-subtle);
}
.ntf-section__col--send { width: var(--ntf-col-send, 96px); }
.ntf-section__col--tmpl { width: var(--ntf-col-tmpl, 132px); margin-left: var(--ntf-col-gap, 24px); }
</style>

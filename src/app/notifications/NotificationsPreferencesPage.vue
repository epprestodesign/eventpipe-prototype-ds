<script setup lang="ts">
// Notifications Preferences page body (the content under the company header's
// "Notifications" tab). Owns state via the composable; routes row actions up to
// the host app. Drop this inside your AppShell + company header.
import { computed } from 'vue'
import DsSectionHeader from '../../components/DsSectionHeader.vue'
import NotificationSection from './NotificationSection.vue'
import {
  useNotificationPreferences,
  type NotificationGroup,
  type NotificationTemplate,
} from './useNotificationPreferences'

const props = withDefaults(
  defineProps<{
    /** Optional seed; defaults to the shared fixture inside the composable. */
    groups?: NotificationGroup[]
    showNotice?: boolean
  }>(),
  { showNotice: true },
)

const emit = defineEmits<{
  edit: [template: NotificationTemplate]
  preview: [template: NotificationTemplate]
  revert: [template: NotificationTemplate]
  'dismiss-notice': []
}>()

const { groups, toggleSend } = useNotificationPreferences(props.groups)

// Resolve a section-relative row index to the template it points at, so the
// host receives a stable payload rather than array coordinates.
const templateAt = (g: number, i: number) => groups.value[g].items[i]
const onEdit = (g: number, i: number) => emit('edit', templateAt(g, i))
const onPreview = (g: number, i: number) => emit('preview', templateAt(g, i))
const onRevert = (g: number, i: number) => emit('revert', templateAt(g, i))

const noticeVisible = computed(() => props.showNotice)
</script>

<template>
  <div class="column q-gutter-md">
    <q-banner v-if="noticeVisible" rounded class="ntf-notice">
      <template #avatar><q-icon name="info" color="primary" size="22px" /></template>
      <div class="text-weight-bold text-grey-9">New notification section</div>
      <div class="text-grey-8">
        For day one, this section only supports <b>Teams Management</b> notifications.
        Over time, more email templates from across the system will come online here.
      </div>
      <template #action>
        <q-btn flat no-caps color="primary" label="Dismiss" @click="emit('dismiss-notice')" />
      </template>
    </q-banner>

    <ds-section-header
      title="Notifications Preferences"
      subtitle="Manage all of the notifications sent to your users."
      variant="accent"
    />

    <notification-section
      v-for="(group, g) in groups"
      :key="group.name"
      :group="group"
      @update:send="(i, value) => toggleSend(g, i, value)"
      @edit="(i) => onEdit(g, i)"
      @preview="(i) => onPreview(g, i)"
      @revert="(i) => onRevert(g, i)"
    />
  </div>
</template>

<style scoped>
.ntf-notice {
  background: var(--ds-color-background-info);
  border: 1px solid var(--ds-color-background-info-bold);
}
</style>

<script setup lang="ts">
// Notifications Preferences page body (the content under the company header's
// "Notifications" tab). Owns state via the composable; confirms destructive
// reverts, toasts each send toggle, and routes edit/preview up to the host app.
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import DsSectionHeader from '../../components/DsSectionHeader.vue'
import DsConfirmDialog from '../../components/DsConfirmDialog.vue'
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

const $q = useQuasar()
const { groups, toggleSend } = useNotificationPreferences(props.groups)

// Resolve a section-relative row index to the template it points at.
const templateAt = (g: number, i: number) => groups.value[g].items[i]

// Toggle a row's send flag and confirm the change with a toast.
function onToggle(g: number, i: number, value: boolean) {
  toggleSend(g, i, value)
  const t = templateAt(g, i)
  $q.notify({
    message: t.title,
    caption: value ? 'Send email turned on' : 'Send email turned off',
    icon: value ? 'mark_email_read' : 'unsubscribe',
    color: value ? 'positive' : 'grey-8',
    position: 'bottom-right',
    timeout: 2200,
  })
}

const onEdit = (g: number, i: number) => emit('edit', templateAt(g, i))
const onPreview = (g: number, i: number) => emit('preview', templateAt(g, i))

// Revert is destructive → confirm before discarding the company's custom template.
const revertOpen = ref(false)
const revertTarget = ref<NotificationTemplate | null>(null)
function onRevert(g: number, i: number) {
  revertTarget.value = templateAt(g, i)
  revertOpen.value = true
}
function confirmRevert() {
  const t = revertTarget.value
  if (!t) return
  t.custom = false // restore the EventPipe default (drops the "Custom" badge)
  emit('revert', t)
}

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
      @update:send="(i, value) => onToggle(g, i, value)"
      @edit="(i) => onEdit(g, i)"
      @preview="(i) => onPreview(g, i)"
      @revert="(i) => onRevert(g, i)"
    />

    <ds-confirm-dialog
      v-model="revertOpen"
      title="Revert to default template?"
      destructive
      confirm-label="Revert to default"
      cancel-label="Keep custom"
      @confirm="confirmRevert"
    >
      <template #body>
        This replaces <strong>{{ revertTarget?.title }}</strong> with the EventPipe default
        template. Your company's custom changes will be <strong>permanently discarded</strong>
        and can't be recovered.
      </template>
    </ds-confirm-dialog>
  </div>
</template>

<style scoped>
.ntf-notice {
  background: var(--ds-color-background-info);
  border: 1px solid var(--ds-color-background-info-bold);
}
</style>

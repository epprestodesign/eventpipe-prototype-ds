import { ref, type Ref } from 'vue'
import content from '../../stories/design-requests/des207-content.json'

export interface NotificationTemplate {
  title: string
  desc: string
  send: boolean
  forced: boolean
  custom: boolean
}

export interface NotificationGroup {
  name: string
  open: boolean
  items: NotificationTemplate[]
}

/**
 * Owns the notification-preferences state. In the real app, swap the seed for an
 * API response and persist `toggleSend` through your data layer.
 *
 * @param seed Initial groups (defaults to the shared fixture).
 */
export function useNotificationPreferences(
  seed: NotificationGroup[] = content.sections as NotificationGroup[],
) {
  const groups: Ref<NotificationGroup[]> = ref(structuredClone(seed))

  /** Enable/disable a template. No-op for required templates. */
  function toggleSend(groupIndex: number, itemIndex: number, value: boolean): void {
    const item = groups.value[groupIndex]?.items[itemIndex]
    if (item && !item.forced) item.send = value
  }

  return { groups, toggleSend }
}

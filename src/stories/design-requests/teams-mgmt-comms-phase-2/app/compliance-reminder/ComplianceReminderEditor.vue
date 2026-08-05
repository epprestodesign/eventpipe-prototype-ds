<script setup lang="ts">
// V2 · Configured Template editor. Owns the editable template (preview, content,
// BCC, reminder settings) and emits it on Save. Reuses DsRichTextEditor (with the
// inline `{{` personalization trigger) and the DS form primitives.
import { reactive, ref } from 'vue'
import DsField from '../../components/DsField.vue'
import DsRichTextEditor from '../../components/DsRichTextEditor.vue'
import ReminderSettings from './ReminderSettings.vue'

interface PersonalizationGroup {
  group: string
  items: { name: string; desc: string }[]
}

interface ReminderForm {
  preview: string
  content: string
  bcc: string
  settings: {
    begin: number
    end: number
    recurrence: string
    statuses: string[]
    recipients: string[]
  }
}

const props = withDefaults(
  defineProps<{
    /** Personalization tokens for the content editor. */
    tokens?: PersonalizationGroup[]
    /** Seed HTML for the content editor + Restore-to-Default target. */
    defaultContent?: string
  }>(),
  { tokens: () => [], defaultContent: '' },
)

const emit = defineEmits<{
  save: [form: ReminderForm]
  cancel: []
  'send-preview': [email: string]
}>()

const form = reactive<ReminderForm>({
  preview: '',
  content: props.defaultContent,
  bcc: '',
  settings: {
    begin: 30,
    end: 3,
    recurrence: '',
    statuses: ['Non-Compliant', 'At Risk'],
    recipients: ['team-manager'],
  },
})

const showSettings = ref(false)
</script>

<template>
  <q-card flat bordered>
    <q-card-section class="row items-center justify-between editor__head">
      <h2 class="editor__title">Compliance Reminder</h2>
      <div class="row q-gutter-sm">
        <q-btn outline no-caps color="primary" label="Cancel" @click="emit('cancel')" />
        <q-btn unelevated no-caps color="primary" label="Save" @click="emit('save', { ...form })" />
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="editor__body">
      <ds-field label="Send Email Preview to" class="editor__narrow">
        <q-input v-model="form.preview" outlined dense placeholder="Email Address" hide-bottom-space>
          <template #append>
            <q-btn flat dense no-caps color="primary" label="Send" @click="emit('send-preview', form.preview)" />
          </template>
        </q-input>
      </ds-field>

      <ds-rich-text-editor
        v-model="form.content"
        label="Content"
        required
        :tokens="tokens"
        :default-content="defaultContent"
        class="q-mt-lg"
      />

      <ds-field label="BCC Recipient" class="editor__narrow q-mt-lg">
        <q-input v-model="form.bcc" outlined dense placeholder="Email Address" hide-bottom-space />
      </ds-field>

      <div class="q-mt-lg">
        <q-btn
          outline no-caps color="primary"
          :icon="showSettings ? 'expand_less' : 'add'"
          label="Compliance Reminder Settings"
          :aria-expanded="showSettings"
          @click="showSettings = !showSettings"
        />
        <q-slide-transition>
          <div v-show="showSettings" class="q-mt-md">
            <reminder-settings
              v-model:begin="form.settings.begin"
              v-model:end="form.settings.end"
              v-model:recurrence="form.settings.recurrence"
              v-model:statuses="form.settings.statuses"
              v-model:recipients="form.settings.recipients"
            />
          </div>
        </q-slide-transition>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.editor__head { padding: 24px 32px; }
.editor__title { margin: 0; font-size: 1.375rem; font-weight: 500; color: var(--ds-color-text); }
.editor__body { padding: 24px 32px; }
.editor__narrow { max-width: 520px; }
</style>

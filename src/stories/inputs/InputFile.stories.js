/** BASE COMPONENTS / Inputs / Input File → QFile (outlined) inside Form Field. */
import { ref } from 'vue'
import DsField from '../../components/DsField.vue'

export default {
  title: 'Components/Forms/Input File',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
Compact file-picker field — a single outlined control showing the chosen file(s).
For a full drag-and-drop dropzone see **Application Components / File Upload**.
` } } },
}

export const Default = {
  render: () => ({
    components: { DsField },
    setup: () => ({ file: ref(null) }),
    template: `
      <div style="max-width:340px">
        <ds-field label="Upload logo" hint="PNG or SVG · up to 5MB">
          <q-file v-model="file" outlined dense clearable placeholder="Choose a file">
            <template #prepend><q-icon name="attach_file" /></template>
          </q-file>
        </ds-field>
      </div>`,
  }),
}

export const Multiple = {
  render: () => ({
    components: { DsField },
    setup: () => ({ files: ref([]) }),
    template: `
      <div style="max-width:340px">
        <ds-field label="Attachments" required>
          <q-file v-model="files" outlined dense multiple use-chips clearable placeholder="Choose files">
            <template #prepend><q-icon name="attach_file" /></template>
          </q-file>
        </ds-field>
      </div>`,
  }),
}

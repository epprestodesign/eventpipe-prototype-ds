/** BASE COMPONENTS / Inputs / File Field → DsFileField.vue
 *  A single-line file picker with an attached "Browse" suffix button. Built on the
 *  native QFile — clicking the field or the Browse button opens the OS file dialog.
 *  For a full drag-and-drop dropzone, see Application Components / File Upload. */
import { ref } from 'vue'
import DsFileField from '../../components/DsFileField.vue'

export default {
  title: 'Components/Forms/File Field',
  component: DsFileField,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
The standardized **"Choose Image [Browse]"** field. A native \`QFile\` wrapped in
\`DsField\`, with the **Browse** button pinned to the right edge as a suffix action.
Clicking the field **or** the Browse button opens the operating-system file dialog;
the chosen \`File\` binds via \`v-model\`.

- Use for logos / backgrounds / single-asset uploads inline in a form.
- \`display-value\` shows an already-uploaded filename before the user re-picks.
- For drag-and-drop of many files, use **File Upload** (DsFileUpload) instead.
` } } },
}

export const Default = {
  render: () => ({
    components: { DsFileField },
    setup: () => ({ file: ref(null) }),
    template: `<div style="max-width:560px"><ds-file-field v-model="file" label="Landing Page Logo" tooltip="Displayed on the landing page." /></div>`,
  }),
}

export const WithExistingFile = {
  name: 'With existing file',
  render: () => ({
    components: { DsFileField },
    setup: () => ({ file: ref(null) }),
    template: `<div style="max-width:560px"><ds-file-field v-model="file" label="Event Logo" display-value="EP Logo.png" /></div>`,
  }),
}

export const Required = {
  render: () => ({
    components: { DsFileField },
    setup: () => ({ file: ref(null) }),
    template: `<div style="max-width:560px"><ds-file-field v-model="file" label="Hotel List Background" required hint="PNG or JPG · recommended 345px × 215px" /></div>`,
  }),
}

export const Disabled = {
  render: () => ({
    components: { DsFileField },
    setup: () => ({ file: ref(null) }),
    template: `<div style="max-width:560px"><ds-file-field v-model="file" label="Advertisement" disabled /></div>`,
  }),
}

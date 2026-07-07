/** APPLICATION COMPONENTS / File Upload → DsFileUpload.vue (dropzone). */
import { ref } from 'vue'
import DsFileUpload from '../../components/DsFileUpload.vue'

export default {
  title: 'Components/Forms/File Upload',
  component: DsFileUpload,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
A drag-and-drop upload dropzone with a browse fallback and a selected-files list.
\`v-model\` is the \`File[]\`. For a compact single-field picker, see
**Base Components / Inputs / Input File**.
` } } },
}

export const Default = { render: () => ({ components: { DsFileUpload }, setup: () => ({ files: ref([]) }), template: `<div style="max-width:460px"><ds-file-upload v-model="files" /></div>` }) }

export const SingleImage = {
  render: () => ({ components: { DsFileUpload }, setup: () => ({ files: ref([]) }), template: `
    <div style="max-width:460px"><ds-file-upload v-model="files" :multiple="false" accept="image/*" hint="PNG or JPG · up to 5MB" /></div>` }),
}

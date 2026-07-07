/** BASE COMPONENTS / Inputs / Pin Input → DsPinInput.vue (segmented code). */
import { ref } from 'vue'
import DsPinInput from '../../components/DsPinInput.vue'
import DsField from '../../components/DsField.vue'

export default {
  title: 'Components/Forms/Pin Input',
  component: DsPinInput,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
Segmented code entry for verification / 2FA. Typing auto-advances, Backspace
steps back, and paste distributes across the boxes. \`v-model\` is the joined
string; emits \`complete\` when all cells are filled.
` } } },
  argTypes: { length: { control: 'number' }, type: { control: 'select', options: ['text', 'number'] } },
  args: { length: 6, type: 'number' },
}

export const Default = { render: (args) => ({ components: { DsPinInput }, setup: () => ({ args, v: ref('') }), template: `<ds-pin-input v-model="v" v-bind="args" />` }) }

export const InField = {
  render: () => ({
    components: { DsPinInput, DsField },
    setup: () => ({ v: ref('') }),
    template: `
      <ds-field label="Verification code" sublabel="Enter the 6-digit code sent to your email." hint="Didn't get it? Resend in 0:42.">
        <ds-pin-input v-model="v" :length="6" type="number" />
      </ds-field>`,
  }),
}

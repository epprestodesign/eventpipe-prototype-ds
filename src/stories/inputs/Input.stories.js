/** BASE COMPONENTS / Inputs / Input → DsInput.vue (text). */
import { ref } from 'vue'
import DsInput from '../../components/DsInput.vue'

export default {
  title: 'Components/Forms/Input',
  component: DsInput,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
Single-line text field — the workhorse input. Restyled QInput (outlined) inside
**Form Field**, so it carries the standard label / required / tooltip / helper /
error anatomy. Use \`type\` for password, email, tel, etc.
` } } },
  argTypes: {
    label: { control: 'text' }, required: { control: 'boolean' },
    tooltip: { control: 'text' }, hint: { control: 'text' }, error: { control: 'text' },
    placeholder: { control: 'text' }, type: { control: 'select', options: ['text', 'password', 'email', 'tel'] },
  },
  args: { label: 'Name', placeholder: 'Data', type: 'text' },
}

export const Default = { render: (args) => ({ components: { DsInput }, setup: () => ({ args, v: ref('') }), template: `<div style="max-width:340px"><ds-input v-model="v" v-bind="args" /></div>` }) }

export const Variations = {
  render: () => ({
    components: { DsInput },
    setup: () => ({ a: ref(''), b: ref(''), c: ref(''), d: ref('') }),
    template: `
      <div class="column q-gutter-lg" style="max-width:340px">
        <ds-input v-model="a" label="Name" required placeholder="Data" />
        <ds-input v-model="b" label="Email" type="email" placeholder="you@company.com" hint="We never share it." />
        <ds-input v-model="c" label="Password" type="password" placeholder="••••••••" />
        <ds-input v-model="d" label="Alias Identifier" placeholder="Josh's Alias Name" clearable />
      </div>`,
  }),
}

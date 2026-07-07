/** BASE COMPONENTS / Inputs / Input Tags → QSelect (chips, add-on-type) in Form Field. */
import { ref } from 'vue'
import DsField from '../../components/DsField.vue'

export default {
  title: 'Components/Forms/Input Tags',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
Free-form tag entry — type a value and press Enter to add a chip. Restyled
QSelect (\`use-input\` + \`use-chips\` + \`new-value-mode\`) inside **Form Field**.
` } } },
}

export const Default = {
  render: () => ({
    components: { DsField },
    setup: () => ({ tags: ref(['Engineering', 'Product']) }),
    template: `
      <div style="max-width:380px">
        <ds-field label="Teams" hint="Press Enter to add a tag.">
          <q-select v-model="tags" outlined dense use-input use-chips multiple hide-dropdown-icon
            new-value-mode="add-unique" input-debounce="0" placeholder="Add a team" />
        </ds-field>
      </div>`,
  }),
}

export const WithSuggestions = {
  render: () => ({
    components: { DsField },
    setup: () => {
      const all = ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Soylent']
      const tags = ref(['Acme Corp'])
      const opts = ref([...all])
      const filter = (val, update) => update(() => {
        const n = val.toLowerCase(); opts.value = all.filter(o => o.toLowerCase().includes(n))
      })
      return { tags, opts, filter }
    },
    template: `
      <div style="max-width:380px">
        <ds-field label="Organizations">
          <q-select v-model="tags" :options="opts" @filter="filter" outlined dense use-input use-chips multiple
            new-value-mode="add-unique" input-debounce="0" placeholder="Add or pick" />
        </ds-field>
      </div>`,
  }),
}

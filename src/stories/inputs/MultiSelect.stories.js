/** BASE COMPONENTS / Multi-Select → DsSelect (multiple) + QSelect chips. */
import { ref } from 'vue'
import DsSelect from '../../components/DsSelect.vue'

export default {
  title: 'Components/Forms/Multi-Select',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
Choose several values from a list. Labeled variant via **DsSelect** (\`multiple\`);
also supports search and select-all. For moving items between two lists, see
**Transfer List**.
` } } },
}

export const Labeled = {
  render: () => ({
    components: { DsSelect },
    setup: () => ({ v: ref(['Engineering', 'Product']), opts: ['Engineering', 'Product', 'Design', 'Sales', 'Operations', 'Finance'] }),
    template: `<div style="max-width:380px"><ds-select v-model="v" :options="opts" label="Teams" multiple clearable required /></div>`,
  }),
}

export const Searchable = {
  render: () => ({
    setup: () => {
      const all = ['Acme Corp','Globex','Initech','Umbrella','Soylent','Hooli','Stark']
      const v = ref([])
      const opts = ref([...all])
      const filter = (val, update) => update(() => {
        const n = val.toLowerCase(); opts.value = all.filter(o => o.toLowerCase().includes(n))
      })
      return { v, opts, filter }
    },
    template: `
      <div style="max-width:380px">
        <q-select v-model="v" :options="opts" @filter="filter" outlined dense multiple use-input use-chips
          label="Organizations" input-debounce="0" />
      </div>`,
  }),
}

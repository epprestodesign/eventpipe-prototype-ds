/** BASE COMPONENTS / Inputs / Input Group → compound fields (control + add-on). */
import { ref } from 'vue'
import DsField from '../../components/DsField.vue'

export default {
  title: 'Components/Forms/Input Group',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
Compound fields that combine a control with an add-on — the "Days | value",
"Flat Fee ▾ | 0.00", and "value Per value" patterns from Edit Event. Composed
from Quasar controls inside a **Form Field**.
` } } },
}

export const UnitAndValue = {
  parameters: { docs: { description: { story: 'A leading unit select + an amount ("Days · Data").' } } },
  render: () => ({
    components: { DsField },
    setup: () => ({ unit: ref('Days'), val: ref('') }),
    template: `
      <div style="max-width:340px">
        <ds-field label="Target Hotel Rebate">
          <div class="row no-wrap q-gutter-sm">
            <q-select v-model="unit" :options="['Days','Nights','%']" outlined dense style="width:110px" hide-bottom-space />
            <q-input v-model="val" outlined dense placeholder="Data" class="col" hide-bottom-space />
          </div>
        </ds-field>
      </div>`,
  }),
}

export const TypeAndAmount = {
  parameters: { docs: { description: { story: 'A fee-type select + a currency amount ("Flat Fee ▾ · $0.00").' } } },
  render: () => ({
    components: { DsField },
    setup: () => ({ type: ref('Flat Fee'), amount: ref('') }),
    template: `
      <div style="max-width:380px">
        <ds-field label="Additional Reservation Fee">
          <div class="row no-wrap q-gutter-sm">
            <q-select v-model="type" :options="['Flat Fee','Percentage','Per Night']" outlined dense style="width:150px" hide-bottom-space />
            <q-input v-model="amount" outlined dense prefix="$" placeholder="0.00" class="col" hide-bottom-space />
          </div>
        </ds-field>
      </div>`,
  }),
}

export const RatioPair = {
  parameters: { docs: { description: { story: 'Two values joined by "Per" ("Data Per Data").' } } },
  render: () => ({
    components: { DsField },
    setup: () => ({ a: ref(''), b: ref('') }),
    template: `
      <div style="max-width:380px">
        <ds-field label="Target Comp Ratio">
          <div class="row no-wrap items-center q-gutter-sm">
            <q-input v-model="a" outlined dense placeholder="Data" class="col" hide-bottom-space />
            <span class="text-grey-7">Per</span>
            <q-input v-model="b" outlined dense placeholder="Data" class="col" hide-bottom-space />
          </div>
        </ds-field>
      </div>`,
  }),
}

/** DES-207 / Components / Recurrence Picker → Google-Calendar-style (library only). */
import { ref, computed } from 'vue'
import DsSelect from '../../components/DsSelect.vue'

export default {
  title: 'Design Requests/🟢 DES-207 Communications | Email Template Editor/Components/Recurrence Picker',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'Google-Calendar-style recurrence: a summary **Select** with presets, where "Custom…" opens a **Custom recurrence** dialog — Repeat every N day/week/month/year, day-of-week circles, and an Ends radio (Never / On date / After N occurrences). Composed from Select · Dialog · Radio · round Buttons · Input.' } } },
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const CalendarStyle = {
  render: () => ({
    components: { DsSelect },
    setup: () => {
      const showCustom = ref(false)
      const every = ref(1)
      const unit = ref('week')
      const days = ref([1, 4, 6]) // Mon, Thu, Sat
      const ends = ref('never')
      const endsOn = ref('2026-08-06')
      const endsAfter = ref(13)

      const summary = computed(() => {
        const picked = days.value.slice().sort().map((d) => DAY_NAMES[d]).join(', ')
        let s = `${unit.value === 'week' ? 'Weekly' : 'Every ' + every.value + ' ' + unit.value}` + (picked ? ` on ${picked}` : '')
        if (ends.value === 'on') s += `, until Aug 6, 2026`
        if (ends.value === 'after') s += `, ${endsAfter.value} times`
        return s
      })
      const options = computed(() => ['Does not repeat', 'Daily', 'Every weekday (Mon–Fri)', summary.value, 'Custom…'])
      const rec = ref(summary.value)

      const onSelect = (val) => {
        if (val === 'Custom…') { showCustom.value = true; rec.value = summary.value }
        else rec.value = val
      }
      const toggleDay = (d) => {
        const i = days.value.indexOf(d)
        if (i === -1) days.value.push(d); else days.value.splice(i, 1)
      }
      const done = () => { rec.value = summary.value; showCustom.value = false }

      return { showCustom, every, unit, days, ends, endsOn, endsAfter, options, rec, onSelect, toggleDay, done, DAY_LABELS }
    },
    template: `
      <div style="max-width:520px;">
        <ds-select :model-value="rec" @update:model-value="onSelect" :options="options" label="Recurrence" />

        <q-dialog v-model="showCustom">
          <q-card style="min-width:440px; border-radius:var(--ds-radius-lg);">
            <q-card-section style="padding:28px 28px 8px;">
              <div class="text-h6" style="font-weight:700;">Custom recurrence</div>
            </q-card-section>

            <q-card-section style="padding:12px 28px;">
              <div class="row items-center q-gutter-md">
                <span class="text-grey-8">Repeat every</span>
                <q-input v-model.number="every" type="number" outlined dense min="1" style="width:80px" hide-bottom-space />
                <q-select v-model="unit" :options="['day','week','month','year']" outlined dense style="width:140px" hide-bottom-space />
              </div>
            </q-card-section>

            <q-card-section v-if="unit === 'week'" style="padding:12px 28px;">
              <div class="text-grey-8 q-mb-sm">Repeat on</div>
              <div class="row q-gutter-sm">
                <q-btn v-for="(lbl, d) in DAY_LABELS" :key="d" round unelevated
                  :color="days.includes(d) ? 'primary' : 'grey-3'" :text-color="days.includes(d) ? 'white' : 'dark'"
                  :label="lbl" size="sm" @click="toggleDay(d)" />
              </div>
            </q-card-section>

            <q-card-section style="padding:12px 28px 20px;">
              <div class="text-grey-8 q-mb-sm">Ends</div>
              <q-radio v-model="ends" val="never" label="Never" color="primary" class="block q-mb-sm" />
              <div class="row items-center q-gutter-md q-mb-sm">
                <q-radio v-model="ends" val="on" label="On" color="primary" />
                <q-input v-model="endsOn" outlined dense :disable="ends !== 'on'" style="width:170px" hide-bottom-space>
                  <template #append><q-icon name="event" /></template>
                </q-input>
              </div>
              <div class="row items-center q-gutter-md">
                <q-radio v-model="ends" val="after" label="After" color="primary" />
                <q-input v-model.number="endsAfter" type="number" outlined dense :disable="ends !== 'after'" suffix="occurrences" style="width:200px" hide-bottom-space />
              </div>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md">
              <q-btn flat no-caps color="primary" label="Cancel" v-close-popup />
              <q-btn unelevated no-caps color="primary" label="Done" @click="done" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>`,
  }),
}

<script setup>
// ReservationGuests — the reservation Contact Info step's per-room guest forms.
// Aware of the booking widget's selection: it renders one "Room N — Guest
// Information" block per room (from the `rooms` prop), and pre-seeds the
// Additional Guests for each room from its occupancy (adults + children − 1
// primary), still add/removable. Team Name and Custom Fields are event-
// configurable via props. Emits `update:modelValue` (array, one entry per room)
// and `update:valid`. Required per room: First, Last, Mobile; Team Name when
// enabled; any custom field marked required.
import { reactive, computed, watch } from 'vue'
import PhoneField from './PhoneField.vue'

const props = defineProps({
  // Booking-widget selection: one entry per room.
  rooms: { type: Array, default: () => [{ adults: 1, children: 0 }] },
  modelValue: { type: Array, default: () => [] },
  // Event-configurable extra fields.
  teamName: { type: Boolean, default: false },
  // [{ key?, label, type: 'select' | 'text', options?: string[], required?, optional? }]
  customFields: { type: Array, default: () => [] },
  showErrors: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'update:valid'])

const cfKey = (cf, i) => cf.key || `cf${i}`
const additionalCount = (room) => Math.max(0, (room.adults || 1) + (room.children || 0) - 1)

// Build per-room state, hydrating from modelValue when present.
const blank = () => ({ firstName: '', lastName: '' })
const makeRoom = (room, i) => {
  const saved = Array.isArray(props.modelValue) ? props.modelValue[i] : null
  const custom = {}
  props.customFields.forEach((cf, ci) => { custom[cfKey(cf, ci)] = saved?.custom?.[cfKey(cf, ci)] ?? '' })
  const seeded = Array.from({ length: additionalCount(room) }, () => blank())
  return reactive({
    firstName: saved?.firstName ?? '',
    lastName: saved?.lastName ?? '',
    mobile: saved?.mobile ?? '',
    hotelRewards: saved?.hotelRewards ?? '',
    specialRequests: saved?.specialRequests ?? '',
    teamName: saved?.teamName ?? '',
    custom,
    additionalGuests: saved?.additionalGuests?.length ? saved.additionalGuests.map((g) => reactive({ ...blank(), ...g })) : seeded,
  })
}
const roomsData = reactive(props.rooms.map(makeRoom))

const touched = reactive({})
const touch = (i, f) => { touched[`${i}.${f}`] = true }
const showErr = (i, f) => props.showErrors || touched[`${i}.${f}`]
const reqErr = (i, f, val) => (showErr(i, f) && !val ? 'Required' : '')

const addGuest = (i) => roomsData[i].additionalGuests.push(reactive(blank()))
const removeGuest = (i, gi) => roomsData[i].additionalGuests.splice(gi, 1)

// Validity: First, Last, Mobile per room; Team Name when enabled; required customs.
const roomValid = (r) => {
  if (!r.firstName || !r.lastName || !r.mobile) return false
  if (props.teamName && !r.teamName) return false
  for (let ci = 0; ci < props.customFields.length; ci++) {
    const cf = props.customFields[ci]
    if (cf.required && !r.custom[cfKey(cf, ci)]) return false
  }
  return true
}
const valid = computed(() => roomsData.length > 0 && roomsData.every(roomValid))

watch(roomsData, () => emit('update:modelValue', roomsData.map((r) => ({ ...r, additionalGuests: r.additionalGuests.map((g) => ({ ...g })) }))), { deep: true, immediate: true })
watch(valid, (v) => emit('update:valid', v), { immediate: true })
</script>

<template>
  <div class="rg">
    <section v-for="(room, i) in roomsData" :key="i" class="rg__room">
      <h4 class="rg__h">Room {{ i + 1 }} — Guest Information</h4>

      <div class="cgf__grid">
        <label class="cgf__field">
          <span>First name <i class="cgf__req">*</i></span>
          <input v-model="room.firstName" placeholder="First name" :class="{ 'is-error': reqErr(i, 'firstName', room.firstName) }" @blur="touch(i, 'firstName')" />
          <small v-if="reqErr(i, 'firstName', room.firstName)" class="cgf__err">Required</small>
        </label>
        <label class="cgf__field">
          <span>Last name <i class="cgf__req">*</i></span>
          <input v-model="room.lastName" placeholder="Last name" :class="{ 'is-error': reqErr(i, 'lastName', room.lastName) }" @blur="touch(i, 'lastName')" />
          <small v-if="reqErr(i, 'lastName', room.lastName)" class="cgf__err">Required</small>
        </label>

        <div class="cgf__field cgf__field--full">
          <span>Mobile number <i class="cgf__req">*</i></span>
          <phone-field v-model="room.mobile" :error="!!reqErr(i, 'mobile', room.mobile)" @blur="touch(i, 'mobile')" />
          <small v-if="reqErr(i, 'mobile', room.mobile)" class="cgf__err">Required</small>
        </div>

        <label class="cgf__field cgf__field--full">
          <span>Hotel rewards #</span>
          <input v-model="room.hotelRewards" placeholder="Optional" />
        </label>

        <label class="cgf__field cgf__field--full">
          <span>Special requests <em class="rg__opt">(optional)</em></span>
          <textarea v-model="room.specialRequests" rows="3" placeholder="Early check-in, accessibility needs, bed preferences…" />
        </label>

        <label v-if="teamName" class="cgf__field cgf__field--full">
          <span>Team name <i class="cgf__req">*</i></span>
          <input v-model="room.teamName" placeholder="Team name" :class="{ 'is-error': reqErr(i, 'teamName', room.teamName) }" @blur="touch(i, 'teamName')" />
          <small v-if="reqErr(i, 'teamName', room.teamName)" class="cgf__err">Required</small>
        </label>

        <div v-for="(cf, ci) in customFields" :key="cfKey(cf, ci)" class="cgf__field cgf__field--full">
          <span>{{ cf.label }} <i v-if="cf.required" class="cgf__req">*</i><em v-else-if="cf.optional" class="rg__opt">(optional)</em></span>
          <div v-if="cf.type === 'select'" class="rg__selectwrap">
            <select v-model="room.custom[cfKey(cf, ci)]" :class="{ 'is-error': cf.required && reqErr(i, `cf-${ci}`, room.custom[cfKey(cf, ci)]) }" @blur="touch(i, `cf-${ci}`)">
              <option value="" disabled>Select</option>
              <option v-for="opt in cf.options || []" :key="opt" :value="opt">{{ opt }}</option>
            </select>
            <q-icon name="expand_more" size="20px" class="rg__selecticon" />
          </div>
          <input v-else v-model="room.custom[cfKey(cf, ci)]" :placeholder="cf.optional ? 'Optional' : cf.label" :class="{ 'is-error': cf.required && reqErr(i, `cf-${ci}`, room.custom[cfKey(cf, ci)]) }" @blur="touch(i, `cf-${ci}`)" />
          <small v-if="cf.required && reqErr(i, `cf-${ci}`, room.custom[cfKey(cf, ci)])" class="cgf__err">Required</small>
        </div>
      </div>

      <!-- Additional guests -->
      <div class="rg__addl">
        <div class="rg__addl-h">Additional Guests</div>
        <div v-for="(g, gi) in room.additionalGuests" :key="gi" class="rg__guest">
          <label class="cgf__field">
            <span>Guest {{ gi + 1 }} first name</span>
            <input v-model="g.firstName" placeholder="First name" />
          </label>
          <label class="cgf__field">
            <span>Guest {{ gi + 1 }} last name</span>
            <input v-model="g.lastName" placeholder="Last name" />
          </label>
          <button type="button" class="rg__remove" aria-label="Remove guest" @click="removeGuest(i, gi)"><q-icon name="close" size="18px" /></button>
        </div>
        <button type="button" class="rg__addbtn" @click="addGuest(i)"><q-icon name="add" size="18px" /> Add Additional Guest</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.rg { display: flex; flex-direction: column; gap: 28px; }
.rg__room { display: flex; flex-direction: column; gap: 14px; }
.rg__h { font-size: 1.0625rem; font-weight: 700; color: var(--ds-color-text); margin: 0; }
.rg__opt { color: var(--ds-color-text-subtle); font-style: normal; font-weight: 400; }

/* Reuse the cgf field grid/input styling for consistency with ContactGroupForm. */
.cgf__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.cgf__field { display: flex; flex-direction: column; gap: 6px; }
.cgf__field--full { grid-column: 1 / -1; }
.cgf__field span { font-size: 0.8125rem; font-weight: 600; color: var(--ds-color-text); }
.cgf__req { color: var(--ds-color-text-danger); font-style: normal; }
.cgf__field > input,
.rg__selectwrap select { height: 46px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 0 14px; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); outline: none; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard); background: var(--ds-color-surface); width: 100%; }
.cgf__field > textarea { min-height: 84px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 10px 14px; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); outline: none; resize: vertical; }
.cgf__field > input:focus,
.cgf__field > textarea:focus,
.rg__selectwrap select:focus { border-color: var(--ds-color-border-focused); }
.cgf__field > input::placeholder,
.cgf__field > textarea::placeholder { color: var(--ds-color-text-subtlest); }
.cgf__field > input.is-error,
.rg__selectwrap select.is-error { border-color: var(--ds-color-text-danger); }
.cgf__err { color: var(--ds-color-text-danger); font-size: 0.75rem; font-weight: 500; }

/* Custom select with chevron */
.rg__selectwrap { position: relative; display: flex; align-items: center; }
.rg__selectwrap select { appearance: none; -webkit-appearance: none; padding-right: 40px; cursor: pointer; }
.rg__selecticon { position: absolute; right: 12px; color: var(--ds-color-text-subtle); pointer-events: none; }

/* Additional guests */
.rg__addl { display: flex; flex-direction: column; gap: 12px; margin-top: 4px; }
.rg__addl-h { font-size: 0.8125rem; font-weight: 700; letter-spacing: 0.02em; text-transform: uppercase; color: var(--ds-color-text-subtle); }
.rg__guest { display: grid; grid-template-columns: 1fr 1fr auto; gap: 14px; align-items: end; }
.rg__remove { width: 46px; height: 46px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); color: var(--ds-color-text-subtle); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.rg__remove:hover { background: var(--ds-color-surface-sunken); color: var(--ds-color-text); }
.rg__addbtn { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; background: none; border: 0; padding: 4px 0; color: var(--ds-color-link); font-family: inherit; font-weight: 600; font-size: 0.9375rem; cursor: pointer; }
.rg__addbtn:hover { text-decoration: underline; }
</style>

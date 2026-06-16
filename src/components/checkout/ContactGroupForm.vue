<script setup>
// ContactGroupForm — checkout step 2.
//   reservation → contact + "Guests staying" (people at the hotel).
//   group       → contact + group details + a repeatable "Teams" block
//                 (each team has a name and its travelers).
import { reactive, watch, computed } from 'vue'

const props = defineProps({
  mode: { type: String, default: 'group' }, // group | reservation
  modelValue: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['update:modelValue'])

const state = reactive({
  firstName: '', lastName: '', email: '', phone: '',
  groupName: '', organization: '',
  guests: [{ firstName: '', lastName: '' }],
  teams: [{ name: '', members: [{ name: '' }] }],
  ...props.modelValue,
})
watch(state, () => emit('update:modelValue', JSON.parse(JSON.stringify(state))), { deep: true })

const isGroup = computed(() => props.mode === 'group')

const addGuest = () => state.guests.push({ firstName: '', lastName: '' })
const removeGuest = (i) => state.guests.splice(i, 1)
const addTeam = () => state.teams.push({ name: '', members: [{ name: '' }] })
const removeTeam = (i) => state.teams.splice(i, 1)
const addMember = (ti) => state.teams[ti].members.push({ name: '' })
const removeMember = (ti, mi) => state.teams[ti].members.splice(mi, 1)
</script>

<template>
  <div class="cgf">
    <h4 class="cgf__h">Contact information</h4>
    <div class="cgf__grid">
      <label class="cgf__field"><span>First name</span><input v-model="state.firstName" placeholder="First name" /></label>
      <label class="cgf__field"><span>Last name</span><input v-model="state.lastName" placeholder="Last name" /></label>
      <label class="cgf__field"><span>Email</span><input v-model="state.email" type="email" placeholder="you@example.com" /></label>
      <label class="cgf__field"><span>Phone</span><input v-model="state.phone" type="tel" placeholder="(555) 555-5555" /></label>
    </div>

    <!-- RESERVATION: guests staying -->
    <template v-if="!isGroup">
      <div class="cgf__sechead cgf__h--mt">
        <h4 class="cgf__h">Guests staying</h4>
        <button class="cgf__add" @click="addGuest"><q-icon name="add" size="16px" /> Add guest</button>
      </div>
      <p class="cgf__hint">Add everyone who'll be checking in at the hotel.</p>
      <div v-for="(g, i) in state.guests" :key="i" class="cgf__guest">
        <span class="cgf__gnum">{{ i + 1 }}</span>
        <input v-model="g.firstName" placeholder="First name" />
        <input v-model="g.lastName" placeholder="Last name" />
        <button v-if="state.guests.length > 1" class="cgf__rm" aria-label="Remove guest" @click="removeGuest(i)"><q-icon name="close" size="18px" /></button>
      </div>
    </template>

    <!-- GROUP: group details + teams -->
    <template v-else>
      <h4 class="cgf__h cgf__h--mt">Group details</h4>
      <p class="cgf__hint">Tell us who this group booking is for so the property can prepare.</p>
      <div class="cgf__grid">
        <label class="cgf__field cgf__field--full"><span>Group or team name</span><input v-model="state.groupName" placeholder="e.g. Arsenal U12 Boys Select" /></label>
        <label class="cgf__field"><span>Organization</span><input v-model="state.organization" placeholder="Organization / club" /></label>
      </div>

      <div class="cgf__sechead cgf__h--mt">
        <h4 class="cgf__h">Teams</h4>
        <button class="cgf__add" @click="addTeam"><q-icon name="add" size="16px" /> Add team</button>
      </div>
      <p class="cgf__hint">Add each team and the travelers staying under it.</p>

      <div v-for="(t, ti) in state.teams" :key="ti" class="cgf__team">
        <div class="cgf__teamhead">
          <input v-model="t.name" class="cgf__teamname" :placeholder="`Team ${ti + 1} name`" />
          <button v-if="state.teams.length > 1" class="cgf__teamrm" @click="removeTeam(ti)">Remove team</button>
        </div>
        <div v-for="(m, mi) in t.members" :key="mi" class="cgf__member">
          <q-icon name="person" size="18px" class="cgf__micon" />
          <input v-model="m.name" placeholder="Traveler name" />
          <button v-if="t.members.length > 1" class="cgf__rm" aria-label="Remove member" @click="removeMember(ti, mi)"><q-icon name="close" size="18px" /></button>
        </div>
        <button class="cgf__addmember" @click="addMember(ti)"><q-icon name="add" size="16px" /> Add traveler</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cgf__h { font-size: 1rem; font-weight: 700; color: var(--ds-color-text); margin: 0 0 12px; }
.cgf__h--mt { margin-top: 24px; }
.cgf__sechead { display: flex; align-items: center; justify-content: space-between; }
.cgf__sechead .cgf__h { margin: 0; }
.cgf__hint { color: var(--ds-color-text-subtle); font-size: 0.875rem; margin: 6px 0 14px; }
.cgf__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.cgf__field { display: flex; flex-direction: column; gap: 6px; }
.cgf__field--full { grid-column: 1 / -1; }
.cgf__field span { font-size: 0.8125rem; font-weight: 600; color: var(--ds-color-text); }

.cgf input { height: 46px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 0 14px; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); outline: none; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard); width: 100%; }
.cgf input:focus { border-color: var(--ds-color-border-focused); }
.cgf input::placeholder { color: var(--ds-color-text-subtlest); }

.cgf__add { display: inline-flex; align-items: center; gap: 4px; background: none; border: 0; padding: 0; color: var(--ds-color-text-info); font-weight: 600; font-size: 0.875rem; cursor: pointer; }
.cgf__add:hover { text-decoration: underline; }

.cgf__guest { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.cgf__gnum { width: 26px; height: 26px; flex: none; border-radius: 50%; background: var(--ds-palette-zinc-100); color: var(--ds-color-text); font-weight: 700; font-size: 0.8125rem; display: flex; align-items: center; justify-content: center; }
.cgf__rm { width: 32px; height: 32px; flex: none; border: 0; background: none; color: var(--ds-color-text-subtle); cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.cgf__rm:hover { background: var(--ds-palette-zinc-100); color: var(--ds-color-text-danger); }

.cgf__team { border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); padding: 16px; margin-bottom: 14px; }
.cgf__teamhead { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.cgf__teamname { font-weight: 600; }
.cgf__teamrm { background: none; border: 0; padding: 0; color: var(--ds-color-text-danger); font-weight: 600; font-size: 0.875rem; cursor: pointer; white-space: nowrap; }
.cgf__teamrm:hover { text-decoration: underline; }
.cgf__member { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.cgf__micon { color: var(--ds-color-text-subtle); flex: none; }
.cgf__addmember { display: inline-flex; align-items: center; gap: 4px; background: none; border: 0; padding: 4px 0 0; color: var(--ds-color-text-info); font-weight: 600; font-size: 0.875rem; cursor: pointer; }
.cgf__addmember:hover { text-decoration: underline; }
</style>

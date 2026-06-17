<script setup>
// GroupTeamsBlock — the group/team "Contact & Group Information" step.
// Primary contact (names/mobile/email required; org/special optional), then a
// teams flow: 1) how many teams, 2) select & add teams (or add an unlisted team
// with Org/Team name + Age division + Gender). Validation surfaces via showErrors.
import { ref, reactive, computed, watch } from 'vue'
import PhoneField from './PhoneField.vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  showErrors: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const view = ref('count') // count | list | add
const notHolding = ref(false)
const showSpecial = ref(false)
const showOrg = ref(false)
const expected = ref(props.modelValue.expected ?? 1)
const query = ref('')

const clubs = ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester City', 'Tottenham', 'Everton', 'Leeds United', 'Newcastle', 'Aston Villa', 'Brighton']
const teamAges = ['U10', 'U12', 'U14', 'U16']
const teamGenders = ['Boys', 'Girls']
const available = ref(clubs.flatMap((c) => teamAges.flatMap((a) => teamGenders.map((g) => ({ name: `${c} ${a} ${g}`, checked: false })))))
const added = ref([])

const ageDivisions = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18', 'U19', 'Open']
const genders = ['Boys', 'Girls', 'Coed']
const unlisted = reactive({ name: '', ageDivision: '', gender: '' })
const unlistedValid = computed(() => unlisted.name && unlisted.ageDivision && unlisted.gender)

const contact = reactive({ firstName: '', lastName: '', mobile: '', email: '', organization: '', special: '', ...(props.modelValue.contact || {}) })

const filtered = computed(() => available.value.filter((t) => t.name.toLowerCase().includes(query.value.toLowerCase()) && !added.value.includes(t.name)))
const anyChecked = computed(() => available.value.some((t) => t.checked))
const statusText = computed(() => {
  const n = added.value.length
  if (n === 0) return ''
  if (n >= expected.value) return `All ${n} team${n === 1 ? '' : 's'} added`
  return `${n} team${n === 1 ? '' : 's'} added (${expected.value - n} more expected) — that's fine`
})

const isRadio = computed(() => expected.value === 1)
const remaining = computed(() => Math.max(0, expected.value - added.value.length))
const selectedNow = computed(() => available.value.filter((t) => t.checked).length)
const isDisabled = (t) => !t.checked && (remaining.value <= 0 || (!isRadio.value && selectedNow.value >= remaining.value))
const toggle = (t) => {
  if (isDisabled(t)) return
  if (isRadio.value) { const was = t.checked; available.value.forEach((x) => { x.checked = false }); t.checked = !was }
  else { t.checked = !t.checked }
}

const confirmChecked = () => {
  available.value.filter((t) => t.checked).forEach((t) => { if (!added.value.includes(t.name)) added.value.push(t.name); t.checked = false })
}
const removeTeam = (name) => { added.value = added.value.filter((n) => n !== name) }
const inc = () => { expected.value++ }
const dec = () => { expected.value = Math.max(0, expected.value - 1) }
const saveUnlisted = () => {
  if (!unlistedValid.value) return
  added.value.push(`${unlisted.name} ${unlisted.ageDivision} ${unlisted.gender}`)
  unlisted.name = ''; unlisted.ageDivision = ''; unlisted.gender = ''
  view.value = 'list'
}

// Primary-contact validation (org + special are optional).
const touched = reactive({})
const emailOk = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
const cShow = (f) => props.showErrors || touched[f]
const cErr = (f) => {
  if (!cShow(f)) return ''
  if (!contact[f]) return 'Required'
  if (f === 'email' && !emailOk.value) return 'Enter a valid email'
  return ''
}
const teamsErr = computed(() => (props.showErrors && added.value.length === 0 ? 'Add at least one team' : ''))

watch([added, expected, contact, notHolding], () => emit('update:modelValue', { expected: expected.value, teams: [...added.value], contact: { ...contact }, notHolding: notHolding.value }), { deep: true })
</script>

<template>
  <div class="gtb">
    <!-- primary contact -->
    <h4 class="gtb__h gtb__h--first">Primary contact</h4>
    <div class="gtb__grid">
      <label class="gtb__field">
        <span>First name <i class="gtb__req">*</i></span>
        <input v-model="contact.firstName" placeholder="First name" :class="{ 'is-error': cErr('firstName') }" @blur="touched.firstName = true" />
        <small v-if="cErr('firstName')" class="gtb__errmsg">{{ cErr('firstName') }}</small>
      </label>
      <label class="gtb__field">
        <span>Last name <i class="gtb__req">*</i></span>
        <input v-model="contact.lastName" placeholder="Last name" :class="{ 'is-error': cErr('lastName') }" @blur="touched.lastName = true" />
        <small v-if="cErr('lastName')" class="gtb__errmsg">{{ cErr('lastName') }}</small>
      </label>
      <label class="gtb__field gtb__field--full">
        <span>Email <i class="gtb__req">*</i></span>
        <input v-model="contact.email" type="email" placeholder="you@example.com" :class="{ 'is-error': cErr('email') }" @blur="touched.email = true" />
        <small v-if="cErr('email')" class="gtb__errmsg">{{ cErr('email') }}</small>
      </label>
      <div class="gtb__field gtb__field--full">
        <span>Phone number <i class="gtb__req">*</i></span>
        <phone-field v-model="contact.mobile" :error="!!cErr('mobile')" @blur="touched.mobile = true" />
        <small v-if="cErr('mobile')" class="gtb__errmsg">{{ cErr('mobile') }}</small>
      </div>
      <label v-if="showOrg" class="gtb__field gtb__field--full"><span>Organization name</span><input v-model="contact.organization" placeholder="Organization" /></label>
      <label v-if="showSpecial" class="gtb__field gtb__field--full"><span>Special requests</span><input v-model="contact.special" placeholder="Additional notes (optional)" /></label>
    </div>
    <div class="gtb__addrow">
      <button v-if="!showOrg" class="gtb__addreq" @click="showOrg = true"><q-icon name="add_circle" size="22px" /> Add organization name</button>
      <button v-if="!showSpecial" class="gtb__addreq" @click="showSpecial = true"><q-icon name="add_circle" size="22px" /> Add a special request</button>
    </div>

    <!-- teams flow card -->
    <div class="gtb__flow">
      <div class="gtb__bar">
        <span v-if="notHolding">Teams — skipped</span>
        <span v-else>Step {{ view === 'count' ? '1' : '2' }} of 2 — {{ view === 'count' ? 'How many teams?' : 'Select and Add Teams' }}</span>
        <button v-if="!notHolding && view !== 'count'" class="gtb__changecount" @click="view = 'count'">Change Count</button>
      </div>

      <!-- NOT HOLDING after-state -->
      <div v-if="notHolding" class="gtb__panel">
        <div class="gtb__nothold"><q-icon name="info" size="20px" /><div><strong>You're not holding rooms for a team.</strong><p>Guests won't choose a team when booking. You can change this anytime.</p></div></div>
        <button class="gtb__undo" @click="notHolding = false"><q-icon name="arrow_back" size="16px" /> Hold for a team instead</button>
      </div>

      <div v-else class="gtb__panel">
        <!-- COUNT -->
        <template v-if="view === 'count'">
          <h4 class="gtb__qh">How many teams from your organization might share this block?</h4>
          <p class="gtb__qsub">Include every team that might attend — guests will pick from this list when booking so it's important that they can select their specific team. No problem if you add teams that don't end up attending, it's better to add too many than too few.</p>
          <div class="gtb__countrow">
            <div class="gtb__countbox">
              <span class="gtb__countval">{{ expected || '–' }}</span>
              <span class="gtb__spin">
                <button aria-label="Increase" @click="inc"><q-icon name="keyboard_arrow_up" size="16px" /></button>
                <button aria-label="Decrease" :disabled="expected === 0" @click="dec"><q-icon name="keyboard_arrow_down" size="16px" /></button>
              </span>
            </div>
            <span class="gtb__countlabel">Teams</span>
          </div>
          <q-btn unelevated no-caps class="gtb__nextbtn" :class="{ 'is-disabled': expected < 1 }" :tabindex="expected < 1 ? -1 : 0" label="Next: Select & Add Teams →" @click="view = 'list'" />
          <button class="gtb__notholding" @click="notHolding = true">I am not holding for a team</button>
        </template>

        <!-- LIST -->
        <template v-else-if="view === 'list'">
          <div v-if="added.length" class="gtb__added">
            <span class="gtb__added-h">Teams added to block</span>
            <div class="gtb__chips">
              <span v-for="t in added" :key="t" class="gtb__chip">{{ t }}<button aria-label="Remove" @click="removeTeam(t)"><q-icon name="close" size="14px" /></button></span>
            </div>
          </div>

          <div class="gtb__search">
            <q-icon name="search" size="20px" />
            <input v-model="query" placeholder="Search teams" />
            <button v-if="query" aria-label="Clear" @click="query = ''"><q-icon name="close" size="18px" /></button>
          </div>
          <div class="gtb__teamlist">
            <button v-for="t in filtered" :key="t.name" type="button" class="gtb__team" :class="{ 'is-on': t.checked, 'is-disabled': isDisabled(t) }" @click="toggle(t)">
              <span class="gtb__check" :class="{ 'gtb__check--radio': isRadio }">
                <q-icon v-if="t.checked && !isRadio" name="check" size="15px" />
                <span v-else-if="t.checked && isRadio" class="gtb__dot" />
              </span>
              <span class="gtb__teamname">{{ t.name }}</span>
            </button>
            <p v-if="!filtered.length" class="gtb__empty">No teams match “{{ query }}”.</p>
          </div>
          <button class="gtb__addlink" @click="view = 'add'"><q-icon name="add_circle" size="20px" /> Don't see your team in the list? Add them</button>
          <p v-if="teamsErr" class="gtb__errmsg gtb__errmsg--block">{{ teamsErr }}</p>

          <div class="gtb__cardfoot">
            <span v-if="statusText" class="gtb__status"><q-icon name="check_circle" size="16px" /> {{ statusText }}</span>
            <q-btn unelevated no-caps class="gtb__confirm" :class="{ 'is-disabled': !anyChecked }" :tabindex="anyChecked ? 0 : -1" label="Select & add teams" @click="confirmChecked" />
          </div>
        </template>

        <!-- ADD UNLISTED -->
        <template v-else>
          <button class="gtb__back" @click="view = 'list'"><q-icon name="arrow_back" size="20px" /> Add unlisted team</button>
          <div class="gtb__skipnote">Without a team list, guests won't be able to identify which team they're with. Are you sure you want to skip?</div>
          <label class="gtb__field gtb__field--full"><span>Org / Team name</span><input v-model="unlisted.name" placeholder="Team name" /></label>
          <div class="gtb__grid gtb__grid--mt">
            <label class="gtb__field"><span>Age Division *</span>
              <div class="gtb__selectwrap"><select v-model="unlisted.ageDivision"><option value="" disabled>Select</option><option v-for="a in ageDivisions" :key="a" :value="a">{{ a }}</option></select><q-icon name="expand_more" size="18px" /></div>
            </label>
            <label class="gtb__field"><span>Gender *</span>
              <div class="gtb__selectwrap"><select v-model="unlisted.gender"><option value="" disabled>Select</option><option v-for="g in genders" :key="g" :value="g">{{ g }}</option></select><q-icon name="expand_more" size="18px" /></div>
            </label>
          </div>
          <p class="gtb__reqby">Age Division and Gender required by this events organizer</p>
          <q-btn unelevated no-caps class="gtb__addblock" :class="{ 'is-disabled': !unlistedValid }" :tabindex="unlistedValid ? 0 : -1" label="Add to Block" @click="saveUnlisted" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gtb__h { font-size: 1rem; font-weight: 700; color: var(--ds-color-text); margin: 24px 0 12px; }
.gtb__h--first { margin-top: 0; }
.gtb__addrow { display: flex; flex-direction: column; align-items: flex-start; gap: 18px; margin-top: 28px; }
.gtb__addreq { display: inline-flex; align-items: center; gap: 8px; background: none; border: 0; padding: 0; color: var(--ds-color-text); font-weight: 700; font-size: 0.9375rem; cursor: pointer; }
.gtb__addreq:hover { text-decoration: underline; }

.gtb__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.gtb__grid--mt { margin-top: 14px; }
.gtb__field { display: flex; flex-direction: column; gap: 6px; }
.gtb__field--full { grid-column: 1 / -1; }
.gtb__field span { font-size: 0.8125rem; font-weight: 600; color: var(--ds-color-text); }
.gtb__req { color: var(--ds-color-text-danger); font-style: normal; }
.gtb__errmsg { color: var(--ds-color-text-danger); font-size: 0.75rem; font-weight: 500; }
.gtb__errmsg--block { margin: 8px 0 0; }
.gtb input { height: 46px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 0 14px; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); outline: none; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard); width: 100%; }
.gtb input:focus { border-color: var(--ds-color-border-focused); }
.gtb input::placeholder { color: var(--ds-color-text-subtlest); }
.gtb input.is-error { border-color: var(--ds-color-text-danger); }

.gtb__selectwrap { position: relative; display: flex; align-items: center; }
.gtb__selectwrap select { width: 100%; height: 46px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 0 38px 0 14px; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); background: var(--ds-color-surface); outline: none; appearance: none; -webkit-appearance: none; cursor: pointer; }
.gtb__selectwrap select:focus { border-color: var(--ds-color-border-focused); }
.gtb__selectwrap .q-icon { position: absolute; right: 12px; color: var(--ds-color-text-subtle); pointer-events: none; }

/* Teams flow card */
.gtb__flow { border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); overflow: hidden; margin-top: 24px; }
.gtb__bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; background: var(--ds-color-background-brand-bold); color: #fff; padding: 14px 18px; font-weight: 600; }
.gtb__changecount { background: none; border: 0; color: #fff; font-weight: 600; cursor: pointer; }
.gtb__changecount:hover { text-decoration: underline; }
.gtb__panel { padding: 20px; }

/* Count step */
.gtb__qh { font-size: 1.0625rem; font-weight: 700; line-height: 1.25; color: var(--ds-color-text); margin: 0 0 8px; }
.gtb__qsub { color: var(--ds-color-text-subtle); font-size: 0.875rem; line-height: 1.5; margin: 0 0 20px; }
.gtb__countrow { display: flex; align-items: center; gap: 12px; }
.gtb__countbox { display: inline-flex; align-items: stretch; height: 50px; width: 76px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); overflow: hidden; }
.gtb__countval { flex: 1; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.125rem; color: var(--ds-color-text); }
.gtb__spin { display: flex; flex-direction: column; border-left: 1px solid var(--ds-color-border); }
.gtb__spin button { flex: 1; width: 24px; border: 0; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--ds-color-text-subtle); }
.gtb__spin button:first-child { border-bottom: 1px solid var(--ds-color-border); }
.gtb__spin button:hover:not(:disabled) { background: var(--ds-palette-zinc-100); color: var(--ds-color-text); }
.gtb__spin button:disabled { opacity: 0.4; cursor: not-allowed; }
.gtb__countlabel { font-weight: 600; color: var(--ds-color-text); }
.gtb__nextbtn { width: 100%; height: 52px; border-radius: var(--ds-radius-pill); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 0.9375rem; margin-top: 24px; }
.gtb__nextbtn.is-disabled { background: var(--ds-palette-zinc-200); color: var(--ds-color-text-subtlest); pointer-events: none; }
.gtb__notholding { display: block; width: 100%; text-align: center; background: none; border: 0; padding: 16px 0 0; color: var(--ds-color-text-subtle); font-weight: 600; font-size: 0.9375rem; cursor: pointer; }
.gtb__notholding:hover { color: var(--ds-color-text); }

/* List step */
.gtb__added { margin-bottom: 14px; }
.gtb__added-h { font-size: 0.8125rem; font-weight: 700; color: var(--ds-color-text-subtle); }
.gtb__chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.gtb__chip { display: inline-flex; align-items: center; gap: 6px; background: var(--ds-palette-zinc-100); border-radius: var(--ds-radius-pill); padding: 6px 6px 6px 12px; font-size: 0.875rem; font-weight: 500; color: var(--ds-color-text); }
.gtb__chip button { width: 20px; height: 20px; border: 0; border-radius: 50%; background: var(--ds-palette-zinc-200); color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.gtb__search { display: flex; align-items: center; gap: 10px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-pill); padding: 0 14px; height: 46px; color: var(--ds-color-text-subtle); }
.gtb__search input { flex: 1; border: 0; outline: none; background: none; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); height: auto; }
.gtb__search button { border: 0; background: none; color: var(--ds-color-text-subtle); cursor: pointer; display: flex; }
.gtb__teamlist { max-height: 300px; overflow-y: auto; margin-top: 4px; }
.gtb__team { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 4px; border: 0; border-bottom: 1px solid var(--ds-color-border); background: none; text-align: left; cursor: pointer; }
.gtb__team.is-disabled { opacity: 0.45; cursor: not-allowed; }
.gtb__check { width: 22px; height: 22px; flex: none; border: 1.5px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-sm); display: flex; align-items: center; justify-content: center; color: #fff; }
.gtb__check--radio { border-radius: 50%; }
.gtb__team.is-on .gtb__check { background: var(--ds-color-background-brand-bold); border-color: var(--ds-color-background-brand-bold); }
.gtb__team.is-on .gtb__check--radio { background: transparent; }
.gtb__dot { width: 11px; height: 11px; border-radius: 50%; background: var(--ds-color-background-brand-bold); }
.gtb__teamname { color: var(--ds-color-text); }
.gtb__empty { color: var(--ds-color-text-subtle); font-size: 0.875rem; padding: 12px 4px; margin: 0; }
.gtb__addlink { display: inline-flex; align-items: center; gap: 8px; background: none; border: 0; padding: 14px 4px 4px; color: var(--ds-color-text); font-weight: 700; font-size: 0.9375rem; cursor: pointer; }
.gtb__addlink:hover { text-decoration: underline; }
.gtb__cardfoot { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 14px; flex-wrap: wrap; }
.gtb__status { display: inline-flex; align-items: center; gap: 6px; color: var(--ds-color-text-success); font-weight: 600; font-size: 0.875rem; }
.gtb__confirm { height: 44px; padding: 0 22px; border-radius: var(--ds-radius-pill); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 600; }
.gtb__confirm.is-disabled { background: var(--ds-palette-zinc-200); color: var(--ds-color-text-subtlest); pointer-events: none; }

/* Add unlisted */
.gtb__back { display: inline-flex; align-items: center; gap: 8px; background: none; border: 0; padding: 0 0 14px; color: var(--ds-color-text); font-weight: 700; font-size: 1.0625rem; cursor: pointer; }
.gtb__skipnote { background: var(--ds-color-background-info); color: var(--ds-palette-blue-700); border-radius: var(--ds-radius-md); padding: 12px 14px; font-size: 0.875rem; line-height: 1.45; margin-bottom: 16px; }
.gtb__reqby { text-align: center; color: var(--ds-color-text-subtle); font-size: 0.8125rem; margin: 14px 0 0; }
.gtb__addblock { width: 100%; height: 52px; border-radius: var(--ds-radius-pill); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 1rem; margin-top: 16px; }
.gtb__addblock.is-disabled { background: var(--ds-palette-zinc-200); color: var(--ds-color-text-subtlest); pointer-events: none; }

/* Not-holding after-state */
.gtb__nothold { display: flex; align-items: flex-start; gap: 12px; color: var(--ds-color-text); }
.gtb__nothold .q-icon { color: var(--ds-color-text-subtle); flex: none; margin-top: 2px; }
.gtb__nothold strong { display: block; font-size: 0.9375rem; }
.gtb__nothold p { margin: 4px 0 0; color: var(--ds-color-text-subtle); font-size: 0.875rem; line-height: 1.45; }
.gtb__undo { display: inline-flex; align-items: center; gap: 6px; margin-top: 16px; background: none; border: 0; padding: 0; color: var(--ds-color-text); font-weight: 700; font-size: 0.9375rem; cursor: pointer; }
.gtb__undo:hover { text-decoration: underline; }
</style>

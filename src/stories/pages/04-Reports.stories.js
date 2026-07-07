/** PAGES / 04 Reports → action-card list archetype, recreated from production. */
import { page } from './_shell'

export default { title: 'Pages/04 Reports', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

const reports = [
  { title: 'Company Event Results Report', desc: 'This fully detailed report includes the list of events with valuable information like: reservations details, income details, expenses, contracting and more.' },
  { title: 'Earned Comp Rooms Report', desc: 'This report calculates the number of earned comp rooms at the hotels for each event.' },
  { title: 'Event Hotel Cutoff Dates Report', desc: 'This report allows users to view event hotels across events with hotel cut-off dates, initial user access granted date and number of reservations awaiting hotel confirmation numbers.' },
  { title: 'Event Results Report', desc: 'This report should be used post event to review final metrics of event performance.' },
  { title: 'Master Event Report', desc: 'This report shows all events commencing during the date range selected with key operational dates highlighted.' },
]

export const Reports = page({
  active: 'reports',
  setup: () => ({ reports }),
  slot: `
    <div style="padding:28px 28px 40px;">
      <h1 style="margin:0 0 24px; font-size:1.5rem; font-weight:700; color:var(--ds-color-text);">Reports</h1>
      <div class="column q-gutter-md">
        <div v-for="r in reports" :key="r.title"
          style="display:flex; align-items:center; gap:20px; padding:24px 28px; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
          <q-icon name="insights" size="40px" color="primary" style="flex:none;" />
          <div style="flex:1; min-width:0;">
            <div style="font-size:1.25rem; font-weight:700; color:var(--ds-color-text); margin-bottom:4px;">{{ r.title }}</div>
            <div style="color:var(--ds-color-text-subtle); line-height:1.5;">{{ r.desc }}</div>
          </div>
          <q-btn unelevated no-caps color="primary" label="View Report" style="flex:none;" />
        </div>
      </div>
    </div>`,
})

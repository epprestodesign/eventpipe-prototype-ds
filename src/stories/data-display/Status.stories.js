/** COMPONENTS / Feedback & Status / Status → DsStatus.vue (dot + pill). */
import DsStatus from '../../components/DsStatus.vue'

export default {
  title: 'Components/Feedback & Status/Status',
  component: DsStatus,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
A status indicator. \`variant="dot"\` (colored dot + label, for table cells) or
\`variant="pill"\` (soft filled pill, for cards). Tone auto-derives from common
status words (Active → success, Pending → warning, Cancelled/Expired → danger).
` } } },
  argTypes: { variant: { control: 'select', options: ['dot', 'pill'] }, tone: { control: 'select', options: ['', 'success', 'warning', 'danger', 'info', 'neutral'] } },
  args: { label: 'Active', variant: 'dot' },
}

export const Default = { render: (args) => ({ components: { DsStatus }, setup: () => ({ args }), template: `<ds-status v-bind="args" />` }) }

export const Dots = {
  render: () => ({ components: { DsStatus }, template: `
    <div class="column q-gutter-sm">
      <ds-status label="Active" /><ds-status label="Pending" /><ds-status label="Inactive" />
      <ds-status label="Invitation Expired" /><ds-status label="Cancelled" />
    </div>` }),
}

export const Pills = {
  render: () => ({ components: { DsStatus }, template: `
    <div class="row q-gutter-sm">
      <ds-status variant="pill" label="Active" /><ds-status variant="pill" label="Pending" />
      <ds-status variant="pill" label="Inactive" /><ds-status variant="pill" label="Cancelled" />
    </div>` }),
}

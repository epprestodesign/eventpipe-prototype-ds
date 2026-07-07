/** DATA DISPLAY / Icon → Quasar: QIcon (native). See Foundations/Icons for the system. */
export default {
  title: 'Components/Media & Visuals/Icon',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Renders a single icon. For the icon **system** (sets, sizing rules) see
**Foundations / Icons**; this page is the component usage.

## Quasar mapping
\`Icon → QIcon\` (native).
` } } },
}
export const Basic = {
  render: () => ({ template: `<q-icon name="hotel" size="32px" color="primary" />` }),
}
export const ColorsAndSizes = {
  render: () => ({ template: `
    <div class="q-gutter-md row items-center">
      <q-icon name="favorite" color="negative" size="2rem" />
      <q-icon name="bolt" color="warning" size="2rem" />
      <q-icon name="cloud" color="info" size="2rem" />
      <q-icon name="settings" color="primary" size="2rem" />
    </div>` }),
}

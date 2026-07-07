/** APPLICATION COMPONENTS / Loading Indicator → QSpinner + inline loading states. */
export default {
  title: 'Components/Feedback & Status/Loading Indicator',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
Signals in-progress work — spinners for indeterminate waits and inline
button/page loading. For content placeholders use **Skeleton**.
` } } },
}

export const Spinners = {
  render: () => ({ template: `
    <div class="row items-center q-gutter-xl">
      <q-spinner color="primary" size="32px" />
      <q-spinner-dots color="primary" size="40px" />
      <q-spinner-gears color="primary" size="36px" />
      <q-spinner-ball color="primary" size="36px" />
    </div>` }),
}

export const Sizes = {
  render: () => ({ template: `
    <div class="row items-center q-gutter-xl">
      <q-spinner color="primary" size="16px" />
      <q-spinner color="primary" size="24px" />
      <q-spinner color="primary" size="40px" />
      <q-spinner color="primary" size="64px" />
    </div>` }),
}

export const InButtonAndPage = {
  render: () => ({ template: `
    <div class="column q-gutter-lg">
      <div class="row q-gutter-sm">
        <q-btn color="primary" no-caps loading label="Saving" />
        <q-btn outline color="primary" no-caps loading label="Loading" />
      </div>
      <div class="row items-center q-gutter-sm text-grey-7" style="padding:24px; border:1px solid var(--ds-color-border); border-radius:var(--ds-radius-lg); max-width:360px; justify-content:center;">
        <q-spinner color="primary" size="24px" /> Loading requests…
      </div>
    </div>` }),
}

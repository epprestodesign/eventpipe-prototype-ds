// DATA DISPLAY / List Item — the standard row (leading + title/subtitle + trailing).
import DsListItem from '../../components/DsListItem.vue'
import DsRating from '../../components/DsRating.vue'

export default {
  title: 'Components/Layout & Structure/List Item',
  component: DsListItem,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    icon: { control: 'text' },
    chevron: { control: 'boolean' },
    bordered: { control: 'boolean' },
    clickable: { control: 'boolean' },
    iconTone: { control: 'inline-radio', options: ['neutral', 'brand'] },
  },
  args: { title: 'Payment methods', subtitle: 'View saved payment methods', icon: 'credit_card', chevron: true, bordered: true, clickable: true, iconTone: 'neutral' },
  parameters: { docs: { description: { component: `
## Overview
**List Item** is the standard row used across the account menu, saved items,
payment methods, help, and more — a leading **icon / thumbnail / avatar**, a
**title + subtitle**, and a **trailing** area (chevron, action, toggle).

- \`bordered\` — card row (default) vs a flush list row.
- \`clickable\` — adds a hover affordance and emits \`click\`.
- Slots: \`leading\`, \`title\`, \`subtitle\`, \`trailing\`, default.

\`\`\`html
<ds-list-item title="Payment methods" subtitle="View saved cards" icon="credit_card" chevron clickable />
\`\`\`
` } } },
}

export const Basic = {
  render: (args) => ({ components: { DsListItem }, setup: () => ({ args }), template: `<div style="max-width:440px"><ds-list-item v-bind="args" /></div>` }),
}

/** An account-style menu built from rows. */
export const Menu = {
  render: () => ({
    components: { DsListItem },
    template: `
      <div style="max-width:440px;display:flex;flex-direction:column;gap:10px">
        <ds-list-item title="Profile" subtitle="Your personal details and travel documents" icon="person" chevron clickable />
        <ds-list-item title="Communications" subtitle="Control which notifications you get" icon="mail" chevron clickable />
        <ds-list-item title="Payment methods" subtitle="View saved payment methods" icon="credit_card" chevron clickable />
        <ds-list-item title="Security and settings" subtitle="Update your email or password" icon="settings" chevron clickable />
      </div>`,
  }),
}

/** With a thumbnail + a trailing rating (saved-items style). */
export const WithThumbnailAndTrailing = {
  name: 'Thumbnail + trailing',
  render: () => ({
    components: { DsListItem, DsRating },
    setup: () => ({ img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=70' }),
    template: `
      <div style="max-width:440px">
        <ds-list-item title="Hampton Inn Boston-Logan" :image="img">
          <template #subtitle><ds-rating :score="3.8" :max="5" :reviews="3254" size="sm" /></template>
          <template #trailing><q-icon name="star" size="20px" style="color:var(--ds-color-background-brand-bold)" /></template>
        </ds-list-item>
      </div>`,
  }),
}

/** Flush rows (no border) for dense lists. */
export const Flush = {
  render: () => ({
    components: { DsListItem },
    template: `
      <div style="max-width:440px;border:1px solid var(--ds-color-border);border-radius:var(--ds-radius-lg);padding:4px 16px">
        <ds-list-item :bordered="false" title="Chat now" icon="forum" chevron clickable />
        <ds-list-item :bordered="false" title="Visit the Help Center" icon="help_outline" chevron clickable />
        <ds-list-item :bordered="false" title="Share your feedback" icon="rate_review" chevron clickable />
      </div>`,
  }),
}

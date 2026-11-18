/**
 * FOUNDATIONS / Typography (the scale & tokens)
 * Companion to "Data Display / Typography" (which shows applying it).
 * Quasar has no Typography component — classes + tokens (typography.scss).
 */
const meta = {
  id: 'foundations-typography', title: 'Design System/Foundations/Typography',
  // The Docs page is the hand-written MDX beside this file, not autodocs.
  tags: [],
  parameters: {
    docs: {
      description: {
        component: `
## Overview
The type system: one font, a fixed scale, tokenized weights. Defined in
\`src/css/typography.scss\` and applied with classes. See
**Data Display / Typography** for usage patterns.

## Family
\`--ds-font-family: 'Inter', system-ui, …\` (set via \`$typography-font-family\`).

## Scale
| Class | Role |
| --- | --- |
| \`.text-display\` | hero headline (DS token) |
| \`.text-h1\`…\`.text-h6\` | headings |
| \`.text-lead\` | intro paragraph (DS token) |
| \`.text-subtitle1/2\` | section subtitles |
| \`.text-body1/2\` | body copy |
| \`.text-caption\` | helper / metadata |
| \`.text-overline\` | eyebrow labels |

## Weights
\`.text-weight-{light,regular,medium,bold}\` → tokens \`--ds-font-weight-*\`.
`,
      },
    },
  },
}
export default meta

export const Scale = {
  render: () => ({
    template: `
      <div class="column q-gutter-sm" style="max-width:720px">
        <div class="text-display">Display</div>
        <div class="text-h1">Heading 1</div>
        <div class="text-h3">Heading 3</div>
        <div class="text-h5">Heading 5</div>
        <div class="text-subtitle1">Subtitle 1</div>
        <div class="text-body1">Body 1 — default paragraph size.</div>
        <div class="text-caption">Caption — helper text.</div>
        <div class="text-overline">OVERLINE</div>
      </div>`,
  }),
}

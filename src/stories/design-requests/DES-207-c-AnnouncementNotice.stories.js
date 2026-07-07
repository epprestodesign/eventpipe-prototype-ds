/** DES-207 / Components / Announcement Notice → info notice (library + tokens only). */
export default {
  title: 'Design Requests/🟢 DES-207 Communications | Email Template Editor/Components/Announcement Notice',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'The temporary "new section" announcement — an info notice using the DS info tokens. Icon is top-aligned with the heading. Dismissible. Rolls out day one, removed later.' } } },
}

export const Notice = {
  render: () => ({
    template: `
      <div style="max-width:900px; display:flex; align-items:flex-start; gap:12px; padding:16px 20px;
        background:var(--ds-color-background-info); border:1px solid var(--ds-color-background-info-bold); border-radius:var(--ds-radius-md);">
        <q-icon name="info" color="primary" size="22px" style="margin-top:1px; flex:none;" />
        <div style="flex:1; min-width:0;">
          <div class="text-weight-bold text-grey-9">New notification section</div>
          <div class="text-grey-8" style="margin-top:2px;">For day one, this section only supports <b>Teams Management</b> notifications. Over time, more email templates from across the system will come online here.</div>
        </div>
        <q-btn flat no-caps color="primary" label="Dismiss" style="flex:none; align-self:center;" />
      </div>`,
  }),
}

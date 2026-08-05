/** Teams Mgmt Comms Phase 2 / Components / Personalization Menu → DsPersonalizationMenu.vue. */
import { ref, computed } from 'vue'
import DsPersonalizationMenu from './components/DsPersonalizationMenu.vue'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/Components/Personalization Menu',
  component: DsPersonalizationMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered', docs: { description: { component: `
The searchable, grouped merge-field picker. Reused by the editor toolbar
**Personalization** button and by the inline **\`{{\`** trigger (typing \`{{\` in the
Text Formatter pops this at the caret). Emits \`select\` with the token key
(e.g. \`event_name\`), which the editor wraps as \`{{event_name}}\`.

Carries the **Teams Management** merge fields from
[DES-430 (P0-6)](https://linear.app/eventpipe/issue/DES-430/p0-6-email-template-variables-merge-fields)
— 23 fields in 5 groups. Each row shows the human label, the literal token that
gets inserted, and what it returns. Search matches label, token, and description.

Pass a \`tokens\` array to override the list.
` } } },
}

export const Menu = {
  render: () => ({
    components: { DsPersonalizationMenu },
    setup: () => {
      const picked = ref('')
      // Built here, not in the template: a literal `{{` inside an interpolation
      // closes the delimiter early and fails to compile.
      const inserts = computed(() => (picked.value ? '{' + '{' + picked.value + '}' + '}' : '—'))
      return { picked, inserts }
    },
    template: `
      <div class="column q-gutter-md items-center">
        <div style="border:1px solid var(--ds-color-border); border-radius:var(--ds-radius-md); box-shadow:var(--ds-shadow-2);">
          <ds-personalization-menu @select="(t) => (picked = t)" />
        </div>
        <div class="text-grey-7">Inserts: <span class="text-weight-bold text-primary">{{ inserts }}</span></div>
      </div>`,
  }),
}

<script setup>
/* Av2EmailFrame — one auth email, as the recipient receives it.
 *
 * A faithful reproduction of the Teams Mgmt Comms Phase 2 email frame
 * (`emailPaper` in design-requests/teams-mgmt-comms-phase-2/_tmc2email.js):
 * the same paper (surface, container border, lg radius, card shadow), the same
 * sunken envelope band with a From / To / Subject grid, the logo at the top of
 * the body, and a hairline-ruled footer in subtle text. Same family, so the
 * auth emails and the team comms read as one product's mail.
 *
 * Reproduced rather than imported because `emailPaper` is a template string
 * wired to TMC2's own setup keys (bodyLines, company, eventName) and only
 * renders plain paragraphs — these emails need a code block, fact rows and a
 * button. Both are candidates for one shared DS email component.
 *
 * Two additions over TMC2, both envelope data rather than design:
 *   · a Sent row, because every one of these emails is about something that
 *     happened at a specific time;
 *   · the footer carries the anti-phishing line in place of TMC2's
 *     "Sent by {company} for {event}", since there is no event here.
 *
 * The logo is the EventPipe SVG from src/assets/logo. The real mailer should
 * send a PNG of the same mark — Gmail and Outlook do not render SVG.
 */
import logo from '../../../assets/logo/eventpipe-logo.svg'

defineProps({
  from: { type: String, required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  sent: { type: String, default: '' },
})
</script>

<template>
  <article class="av2em">
    <header class="av2em__envelope">
      <dl class="av2em__meta">
        <dt>From</dt><dd>{{ from }}</dd>
        <dt>To</dt><dd>{{ to }}</dd>
        <template v-if="sent"><dt>Sent</dt><dd>{{ sent }}</dd></template>
        <dt>Subject</dt><dd class="av2em__subject">{{ subject }}</dd>
      </dl>
    </header>

    <div class="av2em__body">
      <img :src="logo" alt="EventPipe" class="av2em__logo" />
      <slot />
      <footer class="av2em__foot">
        <slot name="footer">
          This is an automated security email about your EventPipe account, so you
          can't unsubscribe from it. EventPipe will never ask you for your password
          or a sign-in code — not by email, phone or chat.
        </slot>
      </footer>
    </div>
  </article>
</template>

<style scoped>
.av2em {
  background: var(--ds-color-surface);
  border: 1px solid var(--ds-color-border-container);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-card);
  overflow: hidden;
  color: var(--ds-color-text);
}
.av2em__envelope {
  padding: 18px 24px;
  border-bottom: 1px solid var(--ds-color-border-container);
  background: var(--ds-color-surface-sunken);
}
.av2em__meta {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 6px 12px;
  margin: 0;
  font-size: 0.8125rem;
}
.av2em__meta dt { color: var(--ds-color-text-subtle); }
.av2em__meta dd { margin: 0; color: var(--ds-color-text); }
.av2em__subject { font-weight: 700; }

.av2em__body { padding: 28px 32px 32px; }
.av2em__logo { display: block; height: 30px; width: auto; margin-bottom: 22px; }

/* Body copy inside the slot — the same 1.6 rhythm and 14px paragraph gap as
   TMC2's email body. */
.av2em__body :slotted(p) { margin: 0 0 14px; line-height: 1.6; color: var(--ds-color-text); }
.av2em__body :slotted(a) { color: var(--ds-color-link); }

.av2em__foot {
  margin-top: 26px;
  padding-top: 16px;
  border-top: 1px solid var(--ds-color-border-container);
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--ds-color-text-subtle);
}
</style>

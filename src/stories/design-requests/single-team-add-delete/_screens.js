/** Single-Team Add and Delete — shared helpers for the Screens stories.
 *  (Each story file writes its own literal default export: Storybook's indexer
 *  requires a literal title and string-literal tags.) */
import StdPrototype from './components/StdPrototype.vue'
import { ticketLine } from './_std'

/** A screen = the prototype opened on one review state, without the review bar. */
export const screen = (args) => ({
  args: { review: false, ...args },
  render: (a) => ({ components: { StdPrototype }, setup: () => ({ a }), template: '<std-prototype v-bind="a" />' }),
})

/** Docs description: the screen's text, then its ticket links. */
export const docText = (text, ...keys) => `${text}\n\n${ticketLine(...keys)}`

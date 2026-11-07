/** Single-Team Add and Delete — shared helpers for the Components stories.
 *  (Each story file writes its own literal default export: Storybook's indexer
 *  requires a literal title and string-literal tags.) */
import { ticketLine } from './_std'

export { ticketDecorator } from './_std'

/** Docs description: the component's text, then its ticket links. */
export const docText = (text, ...keys) => `${text}\n\n${ticketLine(...keys)}`

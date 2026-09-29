/** EP Pay · Disputes — the dispute fixture and the pure logic that narrows it.
 *
 *  One list, 48 disputes received in the last 12 months (Sep 1, 2025 – Aug 31,
 *  2026). Everything the Disputes screen shows is computed from it — the
 *  status cards, the summary, the Dispute By bar, the monthly volume, the
 *  ratio concept and the queue — so no figure on the screen can disagree with
 *  another. The screen's hand-typed totals (34 disputes / $53,455.35) were
 *  retired with this file; the old numbers could not be reconciled with the
 *  19 rows that were actually on screen (Pending, Won and Lost each listed
 *  fewer rows than their card counted).
 *
 *  SEED_ROWS are the 19 rows the screen shipped with, byte-for-byte. Two of
 *  them are referenced elsewhere and must stay put:
 *    - DSP-52721 ↔ TXN-2026-15993 (EP-04 Transactions, the "Disputed" Noah
 *      Klein Klarna row, $730.00, Pricing Event 539073)
 *    - DSP-52173 ↔ TXN-2026-15369 (EP-08 Customers, Elena Fischer's disputed
 *      $1,119.00 Klarna payment, Pricing Event 539073)
 *  ADDED_ROWS (29) were generated once by a seeded script (mulberry32, seed
 *  20260929) and pasted in as literals, so they are deterministic and
 *  grep-able: no Math.random at runtime. Their shape follows the queue's
 *  logic — Evidence Needed only in the last week, Pending in Jun–Aug, Won and
 *  Lost resolved 18–24 days after the dispute and before AS_OF.
 *
 *  `event` is new on every row. The seed rows get theirs from EVENT_BY_ID so
 *  the seed literals stay exactly as they were.
 */

/** The fixture's "today". The EP Pay account is frozen at the end of August
 *  2026 (the dashboard reads Aug 20; the latest dispute is Aug 28), so the
 *  date presets count back from here rather than from the real clock — a
 *  prototype that silently empties itself next month is no use to anyone. */
export const AS_OF = '2026-08-31'

/** The first day the fixture covers. Nothing before it is known — not "zero
 *  disputes", just no record — so a comparison window that reaches back past
 *  it is reported as missing (null), never as 0. */
export const DATA_START = '2025-09-01'

export const DISPUTE_STATUSES = ['Evidence Needed', 'Pending', 'Won', 'Lost']
export const DISPUTE_BRANDS = ['Visa', 'Mastercard', 'Discover', 'Amex', 'PayPal', 'Klarna']
export const DISPUTE_REASONS = ['Fraudulent', 'Product not received', 'Duplicate charge', 'Credit not processed', 'Subscription canceled', 'Product unacceptable']
export const DISPUTE_KINDS = ['Chargeback', 'Inquiry', 'Retrieval']
export const DISPUTE_EVENTS = ['Automated Playwright Live Event 340366', 'Pricing Event 539073', 'Pricing Event 637236']

/* The rows the screen shipped with — unchanged. */
const SEED_ROWS = [
  { status: 'Evidence Needed', id: 'DSP-52721', dateTop: 'Disputed: Aug 20, 2026', dateSub: 'Evidence due: Aug 30, 2026', amount: '$730.00', ofAmount: 'of $730.00', customer: 'Noah Klein', brand: 'Klarna', last4: '2914', txn: 'TXN-2026-15993', txnDate: 'Aug 20, 2026', kind: 'Retrieval', reason: 'Subscription canceled' },
  { status: 'Evidence Needed', id: 'DSP-52173', dateTop: 'Disputed: Aug 8, 2026', dateSub: 'Evidence due: Aug 18, 2026', amount: '$671.40', ofAmount: 'of $1,119.00', customer: 'Elena Fischer', brand: 'Klarna', last4: '2914', txn: 'TXN-2026-15369', txnDate: 'Jul 27, 2026', kind: 'Chargeback', reason: 'Credit not processed' },
  { status: 'Evidence Needed', id: 'DSP-50118', dateTop: 'Disputed: Apr 10, 2026', dateSub: 'Evidence due: Apr 20, 2026', amount: '$3,003.67', ofAmount: 'of $3,856.67', customer: 'Maya Sorensen', brand: 'Discover', last4: '7076', txn: 'TXN-244454', txnDate: 'Mar 20, 2026', kind: 'Chargeback', reason: 'Duplicate charge' },
  { status: 'Evidence Needed', id: 'DSP-49707', dateTop: 'Disputed: Mar 22, 2026', dateSub: 'Evidence due: Apr 1, 2026', amount: '$1,320.00', ofAmount: 'of $1,320.00', customer: 'Jamal Rivers', brand: 'Visa', last4: '1606', txn: 'TXN-243521', txnDate: 'Mar 16, 2026', kind: 'Chargeback', reason: 'Credit not processed' },
  { status: 'Evidence Needed', id: 'DSP-51625', dateTop: 'Disputed: Mar 22, 2026', dateSub: 'Evidence due: Apr 1, 2026', amount: '$471.00', ofAmount: 'of $471.00', customer: 'Elena Fischer', brand: 'Mastercard', last4: '4508', txn: 'TXN-2026-11963', txnDate: 'Mar 18, 2026', kind: 'Inquiry', reason: 'Fraudulent' },
  { status: 'Evidence Needed', id: 'DSP-51214', dateTop: 'Disputed: Mar 4, 2026', dateSub: 'Evidence due: Mar 14, 2026', amount: '$739.00', ofAmount: 'of $739.00', customer: 'Hannah Reyes', brand: 'Visa', last4: '4242', txn: 'TXN-2026-11248', txnDate: 'Feb 19, 2026', kind: 'Inquiry', reason: 'Product unacceptable' },
  { status: 'Evidence Needed', id: 'DSP-49159', dateTop: 'Disputed: Feb 25, 2026', dateSub: 'Evidence due: Mar 7, 2026', amount: '$1,876.44', ofAmount: 'of $1,932.44', customer: 'Ben Castellano', brand: 'Visa', last4: '9311', txn: 'TXN-242277', txnDate: 'Feb 15, 2026', kind: 'Inquiry', reason: 'Fraudulent' },
  { status: 'Evidence Needed', id: 'DSP-48611', dateTop: 'Disputed: Jan 31, 2026', dateSub: 'Evidence due: Feb 10, 2026', amount: '$2,432.88', ofAmount: 'of $2,804.88', customer: 'Tom Okada', brand: 'Visa', last4: '8017', txn: 'TXN-241033', txnDate: 'Jan 17, 2026', kind: 'Retrieval', reason: 'Subscription canceled' },
  { status: 'Evidence Needed', id: 'DSP-50666', dateTop: 'Disputed: Jan 19, 2026', dateSub: 'Evidence due: Jan 29, 2026', amount: '$2,462.00', ofAmount: 'of $2,462.00', customer: 'Marcus Webb', brand: 'Visa', last4: '4242', txn: 'TXN-2026-10312', txnDate: 'Jan 14, 2026', kind: 'Retrieval', reason: 'Product not received' },
  { status: 'Evidence Needed', id: 'DSP-48200', dateTop: 'Disputed: Jan 12, 2026', dateSub: 'Evidence due: Jan 22, 2026', amount: '$749.21', ofAmount: 'of $908.21', customer: 'Elena Fischer', brand: 'Mastercard', last4: '2547', txn: 'TXN-240100', txnDate: 'Dec 20, 2025', kind: 'Retrieval', reason: 'Product not received' },
  { status: 'Pending', id: 'DSP-52890', dateTop: 'Disputed: Aug 24, 2026', dateSub: 'Evidence submitted: Aug 26, 2026', amount: '$1,204.55', ofAmount: 'of $1,204.55', customer: 'Priya Raman', brand: 'Amex', last4: '3315', txn: 'TXN-2026-16104', txnDate: 'Aug 11, 2026', kind: 'Chargeback', reason: 'Fraudulent' },
  { status: 'Pending', id: 'DSP-52744', dateTop: 'Disputed: Aug 21, 2026', dateSub: 'Evidence submitted: Aug 23, 2026', amount: '$3,410.90', ofAmount: 'of $3,410.90', customer: 'Owen Marsh', brand: 'Visa', last4: '6620', txn: 'TXN-2026-16022', txnDate: 'Aug 4, 2026', kind: 'Chargeback', reason: 'Product not received' },
  { status: 'Pending', id: 'DSP-52410', dateTop: 'Disputed: Aug 12, 2026', dateSub: 'Evidence submitted: Aug 14, 2026', amount: '$885.00', ofAmount: 'of $885.00', customer: 'Lena Fischer', brand: 'Mastercard', last4: '4508', txn: 'TXN-2026-15782', txnDate: 'Jul 30, 2026', kind: 'Inquiry', reason: 'Duplicate charge' },
  { status: 'Won', id: 'DSP-51988', dateTop: 'Disputed: Jul 2, 2026', dateSub: 'Won: Jul 24, 2026', amount: '$2,150.00', ofAmount: 'of $2,150.00', customer: 'Grace Lindqvist', brand: 'Visa', last4: '1188', txn: 'TXN-2026-14310', txnDate: 'Jun 18, 2026', kind: 'Chargeback', reason: 'Product not received' },
  { status: 'Won', id: 'DSP-51640', dateTop: 'Disputed: Jun 14, 2026', dateSub: 'Won: Jul 3, 2026', amount: '$640.25', ofAmount: 'of $640.25', customer: 'Andre Soto', brand: 'Discover', last4: '7076', txn: 'TXN-2026-13877', txnDate: 'Jun 2, 2026', kind: 'Inquiry', reason: 'Credit not processed' },
  { status: 'Won', id: 'DSP-51203', dateTop: 'Disputed: May 28, 2026', dateSub: 'Won: Jun 15, 2026', amount: '$1,975.40', ofAmount: 'of $2,110.40', customer: 'Hannah Reyes', brand: 'Visa', last4: '4242', txn: 'TXN-2026-13204', txnDate: 'May 9, 2026', kind: 'Chargeback', reason: 'Fraudulent' },
  { status: 'Lost', id: 'DSP-50902', dateTop: 'Disputed: May 4, 2026', dateSub: 'Lost: May 26, 2026', amount: '$1,488.00', ofAmount: 'of $1,488.00', customer: 'Diego Ramirez', brand: 'PayPal', last4: '8830', txn: 'TXN-2026-12551', txnDate: 'Apr 22, 2026', kind: 'Chargeback', reason: 'Fraudulent' },
  { status: 'Lost', id: 'DSP-50477', dateTop: 'Disputed: Apr 18, 2026', dateSub: 'Lost: May 9, 2026', amount: '$920.60', ofAmount: 'of $920.60', customer: 'Tom Okada', brand: 'Visa', last4: '8017', txn: 'TXN-2026-12088', txnDate: 'Apr 3, 2026', kind: 'Chargeback', reason: 'Duplicate charge' },
  { status: 'Lost', id: 'DSP-49845', dateTop: 'Disputed: Mar 9, 2026', dateSub: 'Lost: Mar 30, 2026', amount: '$3,268.10', ofAmount: 'of $3,268.10', customer: 'Maya Sorensen', brand: 'Amex', last4: '3315', txn: 'TXN-2026-11402', txnDate: 'Feb 24, 2026', kind: 'Retrieval', reason: 'Subscription canceled' },
]

/** Events for the seed rows (the seed literals have no `event` field). */
const EVENT_BY_ID = {
  'DSP-52721': 'Pricing Event 539073', // = TXN-2026-15993 in EP-04 Transactions
  'DSP-52173': 'Pricing Event 539073', // = TXN-2026-15369 in EP-08 Customers
  'DSP-50118': 'Automated Playwright Live Event 340366',
  'DSP-49707': 'Pricing Event 637236',
  'DSP-51625': 'Pricing Event 539073',
  'DSP-51214': 'Automated Playwright Live Event 340366',
  'DSP-49159': 'Pricing Event 539073',
  'DSP-48611': 'Pricing Event 637236',
  'DSP-50666': 'Automated Playwright Live Event 340366',
  'DSP-48200': 'Pricing Event 539073',
  'DSP-52890': 'Pricing Event 637236',
  'DSP-52744': 'Automated Playwright Live Event 340366',
  'DSP-52410': 'Pricing Event 539073',
  'DSP-51988': 'Automated Playwright Live Event 340366',
  'DSP-51640': 'Pricing Event 637236',
  'DSP-51203': 'Pricing Event 539073',
  'DSP-50902': 'Automated Playwright Live Event 340366',
  'DSP-50477': 'Pricing Event 539073',
  'DSP-49845': 'Pricing Event 637236',
}

/* Generated once (see the header), pasted as literals. */
const ADDED_ROWS = [
  { status: 'Evidence Needed', id: 'DSP-53057', dateTop: 'Disputed: Aug 26, 2026', dateSub: 'Evidence due: Sep 5, 2026', amount: '$1,527.95', ofAmount: 'of $1,527.95', customer: 'Sofia Moretti', brand: 'Mastercard', last4: '7741', txn: 'TXN-2026-15873', txnDate: 'Aug 10, 2026', kind: 'Chargeback', reason: 'Fraudulent', event: 'Pricing Event 539073' },
  { status: 'Evidence Needed', id: 'DSP-53082', dateTop: 'Disputed: Aug 28, 2026', dateSub: 'Evidence due: Sep 7, 2026', amount: '$300.66', ofAmount: 'of $300.66', customer: 'Priya Raman', brand: 'Amex', last4: '3315', txn: 'TXN-2026-16091', txnDate: 'Aug 18, 2026', kind: 'Retrieval', reason: 'Product not received', event: 'Pricing Event 539073' },
  { status: 'Pending', id: 'DSP-51747', dateTop: 'Disputed: Jun 22, 2026', dateSub: 'Evidence submitted: Jun 26, 2026', amount: '$3,521.51', ofAmount: 'of $3,676.92', customer: 'Liam Patel', brand: 'Visa', last4: '3056', txn: 'TXN-2026-14168', txnDate: 'Jun 8, 2026', kind: 'Inquiry', reason: 'Fraudulent', event: 'Pricing Event 539073' },
  { status: 'Pending', id: 'DSP-52240', dateTop: 'Disputed: Jul 17, 2026', dateSub: 'Evidence submitted: Jul 19, 2026', amount: '$3,069.75', ofAmount: 'of $3,069.75', customer: 'Jamal Rivers', brand: 'Visa', last4: '1606', txn: 'TXN-2026-14902', txnDate: 'Jul 5, 2026', kind: 'Inquiry', reason: 'Fraudulent', event: 'Pricing Event 539073' },
  { status: 'Pending', id: 'DSP-52475', dateTop: 'Disputed: Jul 28, 2026', dateSub: 'Evidence submitted: Aug 1, 2026', amount: '$3,825.48', ofAmount: 'of $3,997.65', customer: 'Maya Sorensen', brand: 'Discover', last4: '7076', txn: 'TXN-2026-15314', txnDate: 'Jul 20, 2026', kind: 'Chargeback', reason: 'Fraudulent', event: 'Automated Playwright Live Event 340366' },
  { status: 'Pending', id: 'DSP-52581', dateTop: 'Disputed: Aug 3, 2026', dateSub: 'Evidence submitted: Aug 7, 2026', amount: '$921.00', ofAmount: 'of $921.00', customer: 'Grace Lindqvist', brand: 'Visa', last4: '1188', txn: 'TXN-2026-15146', txnDate: 'Jul 14, 2026', kind: 'Chargeback', reason: 'Product unacceptable', event: 'Automated Playwright Live Event 340366' },
  { status: 'Pending', id: 'DSP-52820', dateTop: 'Disputed: Aug 15, 2026', dateSub: 'Evidence submitted: Aug 18, 2026', amount: '$1,979.63', ofAmount: 'of $2,434.03', customer: 'Liam Patel', brand: 'Visa', last4: '3056', txn: 'TXN-2026-15771', txnDate: 'Aug 6, 2026', kind: 'Inquiry', reason: 'Subscription canceled', event: 'Pricing Event 637236' },
  { status: 'Pending', id: 'DSP-52886', dateTop: 'Disputed: Aug 18, 2026', dateSub: 'Evidence submitted: Aug 20, 2026', amount: '$308.20', ofAmount: 'of $308.20', customer: 'Maya Sorensen', brand: 'Amex', last4: '3315', txn: 'TXN-2026-15587', txnDate: 'Jul 30, 2026', kind: 'Chargeback', reason: 'Fraudulent', event: 'Pricing Event 539073' },
  { status: 'Won', id: 'DSP-45945', dateTop: 'Disputed: Sep 5, 2025', dateSub: 'Won: Sep 24, 2025', amount: '$1,888.13', ofAmount: 'of $1,888.13', customer: 'Chris Okonkwo', brand: 'Mastercard', last4: '5309', txn: 'TXN-2025-05049', txnDate: 'Aug 28, 2025', kind: 'Inquiry', reason: 'Fraudulent', event: 'Pricing Event 539073' },
  { status: 'Won', id: 'DSP-46391', dateTop: 'Disputed: Sep 27, 2025', dateSub: 'Won: Oct 19, 2025', amount: '$181.22', ofAmount: 'of $742.65', customer: 'Hannah Reyes', brand: 'Visa', last4: '4242', txn: 'TXN-2025-05366', txnDate: 'Sep 9, 2025', kind: 'Chargeback', reason: 'Subscription canceled', event: 'Pricing Event 539073' },
  { status: 'Won', id: 'DSP-46503', dateTop: 'Disputed: Oct 3, 2025', dateSub: 'Won: Oct 27, 2025', amount: '$506.16', ofAmount: 'of $506.16', customer: 'Maya Sorensen', brand: 'Discover', last4: '7076', txn: 'TXN-2025-05782', txnDate: 'Sep 25, 2025', kind: 'Chargeback', reason: 'Duplicate charge', event: 'Pricing Event 539073' },
  { status: 'Won', id: 'DSP-47034', dateTop: 'Disputed: Oct 29, 2025', dateSub: 'Won: Nov 20, 2025', amount: '$370.83', ofAmount: 'of $370.83', customer: 'Sofia Moretti', brand: 'Mastercard', last4: '7741', txn: 'TXN-2025-06545', txnDate: 'Oct 24, 2025', kind: 'Chargeback', reason: 'Fraudulent', event: 'Pricing Event 539073' },
  { status: 'Won', id: 'DSP-47269', dateTop: 'Disputed: Nov 10, 2025', dateSub: 'Won: Nov 28, 2025', amount: '$256.79', ofAmount: 'of $256.79', customer: 'Hannah Reyes', brand: 'Visa', last4: '4242', txn: 'TXN-2025-06555', txnDate: 'Oct 25, 2025', kind: 'Retrieval', reason: 'Product not received', event: 'Pricing Event 539073' },
  { status: 'Won', id: 'DSP-47714', dateTop: 'Disputed: Dec 2, 2025', dateSub: 'Won: Dec 22, 2025', amount: '$2,546.95', ofAmount: 'of $2,546.95', customer: 'Ben Castellano', brand: 'Visa', last4: '9311', txn: 'TXN-2025-07259', txnDate: 'Nov 21, 2025', kind: 'Chargeback', reason: 'Credit not processed', event: 'Pricing Event 539073' },
  { status: 'Won', id: 'DSP-48052', dateTop: 'Disputed: Dec 19, 2025', dateSub: 'Won: Jan 10, 2026', amount: '$364.91', ofAmount: 'of $364.91', customer: 'Hannah Reyes', brand: 'PayPal', last4: '7730', txn: 'TXN-2025-07894', txnDate: 'Dec 15, 2025', kind: 'Chargeback', reason: 'Subscription canceled', event: 'Pricing Event 539073' },
  { status: 'Won', id: 'DSP-48417', dateTop: 'Disputed: Jan 6, 2026', dateSub: 'Won: Jan 26, 2026', amount: '$675.28', ofAmount: 'of $675.28', customer: 'Ben Castellano', brand: 'Visa', last4: '9311', txn: 'TXN-2025-08178', txnDate: 'Dec 26, 2025', kind: 'Retrieval', reason: 'Subscription canceled', event: 'Pricing Event 539073' },
  { status: 'Won', id: 'DSP-49092', dateTop: 'Disputed: Feb 9, 2026', dateSub: 'Won: Mar 3, 2026', amount: '$190.27', ofAmount: 'of $190.27', customer: 'Isaac Brennan', brand: 'PayPal', last4: '4419', txn: 'TXN-2026-10422', txnDate: 'Jan 20, 2026', kind: 'Chargeback', reason: 'Product not received', event: 'Automated Playwright Live Event 340366' },
  { status: 'Won', id: 'DSP-49734', dateTop: 'Disputed: Mar 13, 2026', dateSub: 'Won: Apr 3, 2026', amount: '$2,768.25', ofAmount: 'of $2,768.25', customer: 'Elena Fischer', brand: 'Klarna', last4: '2914', txn: 'TXN-2026-11710', txnDate: 'Mar 9, 2026', kind: 'Inquiry', reason: 'Duplicate charge', event: 'Pricing Event 539073' },
  { status: 'Won', id: 'DSP-50986', dateTop: 'Disputed: May 15, 2026', dateSub: 'Won: Jun 7, 2026', amount: '$919.83', ofAmount: 'of $1,177.71', customer: 'Jordan Alvarez', brand: 'Visa', last4: '8821', txn: 'TXN-2026-12992', txnDate: 'Apr 25, 2026', kind: 'Chargeback', reason: 'Fraudulent', event: 'Pricing Event 539073' },
  { status: 'Won', id: 'DSP-51416', dateTop: 'Disputed: Jun 5, 2026', dateSub: 'Won: Jun 25, 2026', amount: '$188.32', ofAmount: 'of $188.32', customer: 'Chris Okonkwo', brand: 'Mastercard', last4: '5309', txn: 'TXN-2026-13768', txnDate: 'May 24, 2026', kind: 'Inquiry', reason: 'Product not received', event: 'Automated Playwright Live Event 340366' },
  { status: 'Won', id: 'DSP-52022', dateTop: 'Disputed: Jul 6, 2026', dateSub: 'Won: Jul 29, 2026', amount: '$907.59', ofAmount: 'of $907.59', customer: 'Hannah Reyes', brand: 'PayPal', last4: '7730', txn: 'TXN-2026-14528', txnDate: 'Jun 21, 2026', kind: 'Chargeback', reason: 'Fraudulent', event: 'Pricing Event 539073' },
  { status: 'Lost', id: 'DSP-46171', dateTop: 'Disputed: Sep 16, 2025', dateSub: 'Lost: Oct 9, 2025', amount: '$510.72', ofAmount: 'of $510.72', customer: 'Ava Chen', brand: 'Amex', last4: '2204', txn: 'TXN-2025-05208', txnDate: 'Sep 3, 2025', kind: 'Retrieval', reason: 'Subscription canceled', event: 'Pricing Event 637236' },
  { status: 'Lost', id: 'DSP-46726', dateTop: 'Disputed: Oct 14, 2025', dateSub: 'Lost: Nov 4, 2025', amount: '$3,533.07', ofAmount: 'of $3,591.79', customer: 'Isaac Brennan', brand: 'PayPal', last4: '4419', txn: 'TXN-2025-05987', txnDate: 'Oct 3, 2025', kind: 'Retrieval', reason: 'Product not received', event: 'Automated Playwright Live Event 340366' },
  { status: 'Lost', id: 'DSP-47553', dateTop: 'Disputed: Nov 24, 2025', dateSub: 'Lost: Dec 17, 2025', amount: '$818.02', ofAmount: 'of $818.02', customer: 'Jordan Alvarez', brand: 'Discover', last4: '6011', txn: 'TXN-2025-06896', txnDate: 'Nov 7, 2025', kind: 'Chargeback', reason: 'Duplicate charge', event: 'Automated Playwright Live Event 340366' },
  { status: 'Lost', id: 'DSP-47883', dateTop: 'Disputed: Dec 11, 2025', dateSub: 'Lost: Dec 29, 2025', amount: '$347.72', ofAmount: 'of $347.72', customer: 'Maya Sorensen', brand: 'Amex', last4: '3315', txn: 'TXN-2025-07531', txnDate: 'Dec 1, 2025', kind: 'Chargeback', reason: 'Subscription canceled', event: 'Pricing Event 539073' },
  { status: 'Lost', id: 'DSP-48816', dateTop: 'Disputed: Jan 26, 2026', dateSub: 'Lost: Feb 19, 2026', amount: '$1,480.45', ofAmount: 'of $1,626.69', customer: 'Diego Ramirez', brand: 'PayPal', last4: '8830', txn: 'TXN-2026-10510', txnDate: 'Jan 23, 2026', kind: 'Retrieval', reason: 'Duplicate charge', event: 'Pricing Event 539073' },
  { status: 'Lost', id: 'DSP-49309', dateTop: 'Disputed: Feb 20, 2026', dateSub: 'Lost: Mar 10, 2026', amount: '$285.15', ofAmount: 'of $285.15', customer: 'Priya Raman', brand: 'Amex', last4: '3315', txn: 'TXN-2026-10937', txnDate: 'Feb 8, 2026', kind: 'Retrieval', reason: 'Subscription canceled', event: 'Pricing Event 539073' },
  { status: 'Lost', id: 'DSP-50565', dateTop: 'Disputed: Apr 24, 2026', dateSub: 'Lost: May 12, 2026', amount: '$1,044.84', ofAmount: 'of $1,592.18', customer: 'Grace Lindqvist', brand: 'Visa', last4: '1188', txn: 'TXN-2026-12585', txnDate: 'Apr 10, 2026', kind: 'Chargeback', reason: 'Product unacceptable', event: 'Automated Playwright Live Event 340366' },
  { status: 'Lost', id: 'DSP-52081', dateTop: 'Disputed: Jul 9, 2026', dateSub: 'Lost: Jul 27, 2026', amount: '$1,658.51', ofAmount: 'of $1,658.51', customer: 'Noah Klein', brand: 'Klarna', last4: '2914', txn: 'TXN-2026-14553', txnDate: 'Jun 22, 2026', kind: 'Retrieval', reason: 'Product unacceptable', event: 'Pricing Event 637236' },
]

/* ---------------------------------------------------------------------------
 * Normalising — numbers and ISO dates next to the display strings, so filters
 * compare values rather than parsing text on every keystroke.
 * ------------------------------------------------------------------------- */

const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 }
const pad = (n) => String(n).padStart(2, '0')

/** "Disputed: Aug 20, 2026" / "Aug 20, 2026" → "2026-08-20". String compare
 *  on ISO dates is date compare, and no Date object means no time zone. */
export function isoFromLabel(text) {
  const m = /([A-Z][a-z]{2}) (\d{1,2}), (\d{4})/.exec(text || '')
  return m ? `${m[3]}-${pad(MONTHS[m[1]])}-${pad(m[2])}` : ''
}

const moneyValue = (s) => Number(String(s).replace(/[^0-9.]/g, ''))
const STATUS_ORDER = Object.fromEntries(DISPUTE_STATUSES.map((s, i) => [s, i]))

/** The queue, in the order it reads: work that needs the merchant first
 *  (Evidence Needed, then Pending), then outcomes; newest first inside each.
 *  The seed rows were already in this order, so they keep their positions. */
export const DISPUTES = [...SEED_ROWS, ...ADDED_ROWS]
  .map((r) => ({
    ...r,
    event: r.event || EVENT_BY_ID[r.id],
    amountValue: moneyValue(r.amount),
    disputedOn: isoFromLabel(r.dateTop),
  }))
  .sort((a, b) => (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) || b.disputedOn.localeCompare(a.disputedOn))

/* ---------------------------------------------------------------------------
 * Filtering
 * ------------------------------------------------------------------------- */

/** A filter set with nothing in it. Arrays are "any of"; an empty array
 *  means the field is off. Amounts are dollars ('' = no bound). There is no
 *  date field: the page's date range picker is the one date control on the
 *  screen, and it scopes the rows before these filters see them (inRange). */
export const emptyFilters = () => ({
  status: [], reasons: [], brands: [], kinds: [], events: [],
  amountMin: '', amountMax: '',
})

/** Copy `src` into the reactive `dst` without sharing its arrays. */
export function copyFilters(dst, src) {
  for (const [k, v] of Object.entries(src)) dst[k] = Array.isArray(v) ? [...v] : v
  return dst
}

const num = (v) => (v === '' || v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v))
export const amountBounds = (f) => ({ min: num(f.amountMin), max: num(f.amountMax) })

/** Does row `r` pass filter set `f`? `skip` names fields to ignore — the
 *  status cards pass 'status' so each card can count its own status inside
 *  every other filter (a facet count). */
export function matchesFilters(r, f, skip = []) {
  const any = (key, value) => skip.includes(key) || !f[key].length || f[key].includes(value)
  if (!any('status', r.status)) return false
  if (!any('reasons', r.reason)) return false
  if (!any('brands', r.brand)) return false
  if (!any('kinds', r.kind)) return false
  if (!any('events', r.event)) return false
  const { min, max } = amountBounds(f)
  if (min !== null && r.amountValue < min) return false
  if (max !== null && r.amountValue > max) return false
  return true
}

/** Was row `r` disputed inside the inclusive ISO range { start, end }? */
export const inRange = (r, range) => !range || (r.disputedOn >= range.start && r.disputedOn <= range.end)

/** Free-text search across everything a merchant might paste in: IDs, a
 *  name, a card's last four, a reason, an event. */
export function matchesSearch(r, q) {
  const needle = String(q || '').trim().toLowerCase()
  if (!needle) return true
  return [r.id, r.customer, r.txn, r.reason, r.kind, r.brand, r.last4, r.event]
    .some((v) => String(v).toLowerCase().includes(needle))
}

export const sumAmount = (rows) => Math.round(rows.reduce((s, r) => s + r.amountValue, 0) * 100) / 100

/** Amount by `field`, biggest first — the Dispute By breakdown. */
export function amountBy(rows, field) {
  const totals = new Map()
  for (const r of rows) totals.set(r[field], (totals.get(r[field]) || 0) + r.amountValue)
  return [...totals.entries()]
    .map(([label, amount]) => ({ label, amount: Math.round(amount * 100) / 100 }))
    .sort((a, b) => b.amount - a.amount)
}


/* ---------------------------------------------------------------------------
 * Months and comparison windows — pure ISO-string maths, no time zones.
 * ------------------------------------------------------------------------- */

const daysInMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate()

/** `iso` moved `n` calendar months, the day clamped to the target month
 *  (Mar 31 − 1 month = Feb 28), so a range that ends on a month end still
 *  does after the shift. */
export function shiftMonths(iso, n) {
  const [y, m, d] = iso.split('-').map(Number)
  const idx = y * 12 + (m - 1) + n
  const ty = Math.floor(idx / 12)
  const tm = (idx % 12) + 1
  return `${ty}-${pad(tm)}-${pad(Math.min(d, daysInMonth(ty, tm)))}`
}

/** First-of-month ISO strings for every month the range touches. */
export function monthStarts(range) {
  const out = []
  for (let m = `${range.start.slice(0, 7)}-01`; m <= range.end; m = shiftMonths(m, 1)) out.push(m)
  return out
}

/** Disputes per month inside `range`: `{ count, amount }` for each month the
 *  range touches. Only disputes inside the range count, so a range that
 *  starts mid-month has a partial first bar and the bars always add up to the
 *  summary's total for the same range. */
export function byMonth(rows, range) {
  const within = rows.filter((r) => inRange(r, range))
  return monthStarts(range).map((m) => {
    const inMonth = within.filter((r) => r.disputedOn.slice(0, 7) === m.slice(0, 7))
    return { month: m, count: inMonth.length, amount: sumAmount(inMonth) }
  })
}

/** The window a comparison reads, as { start, end, shift } where `shift` is
 *  how many months back it sits:
 *    'year'   — the same range one year earlier (shift 12);
 *    'period' — the range moved back by as many months as it touches, so it
 *               is the equal-length run of months immediately before it
 *               (Jan–Aug 2026 → May–Dec 2025). Months, not days, because the
 *               chart compares bar to bar: each selected month lines up with
 *               exactly one comparison month, clipped to the same days. */
export function comparisonWindow(range, mode) {
  const shift = mode === 'year' ? 12 : monthStarts(range).length
  return { start: shiftMonths(range.start, -shift), end: shiftMonths(range.end, -shift), shift }
}

/** The comparison series for `range`, one value per selected month. Each
 *  value is the disputed amount in the matching comparison month (clipped to
 *  the comparison window), or null when that month is before DATA_START —
 *  the fixture has no record for it, which is not the same as no disputes.
 *  `coverage` is 'full' | 'partial' | 'none'; `missing` lists the SELECTED
 *  months whose comparison is missing. */
export function comparisonByMonth(rows, range, mode) {
  const win = comparisonWindow(range, mode)
  const within = rows.filter((r) => inRange(r, win))
  const months = monthStarts(range)
  const values = months.map((m) => {
    const cm = shiftMonths(m, -win.shift)
    // The comparison month's first day inside the window must be on record.
    if ((win.start > cm ? win.start : cm) < DATA_START) return null
    return sumAmount(within.filter((r) => r.disputedOn.slice(0, 7) === cm.slice(0, 7)))
  })
  const missing = months.filter((_, i) => values[i] === null)
  const coverage = !missing.length ? 'full' : missing.length === months.length ? 'none' : 'partial'
  return { window: win, values, coverage, missing }
}

/* ---------------------------------------------------------------------------
 * Transactions processed — the dispute ratio's denominator. ILLUSTRATIVE: the
 * fixture has no ledger behind these; they are the 09/28 capture's figures
 * (Jan–Aug 2026 as captured; Sep–Dec 2025 split from its 12-month 6,800).
 * ------------------------------------------------------------------------- */

export const TXN_BY_MONTH = {
  '2025-09': 520, '2025-10': 540, '2025-11': 530, '2025-12': 550,
  '2026-01': 540, '2026-02': 510, '2026-03': 620, '2026-04': 560,
  '2026-05': 580, '2026-06': 600, '2026-07': 640, '2026-08': 610,
}

/** Transactions processed in `range`: whole months count in full, a partial
 *  month pro rata by days. Months outside the fixture count 0 (a range cannot
 *  reach them — the page picker's min is DATA_START). */
export function txnsIn(range) {
  let total = 0
  for (const m of monthStarts(range)) {
    const [y, mo] = m.split('-').map(Number)
    const dim = daysInMonth(y, mo)
    const from = range.start > m ? Number(range.start.slice(8)) : 1
    const to = range.end < `${m.slice(0, 8)}${pad(dim)}` ? Number(range.end.slice(8)) : dim
    total += (TXN_BY_MONTH[m.slice(0, 7)] || 0) * ((to - from + 1) / dim)
  }
  return Math.round(total)
}

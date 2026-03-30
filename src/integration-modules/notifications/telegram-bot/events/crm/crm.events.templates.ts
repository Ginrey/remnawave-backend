import dayjs from 'dayjs';

import { EVENTS, TCRMEvents } from '@libs/contracts/constants';

import { CrmEvent } from '@integration-modules/notifications/interfaces';

export type CrmEventsTemplate = (event: CrmEvent) => string | null;

const paymentInfo = (e: CrmEvent) => `
<<<<<<< HEAD
🏢 <b>Provider:</b> <code>${e.data.providerName}</code>
🖥️ <b>Node:</b> <code>${e.data.nodeName}</code>
📆 <b>Due Date:</b> <code>${dayjs(e.data.nextBillingAt).format('DD.MM.YYYY')}</code>
=======
<tg-emoji emoji-id='5264733042710181045'>🏢</tg-emoji> <b>Provider:</b> <code>${e.data.providerName}</code>
<tg-emoji emoji-id='5282843764451195532'>🖥️</tg-emoji> <b>Node:</b> <code>${e.data.nodeName}</code>
<tg-emoji emoji-id='5431897022456145283'>📆</tg-emoji> <b>Due Date:</b> <code>${dayjs(e.data.nextBillingAt).format('DD.MM.YYYY')}</code>
>>>>>>> upstream/main
`;

const providerLink = (e: CrmEvent) => `🔗 <a href="${e.data.loginUrl}">Open Provider Panel</a>`;

const getDaysPastDue = (e: CrmEvent) => Math.abs(dayjs().diff(dayjs(e.data.nextBillingAt), 'day'));

export const CRM_EVENTS_TEMPLATES: Record<TCRMEvents, CrmEventsTemplate> = {
    [EVENTS.CRM.INFRA_BILLING_NODE_PAYMENT_IN_7_DAYS]: (e) => `
<<<<<<< HEAD
📅 <b>Payment Reminder</b>
=======
<tg-emoji emoji-id='5431897022456145283'>📆</tg-emoji> <b>Payment Reminder</b>
>>>>>>> upstream/main

${paymentInfo(e)}

${providerLink(e)}`,

    [EVENTS.CRM.INFRA_BILLING_NODE_PAYMENT_IN_48HRS]: (e) => `
<<<<<<< HEAD
⚠️ <b>Payment Alert - 2 Days Warning</b>

${paymentInfo(e)}

⚡ <i>Payment is due in 2 days!</i>
=======
<tg-emoji emoji-id='5447644880824181073'>⚠️</tg-emoji> <b>Payment Alert - 2 Days Warning</b>

${paymentInfo(e)}

<tg-emoji emoji-id='5219943216781995020'>⚡</tg-emoji> <i>Payment is due in 2 days!</i>
>>>>>>> upstream/main

${providerLink(e)}`,

    [EVENTS.CRM.INFRA_BILLING_NODE_PAYMENT_IN_24HRS]: (e) => `
<<<<<<< HEAD
🚨 <b>URGENT: Payment Due Tomorrow!</b>

${paymentInfo(e)}

🔥 <i>Payment is due tomorrow!</i>
=======
<tg-emoji emoji-id='5395695537687123235'>🚨</tg-emoji> <b>URGENT: Payment Due Tomorrow!</b>

${paymentInfo(e)}

<tg-emoji emoji-id='5420315771991497307'>🔥</tg-emoji> <i>Payment is due tomorrow!</i>
>>>>>>> upstream/main

${providerLink(e)}`,

    [EVENTS.CRM.INFRA_BILLING_NODE_PAYMENT_DUE_TODAY]: (e) => `
<<<<<<< HEAD
🔴 <b>CRITICAL: Payment Due TODAY!</b>

${paymentInfo(e)}

⚡ <i>Payment must be completed today!</i>
=======
<tg-emoji emoji-id='5411225014148014586'>🔴</tg-emoji> <b>CRITICAL: Payment Due TODAY!</b>

${paymentInfo(e)}

<tg-emoji emoji-id='5219943216781995020'>⚡</tg-emoji> <i>Payment must be completed today!</i>
>>>>>>> upstream/main

${providerLink(e)}`,

    [EVENTS.CRM.INFRA_BILLING_NODE_PAYMENT_OVERDUE_24HRS]: (e) => `
<<<<<<< HEAD
❌ <b>OVERDUE: First Notice</b>

${paymentInfo(e)}
⚠️ <b>Days Overdue:</b> <code>${getDaysPastDue(e)} day(s)</code>

🚨 <i>Payment is overdue!</i>
=======
<tg-emoji emoji-id='5472267631979405211'>❌</tg-emoji> <b>OVERDUE: First Notice</b>

${paymentInfo(e)}
<tg-emoji emoji-id='5447644880824181073'>⚠️</tg-emoji> <b>Days Overdue:</b> <code>${getDaysPastDue(e)} day(s)</code>

<tg-emoji emoji-id='5395695537687123235'>🚨</tg-emoji><i>Payment is overdue!</i>
>>>>>>> upstream/main

${providerLink(e)}`,

    [EVENTS.CRM.INFRA_BILLING_NODE_PAYMENT_OVERDUE_48HRS]: (e) => `
<<<<<<< HEAD
🔥 <b>OVERDUE: Second Notice</b>

${paymentInfo(e)}
⚠️ <b>Days Overdue:</b> <code>${getDaysPastDue(e)} day(s)</code>

⚡ <i>Critical: Service suspension imminent!</i>
=======
<tg-emoji emoji-id='5420315771991497307'>🔥</tg-emoji> <b>OVERDUE: Second Notice</b>

${paymentInfo(e)}
<tg-emoji emoji-id='5447644880824181073'>⚠️</tg-emoji> <b>Days Overdue:</b> <code>${getDaysPastDue(e)} day(s)</code>

<tg-emoji emoji-id='5219943216781995020'>⚡</tg-emoji> <i>Critical: Service suspension imminent!</i>
>>>>>>> upstream/main

${providerLink(e)}`,

    [EVENTS.CRM.INFRA_BILLING_NODE_PAYMENT_OVERDUE_7_DAYS]: (e) => `
<<<<<<< HEAD
💀 <b>FINAL NOTICE: Service Termination Risk</b>

${paymentInfo(e)}
⚠️ <b>Days Overdue:</b> <code>${getDaysPastDue(e)} day(s)</code>
=======
<tg-emoji emoji-id='5370971163310693562'>💀</tg-emoji> <b>FINAL NOTICE: Service Termination Risk</b>

${paymentInfo(e)}
<tg-emoji emoji-id='5447644880824181073'>⚠️</tg-emoji> <b>Days Overdue:</b> <code>${getDaysPastDue(e)} day(s)</code>
>>>>>>> upstream/main

${providerLink(e)}`,
};

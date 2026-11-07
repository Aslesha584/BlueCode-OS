# BlueCode-OS — Sales Copilot frontend prototype

React + Vite clickable frontend with realistic mock data.

## Run locally
1. Install Node.js 18+ (recommended).
2. In this folder run `npm install`.
3. Run `npm run dev`.
4. Open the local URL printed by Vite.

## Prototype journey
Sign in / create demo account → Startup Setup → ICP Builder → ICP Review & approval → required booking-link setup → Dashboard.

## Included modules
Dashboard; ICP Builder; Prospects (50 illustrative records); Leads; Decision Makers; Outreach (individual draft review and approval); Follow-ups; Next Best Action; Pipeline & Analytics; **Reports** (Free 15-Day Pilot and Monthly Client Report with print-to-PDF); Settings and plan checkout preview.

## Important limitations
- This is a frontend prototype. Account state and mock workflow data are stored in browser localStorage. It is not production authentication.
- Reports are client-report layout previews using illustrative records. The Export / Print PDF action opens the browser print dialog, where a user can choose Save as PDF. Monthly period selection is a preview label, not date-filtered backend reporting.
- No backend, database, live Apollo OAuth, AI API, email sending, calendar integration, or real payment gateway is connected. All records and charts are illustrative demo data.
- Checkout supports a visual credit/debit card choice only. Do not enter real card details. No payments are processed. Real billing requires backend-created checkout sessions, verified provider webhooks, subscription state and server-side quota enforcement.
- The current source bundle did not include the actual brand logo asset, so the app uses an icon-and-wordmark treatment. Replace it with the approved logo before external release.
- Never add API keys, passwords, tokens, or other secrets to the frontend or repository.

## Build
`npm run build`


## Branding and integrations
- The sidebar currently uses an icon-and-text placeholder because the approved company logo has not been included in this archive. Place the approved logo asset in `public/` and update the brand component once the file is supplied.
- Apollo connection is a UI preview only. Production should use a customer-authorized OAuth flow and secure backend token storage; do not collect Apollo passwords or expose API keys in the browser.
- The Outreach page explains the difference between copying a draft, approving it, queuing a demo handoff, and actual email sending. Actual sending is not connected in this frontend prototype.

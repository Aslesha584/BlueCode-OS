# BlueCode-OS frontend flow changes

- Removed the Apollo setup route/page and its onboarding gate.
- Booking setup now saves the URL and navigates to the dashboard.
- Sign In navigates directly to the dashboard.
- Create Account navigates directly to ICP Builder.
- Startup Setup remains available from the ICP Builder and is no longer a blocker to opening the ICP profile.
- Settings now describes Hunter.io as centrally managed by Blue Code; it does not show a customer connect button. The status explicitly says backend setup is pending.
- Replaced Apollo wording in prospecting/outreach demo copy with generic wording.

## Important current limitation
The existing login and account creation are still frontend prototype flows. They do not yet authenticate or persist separate users in a backend/database. Hunter.io is not integrated yet; the UI only reflects the agreed future architecture.

## Run locally
1. Run `npm install` in this folder.
2. Run `npm run dev`.
3. Open the local URL printed by Vite.

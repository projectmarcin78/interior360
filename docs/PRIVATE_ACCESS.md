# SicilyCrew 2.0.0 — manual WhatsApp access

This is a breaking change from the anonymous directory. Keep contacts private during migration.

## Deploy on the company account

1. Sign into Google yourself as marcin@interior360.pl. Open the existing private database and Extensions > Apps Script. Do not share the database with group members.
2. Replace the complete Code.gs with backend/Code.gs from v2.0.0 and save. Do not leave the previous code in a second file.
3. Run setupSicilyCrew from the editor as the owner. It checks contact/review headers, adds/validates Members and creates a private authentication secret. Existing contact/review data stays unchanged. If Google asks, approve only the permissions shown for this script; it does not use MailApp or read WhatsApp.
4. Reload the database spreadsheet. The SicilyCrew menu should appear. Members columns are Phone, Name, Status. Phone values must be plain text with country code, e.g. +39…; Status is exactly Active or Blocked. One row per number. Marcin’s supplied number is seeded for the initial test.
5. In Apps Script: Deploy > Manage deployments > select the existing web app > Edit (pencil) > Version > New version > Deploy. Execute as Me, access Anyone: the URL itself is reachable, but the new server checks the private token before any contact read or write. Do not mistake that setting for an open database.
6. Update or archive EVERY other active deployment that still serves the old anonymous code. Saving new code alone does not change deployed versions. Retire old deployments before reopening the directory.

## Test privately before enabling the portal

1. Open the updated direct /exec URL without signing into Google. It must show the phone/code form and no contacts, even if approved contacts exist.
2. In the private Members sheet select Marcin’s row. Choose SicilyCrew > Generate WhatsApp access code. The dialog must show an 8-digit code, and the WhatsApp link must target the selected number. No message is sent automatically. Do not post codes in a group or this chat.
3. Use the code in the direct app. Confirm approved contacts are visible and the existing add/review forms work with Pending moderation.
4. Confirm a used code is rejected in another browser. Generate a new code and confirm the old unused one no longer works.
5. Set the test member to Blocked. A refresh or the next server request must refuse access; an open visible page checks periodically (about a minute). Restore Active and generate a fresh code to continue.
6. Test Sign out, mobile use, and all old deployment URLs. None may anonymously display the database.
7. Only after these checks, set membersOnlyReady to true in public/sicily-tradespeople/config.js and publish a new patch release. This GitHub edit can be done after the owner confirms the Google deployment is ready.

## Invite a person

Add their full WhatsApp number, optional name and Active status in Members. Select their row, generate a code, click Open WhatsApp with this message, review the recipient, then press Send yourself. Codes expire in 30 minutes and allow five attempts. The browser can stay signed in up to 7 days; temporary/blocked storage may require another code sooner. Blocked removes server access; copying information by an already authorized person cannot be undone.

The code is a private invitation, not independent proof of phone ownership. Send it only in a direct conversation with the intended member. Anyone who receives both number and code before use could redeem it.

## Recover or pause

If sign-in fails, check full country code, Active status, duplicate numbers, code age and whether a newer code was generated. Generate a fresh code from the owner’s spreadsheet menu. If access appears public anywhere, archive that Google deployment immediately. The Pages pause only stops the wrapper; it cannot revoke direct Google URLs. Never restore an anonymous backend to fix login.

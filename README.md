# SicilyCrew

Private community directory of contacts and services for homeowners in Sicily.

Current baseline: **2.0.2**. See VERSIONING.md for semantic versioning and CHANGELOG.md for changes.

## Repository

- public/: GitHub Pages entry point, directory shell, assets and legal pages.
- backend/Code.gs: single-file Google Apps Script backend and generated app UI.
- public/assets/services.json: authoritative catalogue (22 categories, 115 services).
- scripts/sync-directory.mjs: sync the catalogue and HTML into Code.gs after UI edits.
- tests/: authentication and directory validation tests. Run `node --test tests/*.test.mjs`, then `node scripts/prepare-release.mjs`.

## Private access deployment

Follow [the migration guide](docs/PRIVATE_ACCESS.md). The live Google app is updated separately from GitHub Pages. A repository push does not update Apps Script.

The Pages wrapper is deliberately paused with membersOnlyReady=false. Do not enable it until the protected backend is deployed and verified. This switch is not an access control: old anonymous Google deployments must be updated or archived separately.

## How access works

The owner manages the private Members sheet (Phone, Name, Status). A full international WhatsApp number is required, one row per person. Only Active rows are allowed. Select a member row and use SicilyCrew > Generate WhatsApp access code. A dialog displays a code and a WhatsApp link containing a prefilled message; the owner must press Send themselves. No messages are sent automatically, no WhatsApp group data is imported, and there is no messaging provider account or per-code API charge.

The 8-digit code expires after 30 minutes, five unsuccessful attempts or one successful use. Regenerating a code invalidates the previous code for that number. The application has no anonymous code-generation endpoint. Only hashes are stored in script properties; no codes or sessions are committed to GitHub or written to spreadsheet cells.

A successful sign-in grants a random session token for up to 90 days. The server checks expiration and current membership on every data read/write. The browser stores the token locally where available and periodically rechecks membership. Sign out revokes the token and clears rendered contacts and forms. Browser storage may be temporary or unavailable in embedded/credentialless/private contexts; in that case access may require a fresh code. Prefer the direct app link if the embedded view loses its session. Already viewed or copied information cannot be recalled, and a recipient could forward their number and code: this is manual invitation access, not independent WhatsApp identity verification.

Server session and code hashes are kept privately in Apps Script properties. Expired entries are removed when the owner generates a later code. Keep the group small and review unused membership records. Do not share the database with members; the app handles access while running as the owner.

## Moderation and existing data

Tradespeople and Reviews tabs are preserved. Only Approved rows are returned to authenticated members. New contacts and reviews stay Pending until the owner approves them. Profiles support multiple services, legacy trade values, town and category filters, alphabetical/rating/review sorting, and reviews from 1 to 5 stars. AI remains disabled.

## Release and hosting

GitHub Actions publishes public/ to GitHub Pages and creates immutable version tags/releases. Google backend source has to be deployed manually from the same version. No custom domain is configured. The public repository contains code and catalogue data, not the private contact database or member list.

## Verification limits

Automated tests use mocked Apps Script services and do not establish real Google deployment, OAuth, spreadsheet menu or browser storage behavior. Complete the live checklist in the migration guide before enabling the wrapper or inviting users.

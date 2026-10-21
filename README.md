# SicilyCrew

Community directory of contacts and services for homeowners in Sicily.

## Layout

- `public/index.html`: entry point redirecting to the SicilyCrew directory.
- `public/sicily-tradespeople/`: directory page, ready for a Google Apps Script web app.
- `backend/Code.gs`: Google Apps Script server and website, with no private database ID committed.
- `.github/workflows/pages.yml`: publishes only `public/` to GitHub Pages.

## Enable hosting

In repository Settings → Pages → Build and deployment, choose **GitHub Actions** as Source. Then run **Publish website** from the Actions tab if necessary. Use the actual URL returned by the successful deployment. No custom domain is configured.

## Activate submissions

Until the backend is deployed, the directory is a clearly labelled preview. It contains no invented contacts. Forms cannot submit and no records are saved in a visitor's browser.

1. On the company Google account, open the private database prepared in Google Drive. Open Extensions → Apps Script.
2. Paste `backend/Code.gs` into Code.gs.
3. In Apps Script Project Settings → Script properties, add `SPREADSHEET_ID` with the private database's actual ID. Do not commit this value here.
4. Deploy → New deployment → Web app. Execute as **Me**, access **Anyone**. Authorize access, copy the deployed `/exec` URL and test it in an incognito window.
5. Put that URL in `public/sicily-tradespeople/config.js` as `appUrl`. The directory page will embed the live app; the next GitHub Pages deployment publishes the setting.
6. Keep the database private. Approve profiles using the Status column in Tradespeople and reviews using Status in Reviews. Only `Approved` records are shown. `Pending` and `Rejected` records stay private.

## Test before inviting users

Submit a test profile and confirm it stays hidden while Pending. Approve it and reload the app. Submit a review and confirm it affects the score only after approval. Reject both test records afterwards. Test the app directly and embedded on mobile.

Anonymous review identities are not verified. This first version uses manual moderation, basic validation, a honeypot and short-term duplicate detection. It does not implement account registration or CAPTCHA.

## Later integration

The company website and directory keep separate paths. The directory can also be embedded in another website using an iframe with the actual published directory URL. Test the final website's iframe and content-security settings before launch. Google may show its standard Apps Script notice.

## Verification

JavaScript syntax, template configuration and backend validation/moderation logic were checked locally. Live submissions require the owner's Google Apps Script deployment. Browser rendering and final embedding still need verification.

## Versioning

Current baseline: **1.4.0**. See [VERSIONING.md](VERSIONING.md) for the compatibility contract and release process, and [CHANGELOG.md](CHANGELOG.md) for release notes. VERSION is the authoritative version.


## Services and profile compatibility

Edit `public/assets/services.json`, then run `node scripts/sync-directory.mjs` from the repository root. This regenerates the embedded taxonomy and Apps Script page. Keep the entire generated Code.gs when deploying; no external taxonomy request is required at runtime. Run `node --test tests/directory.test.mjs` and `node scripts/prepare-release.mjs` before publishing.

Profiles choose 1–15 service IDs. The existing Tradespeople Trade column stores their JSON array. No columns are moved. Historical single-trade values are mapped on read, with their original value preserved. The database sheet and tab names stay unchanged. An independent/local declaration is mandatory for car rental submissions; moderation must enforce the no-chains policy. Location currently means the contact's base town; Areas served remains descriptive text.

## Request helper and optional AI

The public preview uses local keyword suggestions in English, Polish and Italian. It is explicitly labelled as keyword search, not AI. Suggestions choose services; they are not diagnoses or endorsements, and results contain only approved directory contacts.

An optional Apps Script `suggestServices` function uses the OpenAI Responses API to classify the request into whitelisted service IDs. It sends the request and service catalogue, not contact phone numbers or reviews. The visitor must explicitly consent before each AI-enabled request flow. Responses are checked and unknown IDs dropped. There are no browsing tools or autonomous actions.

AI remains off by default. Before enabling, review provider data processing, update the public privacy notice, configure a suitable model supporting Structured Outputs, and test the deployed integration. Set private Script properties `OPENAI_API_KEY`, `OPENAI_MODEL`, `AI_DAILY_LIMIT` (default 50 calls globally per UTC day), `AI_PRIVACY_READY=true`, and `AI_ENABLED=true`. Never put the key in HTML, config.js or this repository. Set provider-side budget controls as well; the application cap limits requests, not exact spend. Turn off with `AI_ENABLED=false`. No API request is sent when the integration is disabled or the user has not consented. Model calls are not end-to-end tested without these credentials.

Profile claiming, owner updates/replies, sponsored placement and payments remain future work. They are not activated by this release.

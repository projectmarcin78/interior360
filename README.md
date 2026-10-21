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
3. Save, select `setupSicilyCrew` in the function list and click Run. Authorize using the company Google account. It verifies the bound database tabs and saves the spreadsheet ID privately; no copying of the ID is needed. Existing records are not changed.
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

Current baseline: **1.5.1**. See [VERSIONING.md](VERSIONING.md) for the compatibility contract and release process, and [CHANGELOG.md](CHANGELOG.md) for release notes. VERSION is the authoritative version.


## Services and profile compatibility

Edit `public/assets/services.json`, then run `node scripts/sync-directory.mjs` from the repository root. This regenerates the embedded taxonomy and Apps Script page. Keep the entire generated Code.gs when deploying; no external taxonomy request is required at runtime. Run `node --test tests/directory.test.mjs` and `node scripts/prepare-release.mjs` before publishing.

Profiles choose 1–15 service IDs. The existing Tradespeople Trade column stores their JSON array. No columns are moved. Historical single-trade values are mapped on read, with their original value preserved. The database sheet and tab names stay unchanged. An independent/local declaration is mandatory for car rental submissions; moderation must enforce the no-chains policy. Location currently means the contact's base town; Areas served remains descriptive text.

## Search and AI status

The directory uses browser-local text search and category/service/town filters. There is no AI panel or paid AI request path. The Apps Script AI entry points explicitly report disabled even if old Script properties remain set. The earlier optional integration remains in git history for a future separately approved activation. No OpenAI key is needed for this release.

Profile claiming, owner updates/replies, sponsored placement and payments remain future work. They are not activated by this release.


## Google connection — 1.5.0

The public config points to the company-owned Apps Script web app deployed from 1.4.2. The browser loads that app in an iframe, and forms use google.script.run there. The Sheet remains private and only Approved entries are returned by getDirectory. This integration release does not replace the already deployed Apps Script source. Its embedded footer therefore still identifies application source 1.4.2. Keep future Apps Script code deployments explicit; editing repository source alone does not update Google.

For release verification, check the public web app without signing in, submit a clearly labelled test contact, confirm Pending status and absence from public results, approve it, submit a test review, then confirm the same review moderation and average-score behavior. Reject the test records afterwards. Never claim these live-write checks passed without performing them.

Administration: review and delete unresolved pending/rejected records within 90 days unless retained for a report/dispute, and respond to privacy/correction requests. No retention cleanup trigger is installed. To disconnect, set appUrl to an empty string and redeploy GitHub Pages.


### Google session compatibility

1.5.1 uses the verified company-domain deployment route and sets iframe credentialless before loading the app. Supporting browsers start the embedded app in a fresh temporary cookie context rather than an existing multi-account Google session. Unsupported browsers ignore the attribute; an always-visible direct-open link is provided. This does not change database sharing or grant new Google account access. Test the affected user's regular browser after deployment; success in a separate test browser alone cannot establish that their session issue is resolved.

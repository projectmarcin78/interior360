# Changelog

## [Unreleased]

## [1.4.0] - 2026-10-21

### Added
- Problem-based Crew finder with 22 categories and 115 home and local services.
- Multiple services per contact, grouped selections and English/Polish/Italian search keywords.
- Prominent Add a contact and per-profile Leave a review actions, preserving 1–5 stars.
- Sorting by name, highest rating or review count, with positive/neutral/negative review counts on profiles.
- Local independent car rental declarations; no rental chains.
- A request helper with clearly labelled keyword suggestions and optional server-side OpenAI service classification.
- AI is disabled unless privately configured, privacy-reviewed and explicitly enabled, with a global daily request cap.
- A shared taxonomy source and synchronisation script, with compatibility for previous single-trade records.

### Availability
- The public site remains a preview. Google submissions and AI are not activated by this release.


## [1.3.0] - 2026-10-21

### Added
- Accessible 1–5 star selection in the review form, replacing the numeric dropdown.
- Keyboard and touch controls, required selection and cumulative star highlighting.
- The selected value uses the existing rating field and server validation. Google backend remains disconnected.

## [1.2.2] - 2026-10-21

### Fixed
- Set the renovation-help heading explicitly to bold black for legibility on its light background, including the future Apps Script interface.

## [1.2.1] - 2026-10-21

### Changed
- Simplified the portal to a neutral white, charcoal and grey presentation.
- Used the original logo wordmark in the header and removed the large repeated logo.
- Replaced campaign slogans and prominent colour accents with a compact directory introduction.
- Applied the same presentation to the future Apps Script interface and legal pages.
- Backend availability is unchanged; submissions remain in preview mode.

## [1.2.0] - 2026-10-21

### Changed
- Rebranded the public portal as SicilyCrew, using the approved red logo with a fine yellow outline.
- Redesigned navigation, hero, search, cards, forms and mobile layouts around the red/yellow identity.
- The root page now opens the directory directly; existing directory and legal URLs are preserved.
- Updated legal-page styling and product naming, retaining Interior360 sp. z o.o. as the operator and its separate service offer.
- Included the rebranded interface in the Apps Script source for a future deployment.

### Availability
- Google backend remains disconnected. This release changes presentation and branding, not submission availability.

## [1.1.1] - 2026-10-21

### Added
- Original English Terms & reviews, current-preview Privacy & cookies, and Report a problem pages.
- Direct reporting email and legal links in site footers and form notices.
- Clear statements that reviews are not verified, moderation is independent of payment and public data is not automatically free to reuse.

### Availability
- Privacy wording covers the current preview. A full Google-backend privacy/data-flow review and confirmed business identification details are required before submissions open.

## [1.1.0] - 2026-10-21

### Added
- Floating WhatsApp contact for Interior360, with a compact mobile icon. Hidden when a form dialog opens.
- Town selection from an initial list of Sicilian towns in the profile form and search filter.
- Backend validation rejecting unlisted towns in new profile submissions.

### Changed
- Replaced the Chiusa Sclafani area heading with Sicily.
- Included the same interface changes in the Google Apps Script source for later deployment.

### Availability
- The town list is an initial selection, not a complete list of Sicilian municipalities. It can be expanded in the source.
- The directory remains a preview until Google Apps Script is deployed. Advertising blocks are deferred.

## [1.0.1] - 2026-10-21

### Changed
- Added a clearly labelled Interior360 services section to the directory with a WhatsApp contact button and a prefilled English message.
- Included the same contact block in the Google Apps Script source for later deployment.
- Directory submissions remain inactive until the Google backend is connected.

## [1.0.0] - 2026-10-21

### Added
- Interior360 home page and separate English `/sicily-tradespeople/` directory preview.
- Search, trade/town filters, profile cards and review forms.
- Google Apps Script source for moderated profiles and reviews stored in a private Google Sheet.
- GitHub Pages deployment configuration.
- Semantic versioning, visible version/build metadata and automated GitHub tags/releases.

### Availability
- This release establishes the website's first versioned baseline.
- The directory remains a preview until Google Apps Script is deployed and configured.
- Preview forms do not save submissions. No real contacts or reviews are included.
- A source release does not confirm successful live deployment or backend activation.

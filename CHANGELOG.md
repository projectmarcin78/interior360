# Changelog

## [Unreleased]

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

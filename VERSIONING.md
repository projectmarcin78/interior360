# Versioning

The entire website, directory and backend source share one MAJOR.MINOR.PATCH version. VERSION is the single source of truth. The initial baseline is 1.0.0.

## Compatibility contract

Compatibility covers public page paths, documented configuration keys, database tabs/headers and Apps Script functions getDirectory and submitEntry. Incompatible changes require a major release and migration instructions. Features are available only when the required backend is activated.

| Change | Example next version |
| --- | --- |
| Compatible bug fix, small copy/layout correction | 1.0.1 |
| Compatible feature, such as activating reviews or adding a filter | 1.1.0 |
| Incompatible URLs, configuration, API or database schema | 2.0.0 |

Minor releases reset PATCH to zero; major releases reset MINOR and PATCH. Never move or reuse released tags. Correct released errors in a new version.

## Release process

1. Work on a feature branch and review before merging into main.
2. Collect notes under Unreleased in CHANGELOG.md.
3. Update VERSION and move notes into a dated version heading. State incomplete features and required migrations.
4. Run `node scripts/prepare-release.mjs` to validate and generate deployment metadata, the version display and release notes. Generated files are ignored by Git.
5. Merge the release commit. GitHub Actions creates vX.Y.Z at the exact commit and publishes a GitHub Release. Reusing the version at another commit is rejected.
6. Verify Pages separately. Backend changes additionally require deployment in Google Apps Script.

Only VERSION changes automatically publish releases. Pages can deploy intervening development commits; each deployment displays both its base version and commit in metadata. Document pending changes under Unreleased.

## Rollback

Inspect the previous tag, restore the required files on a new branch, and publish the restoration with a new patch version. Preserve release history. Check database compatibility before a backend rollback. Never force-reset main or move an existing tag.

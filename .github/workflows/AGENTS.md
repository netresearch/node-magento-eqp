<!-- Managed by agent: keep sections and order; edit content, not structure. Last updated: 2026-03-02 -->

# AGENTS.md — workflows

## Overview

GitHub Actions workflows for CI, documentation, and release automation.

## Key Files

| File                      | Purpose                                                                  |
| ------------------------- | ------------------------------------------------------------------------ |
| `lint.and.build.yml`      | CI: parallel lint + build + test on push/PR                              |
| `docs.yml`                | Build TypeDoc docs, deploy to GitHub Pages (push to main)                |
| `pr-quality.yml`          | Auto-approve PRs from repo collaborators (solo-maintainer pattern)       |
| `release-please.yml`      | Creates version-bump PRs with changelogs (does NOT create tags/releases) |
| `release.when-tagged.yml` | Publish to npm + GPR + create GitHub Release on signed `v*` tag push     |
| `codeql.yml`              | CodeQL security analysis (scheduled + push/PR to main)                   |
| `auto-merge-deps.yml`     | Auto-approve + auto-merge Dependabot, Renovate, and release-please PRs   |

## Workflow conventions

- **Pin action versions** with full SHA, not tags (`uses: actions/checkout@<sha> # v4.2.2`)
- **Minimal permissions**: Use `permissions:` block, never use `permissions: write-all`
- **Node version**: 24 (match `engines` in package.json)
- **Runner**: `ubuntu-24.04` or `ubuntu-latest`
- **Package manager**: yarn with `--frozen-lockfile` in CI

### Naming conventions

| Type          | Convention      | Example                   |
| ------------- | --------------- | ------------------------- |
| Workflow file | `<purpose>.yml` | `lint.and.build.yml`      |
| Job ID        | kebab-case      | `build`, `lint`, `deploy` |
| Secret        | SCREAMING_SNAKE | `NPM_TOKEN`               |

## Security & safety

- Pin actions to full commit SHA, not mutable tags
- Start with `contents: read`, add only what's needed
- Never expose secrets in logs
- Use `--frozen-lockfile` for reproducible installs

## PR/commit checklist

- [ ] Actions pinned to full SHA
- [ ] Permissions block uses minimal required permissions
- [ ] Secrets are not exposed in logs
- [ ] Workflow syntax valid (check with `actionlint`)

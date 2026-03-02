<!-- FOR AI AGENTS - Human readability is a side effect, not a goal -->
<!-- Managed by agent: keep sections and order; edit content, not structure -->
<!-- Last updated: 2026-03-02 | Last verified: 2026-03-02 -->

# AGENTS.md

**Precedence:** the **closest `AGENTS.md`** to the files you're changing wins. Root holds global defaults only.

## Project

| Key             | Value                                                                   |
| --------------- | ----------------------------------------------------------------------- |
| Name            | `@netresearch/node-magento-eqp`                                         |
| Purpose         | TypeScript API wrapper for Adobe Commerce Marketplace EQP API           |
| Type            | Library (npm package)                                                   |
| Language        | TypeScript (strict mode)                                                |
| Node            | >=20                                                                    |
| Package manager | yarn                                                                    |
| Registry        | npm (`@netresearch` scope) + GitHub Packages                            |
| Docs            | https://netresearch.github.io/node-magento-eqp (TypeDoc, auto-deployed) |

### Downstream consumers

| Package                                                                                                    | Dep spec | API surface used                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@netresearch/node-red-contrib-magento-eqp`](https://github.com/netresearch/node-red-contrib-magento-eqp) | `^5.0.0` | `EQP` class, `HttpError`, `EQPStatusUpdateEvent`, `MalwareScanCompleteEvent`, `callbackService.parseCallback()`, `callbackService.registerCallback()` |

> **Do not break the public API** — all changes must stay semver-compatible within `^5.x`.

## Commands

> Source: CI (github-actions) + package.json — CI-sourced commands are most reliable

| Task               | Command              | ~Time |
| ------------------ | -------------------- | ----- |
| Install            | `yarn install`       | ~10s  |
| Build (lib + docs) | `yarn build`         | ~30s  |
| Build lib only     | `yarn build:lib`     | ~15s  |
| Build docs         | `yarn build:docs`    | ~20s  |
| Lint               | `yarn lint`          | ~10s  |
| Test               | `yarn test`          | ~1s   |
| Test + coverage    | `yarn test:coverage` | ~1s   |

> Tests use **vitest** with `@vitest/coverage-v8`. Coverage thresholds enforced at 95% (statements/branches/functions/lines). Currently at 100%.

## Workflow

1. **Before coding**: Read nearest `AGENTS.md` + check Golden Samples for the area you're touching
2. **After each change**: Run the smallest relevant check (lint → build)
3. **Before committing**: Run `yarn test && yarn lint && yarn build:lib`
4. **Before claiming done**: Run verification and **show output as evidence**

## Architecture

```
src/
├── index.ts              → EQP class (main entry point, re-exports all types)
├── FetchAdapter.ts       → FetchAdapter (default HTTP client using native fetch)
├── HttpError.ts          → HttpError class for non-2xx responses
├── AuthenticatedAdapter.ts → OAuth2 session + Bearer token injection
├── services/
│   ├── CallbackService.ts  → Webhook registration + event parsing
│   ├── FileService.ts      → File upload metadata
│   ├── KeyService.ts       → Magento access keys (M1/M2)
│   ├── PackageService.ts   → Extension/theme packages
│   ├── ReportService.ts    → Marketplace analytics (untyped, has pageviews/sales bug)
│   └── UserService.ts      → User profile CRUD
├── __tests__/              → vitest test suite (75 tests, 100% coverage)
│   ├── HttpError.test.ts
│   ├── FetchAdapter.test.ts
│   ├── AuthenticatedAdapter.test.ts
│   ├── EQP.test.ts
│   └── services/           → One test file per service
└── types/
    ├── adapters.ts    → Adapter interface
    ├── callbacks.ts   → Webhook event types
    ├── common.ts      → File, Magento1Key, Magento2Key
    ├── options.ts     → EQPOptions, Environment
    ├── packages.ts    → Package interface
    └── users.ts       → User, UserSummary
```

**Key patterns:**

- Adapter pattern for HTTP abstraction (`Adapter` interface → `FetchAdapter`)
- `AuthenticatedAdapter` wraps any `Adapter` with automatic OAuth2 token management
- `|MAGE_ID|` placeholder in URLs gets replaced with authenticated user's `mage_id`
- One service class per API domain, each receives the authenticated adapter

## File Map

```
src/              → TypeScript source (library code)
dist/             → Compiled output (gitignored)
docs/             → TypeDoc generated docs (gitignored, deployed to gh-pages)
coverage/         → v8 coverage reports (gitignored)
.github/workflows → CI/CD workflows
tsconfig.build.json → Build config (excludes __tests__ from output)
vitest.config.ts    → Test config (95% thresholds, v8 coverage)
```

## Golden Samples (follow these patterns)

| For              | Reference                                        | Key patterns                                             |
| ---------------- | ------------------------------------------------ | -------------------------------------------------------- |
| Service class    | `src/services/PackageService.ts`                 | Standard constructor, methods return typed promises      |
| Type definitions | `src/types/packages.ts`                          | Interface with JSDoc, exported via barrel                |
| Main entry       | `src/index.ts`                                   | Class with service accessors, re-exports types           |
| Service test     | `src/__tests__/services/CallbackService.test.ts` | Mock adapter + EQP, test each method, typed mock objects |
| Adapter test     | `src/__tests__/FetchAdapter.test.ts`             | vi.stubGlobal('fetch'), grouped by concern               |

## Heuristics (quick decisions)

| When                      | Do                                                        |
| ------------------------- | --------------------------------------------------------- |
| Committing                | Use Conventional Commits (`feat:`, `fix:`, `docs:`, etc.) |
| Adding dependency         | Ask first — this is a lightweight library, minimize deps  |
| Adding a new API endpoint | Create service method, add types, export from barrel      |
| Unsure about pattern      | Check `CallbackService.ts` as canonical example           |
| Changing public API       | Check downstream consumers table above first              |

## Repository Settings

- **Default branch:** `main`
- **Merge strategy:** rebase
- **Required checks:** Lint, Build, Test
- **Require up-to-date:** yes — rebase before merge
- **Dependency updates:** Renovate (auto-merge minor/patch)
- **Release flow:** release-please creates version-bump PR (auto) → auto-merge (auto) → maintainer pushes signed tag → CI publishes + creates GitHub Release

## Boundaries

### Always Do

- Run `yarn test && yarn lint && yarn build:lib` before committing
- Add tests for new code (maintain ≥95% coverage)
- Use TypeScript strict mode with proper type annotations
- Export new types from barrel files (`types/index.ts`, `src/index.ts`)
- Use conventional commit format: `type(scope): subject`
- **Show build/lint output as evidence before claiming work is complete**

### Ask First

- Adding new dependencies
- Modifying CI/CD configuration
- Changing public API signatures (check downstream consumers!)
- Bumping major version

### Never Do

- Commit secrets, credentials, or sensitive data
- Modify `node_modules/` or `dist/`
- Push directly to main branch
- Use `any` type without justification
- Break `^5.x` semver compatibility

## Index of scoped AGENTS.md

- `./src/AGENTS.md` — Backend services (TypeScript/Node.js)
- `./.github/workflows/AGENTS.md` — GitHub Actions workflows and CI/CD

## When instructions conflict

The nearest `AGENTS.md` wins. Explicit user prompts override files.
For TypeScript/JavaScript patterns, follow project eslint/prettier config.

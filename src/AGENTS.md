<!-- Managed by agent: keep sections and order; edit content, not structure. Last updated: 2026-03-02 -->

# AGENTS.md — src

## Overview

TypeScript API wrapper for Adobe Commerce (Magento) Marketplace EQP API. Adapter pattern with one service per API domain.

## Key Files

| File                          | Purpose                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| `index.ts`                    | `EQP` class — main entry point, instantiates services, re-exports all types              |
| `FetchAdapter.ts`             | `FetchAdapter` — default HTTP client using native `fetch`                                |
| `HttpError.ts`                | `HttpError` — error class for non-2xx HTTP responses                                     |
| `AuthenticatedAdapter.ts`     | OAuth2 session management, Bearer token injection, `\|MAGE_ID\|` replacement             |
| `services/CallbackService.ts` | Webhook registration (`registerCallback`) + event parsing (`parseCallback`)              |
| `services/FileService.ts`     | File upload metadata retrieval                                                           |
| `services/KeyService.ts`      | Magento access keys (M1/M2), overloaded method signatures                                |
| `services/PackageService.ts`  | Extension/theme package listing by submission or item ID                                 |
| `services/ReportService.ts`   | Marketplace analytics — has bug: `getSalesReports` uses same URL as `getPageviewReports` |
| `services/UserService.ts`     | User profile get/update                                                                  |
| `types/*.ts`                  | All type definitions (exported via `types/index.ts` barrel)                              |

## Golden Samples (follow these patterns)

| Pattern             | Reference                                    | Why                                              |
| ------------------- | -------------------------------------------- | ------------------------------------------------ |
| Service class       | `services/PackageService.ts`                 | Standard single-param constructor, typed methods |
| Type definitions    | `types/packages.ts`                          | Comprehensive interface with JSDoc comments      |
| Type-safe overloads | `services/KeyService.ts`                     | Method overloading for different return types    |
| Service test        | `__tests__/services/CallbackService.test.ts` | Mock EQP + adapter, test each method             |
| Adapter test        | `__tests__/FetchAdapter.test.ts`             | stubGlobal fetch, grouped by concern             |

## Code style & conventions

- TypeScript strict mode (`strict: true` in tsconfig)
- No `any` without explicit justification comment
- `interface` for object shapes, `type` for unions/intersections
- `PascalCase` for classes/types/interfaces, `camelCase` for functions/vars
- Async/await over raw Promises
- `const` over `let`, never `var`
- All service constructors take an `AuthenticatedAdapter` parameter (not the base `Adapter` interface)
- Export types from barrel files (`types/index.ts` → `index.ts`)

## Testing

- **Framework:** vitest with `@vitest/coverage-v8`
- **Config:** `vitest.config.ts` (root `./src`, 95% thresholds)
- **Build exclusion:** `tsconfig.build.json` excludes `__tests__/` and `*.test.ts` from dist
- **Pattern:** Tests live in `src/__tests__/`, mirroring the source structure
- **Mocking:** Use `vi.fn()` for adapter mocks, `vi.stubGlobal('fetch', ...)` for FetchAdapter tests, `vi.mock()` for module-level mocks
- **Coverage:** 75 tests, 100% coverage (statements/branches/functions/lines)

## Build & checks

| Task            | Command                                              |
| --------------- | ---------------------------------------------------- |
| Build lib       | `yarn build:lib` (runs `tsc -p tsconfig.build.json`) |
| Lint            | `yarn lint`                                          |
| Build docs      | `yarn build:docs` (runs TypeDoc)                     |
| Test            | `yarn test`                                          |
| Test + coverage | `yarn test:coverage`                                 |

## PR/commit checklist

- [ ] Tests pass: `yarn test`
- [ ] Lint clean: `yarn lint`
- [ ] Build clean: `yarn build:lib`
- [ ] Coverage ≥95%: `yarn test:coverage`
- [ ] No `any` types without justification
- [ ] New types exported from barrel files
- [ ] New code has corresponding tests
- [ ] Public API changes checked against downstream consumers (see root AGENTS.md)

## When stuck

- TypeScript handbook: https://www.typescriptlang.org/docs
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- Magento EQP API: https://developer.adobe.com/commerce/marketplace/guides/eqp/v1/
- Check root AGENTS.md for project-wide conventions

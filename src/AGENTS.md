<!-- Managed by agent: keep sections and order; edit content, not structure. Last updated: 2026-02-16 -->

# AGENTS.md — src

## Overview

TypeScript API wrapper for Adobe Commerce (Magento) Marketplace EQP API. Adapter pattern with one service per API domain.

## Key Files

| File                          | Purpose                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `index.ts`                    | `EQP` class — main entry point, instantiates services, re-exports all types  |
| `FetchAdapter.ts`             | `FetchAdapter` — default HTTP client using native `fetch`                    |
| `HttpError.ts`                | `HttpError` — error class for non-2xx HTTP responses                         |
| `AuthenticatedAdapter.ts`     | OAuth2 session management, Bearer token injection, `\|MAGE_ID\|` replacement |
| `services/CallbackService.ts` | Webhook registration (`registerCallback`) + event parsing (`parseCallback`)  |
| `services/FileService.ts`     | File upload metadata retrieval                                               |
| `services/KeyService.ts`      | Magento access keys (M1/M2), overloaded method signatures                    |
| `services/PackageService.ts`  | Extension/theme package listing by submission or item ID                     |
| `services/ReportService.ts`   | Marketplace analytics — TODO: methods are untested, need proper typings      |
| `services/UserService.ts`     | User profile get/update                                                      |
| `types/*.ts`                  | All type definitions (exported via `types/index.ts` barrel)                  |

## Golden Samples (follow these patterns)

| Pattern             | Reference                    | Why                                              |
| ------------------- | ---------------------------- | ------------------------------------------------ |
| Service class       | `services/PackageService.ts` | Standard single-param constructor, typed methods |
| Type definitions    | `types/packages.ts`          | Comprehensive interface with JSDoc comments      |
| Type-safe overloads | `services/KeyService.ts`     | Method overloading for different return types    |

## Code style & conventions

- TypeScript strict mode (`strict: true` in tsconfig)
- No `any` without explicit justification comment
- `interface` for object shapes, `type` for unions/intersections
- `PascalCase` for classes/types/interfaces, `camelCase` for functions/vars
- Async/await over raw Promises
- `const` over `let`, never `var`
- All service constructors take an `AuthenticatedAdapter` parameter (not the base `Adapter` interface)
- Export types from barrel files (`types/index.ts` → `index.ts`)

## Build & checks

| Task       | Command                          |
| ---------- | -------------------------------- |
| Build lib  | `yarn build:lib` (runs `tsc`)    |
| Lint       | `yarn lint`                      |
| Build docs | `yarn build:docs` (runs TypeDoc) |

## PR/commit checklist

- [ ] Lint clean: `yarn lint`
- [ ] Build clean: `yarn build:lib`
- [ ] No `any` types without justification
- [ ] New types exported from barrel files
- [ ] Public API changes checked against downstream consumers (see root AGENTS.md)

## When stuck

- TypeScript handbook: https://www.typescriptlang.org/docs
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- Magento EQP API: https://developer.adobe.com/commerce/marketplace/guides/eqp/v1/
- Check root AGENTS.md for project-wide conventions

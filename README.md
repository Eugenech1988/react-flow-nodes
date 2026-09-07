# Pipeline Automation Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Bun](https://img.shields.io/badge/Bun-1.3%2B-f5f5f5?logo=javascript)](https://bun.sh/)
[![TurboRepo](https://img.shields.io/badge/TurboRepo-%E2%9C%93-8fd5ff?logo=turbo)](https://turbo.build/repo)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js)](https://nodejs.org/)

## Table of Contents
- [Overview](#overview)
- [Monorepo Structure](#monorepo-structure)
- [Quick Start](#quick-start)
- [Development Commands](#development-commands)
- [Testing](#testing)
- [Linting & Formatting](#linting--formatting)
- [Building for Production](#building-for-production)
- [Packages](#packages)
  - [UI Components](#ui-components)
  - [Contracts](#contracts)
  - [ESLint & TypeScript Configs](#eslint--typescript-configs)
- [Applications](#applications)
  - [React (pipelines‑app)](#react-pipelines‑app)
  - [Astro Landing (pipelines‑landing)](#astro-landing-pipelines‑landing)
  - [NestJS API (pipeline‑api)](#nestjs-api-pipeline‑api)
- [Deep Dive: API Architecture](#deep-dive-api-architecture)
- [Deep Dive: React Architecture & Data Flow](#deep-dive-react-architecture--data-flow)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This repository implements a full‑stack pipeline/workflow automation platform managed as a **Bun** monorepo with **TurboRepo**. It provides:
- A visual flow‑editor UI built with React, Vite, and **React Flow**.
- A NestJS backend exposing a type‑safe **tRPC** API powered by Prisma.
- A marketing landing site built with Astro.
- Shared UI primitives and contract schemas for consistency across the stack.

The project follows **Feature‑Sliced Design (FSD)** in the React app and adheres to strict TypeScript and ESLint rules for a high‑quality codebase.

---

## Monorepo Structure

```
.
├─ apps/                     # Individual applications
│   ├─ react/                # Vite + React UI (pipelines‑app)
│   ├─ astro/                # Astro marketing site (pipelines‑landing)
│   └─ api/                  # NestJS backend (pipeline‑api)
├─ packages/                 # Shared libraries and configs
│   ├─ ui/                   # UI component library (Tailwind, Radix, Sonner)
│   ├─ contracts/            # Zod schemas & shared types
│   ├─ eslint-config/        # Central ESLint configuration
│   └─ typescript-config/    # Base tsconfig.json
├─ .github/                  # CI/CD workflows (if any)
├─ turbo.json                # TurboRepo pipeline definition
├─ bun.lockb                 # Bun lockfile
└─ README.md                 # *This file*
```

All workspaces share the `@/*` alias for internal imports (e.g., `import { Foo } from '@/features/foo'`).

---

## Quick Start

```bash
# 1. Ensure you have Bun ≥ 1.3 and Node ≥ 22.12 (required for Astro)
brew install bun   # macOS (or follow https://bun.sh)

# 2. Install workspace dependencies
cd /Users/eugene/WebstormProjects/untitled11
bun install

# 3. Run all apps in parallel (Turbo will start Vite, Astro dev server, and NestJS)
bun run dev
```

Open your browser:
- **React UI:** `http://localhost:5173`
- **Astro Landing:** `http://localhost:4321`
- **API (Swagger UI):** `http://localhost:3000`

---

## Development Commands

| Command | Description |
|---|---|
| `bun install` | Install dependencies for the entire workspace |
| `bun run dev` | Start **all** Turbo dev tasks (`apps/*` in parallel) |
| `bun --filter pipelines-app run dev` | Run only the React UI |
| `bun --filter pipelines-landing run dev` | Run only the Astro site |
| `bun --filter @pipeline/api run dev` | Run only the NestJS API |
| `bun run lint` | Run ESLint across all packages/apps |
| `bun run check-types` | Type‑checking via `tsc` for the whole repo |
| `bun run format:check` | Verify Prettier formatting |
| `bun run format` | Auto‑format all files (use sparingly) |
| `bun run build` | Build **all** apps/packages for production |
| `bun --filter pipelines-app run test` | Run Vitest suite for the React app |
| `bun --filter @pipeline/api run test` | Run Jest unit tests for the API |
| `bun --filter @pipeline/api run test:e2e` | Run Jest E2E tests for the API |

---

## Testing

- **React**: Vitest + React Testing Library (`*.test.{ts,tsx}`) located next to the component.
- **API**: Jest (`*.spec.ts`) for services/controllers and `test/*.e2e-spec.ts` for end‑to‑end tests.

All tests can be executed via the commands above or through the Turbo pipeline `bun run test`.

---

## Linting & Formatting

The repository uses a shared ESLint config (`packages/eslint-config`) and Prettier. The recommended workflow is:

```bash
# Lint
bun run lint

# Type‑check
bun run check-types

# Format check (CI will fail on mismatches)
bun run format:check
```

If you need to automatically fix formatting, run `bun run format`.

---

## Building for Production

```bash
# Build every app and package
bun run build
```

The output directories are:
- `apps/react/dist/`
- `apps/astro/dist/`
- `apps/api/dist/`
- `packages/ui/dist/`

Deploy the compiled assets according to your hosting strategy (e.g., Vercel for Astro, Docker for the API, static hosting for the React build).

---

## Packages

### UI Components (`@pipeline/ui`)

A Tailwind‑CSS v4‑based component library that includes:
- Base UI primitives (Radix, Base UI)
- Icon set (Lucide)
- Toast notifications (Sonner)
- Utility `cn()` helper for class merging

Import via `import { Button } from '@pipeline/ui'`.

### Contracts (`@pipeline/contracts`)

Contains shared **Zod** schemas, DTOs, and TypeScript types used by both the API and the React client to guarantee end‑to‑end type safety. Core contracts live in `packages/contracts/src/` (e.g., `database‑nodes.ts`).

### ESLint & TypeScript Configs

Centralized configurations live in `packages/eslint-config` and `packages/typescript-config`. They are referenced through the workspace `tsconfig.json` files.

---

## Applications

### React (pipelines‑app)

- **Stack:** React 19, Vite 8, React Compiler, Tailwind v4, Zustand, Framer Motion, Radix UI, React Hook Form + Zod, TanStack Query v5, tRPC v11.
- **Structure:** Feature‑Sliced Design under `src/` (app, pages, widgets, features, entities, shared).
- **Entry point:** `src/main.tsx`.
- **Key directories:**
  - `src/app/` – providers (Router, QueryClient, tRPC client).
  - `src/entities/` – domain models (pipeline, node definitions).
  - `src/features/` – business logic (node CRUD, sharing, execution).
  - `src/widgets/` – composite UI blocks (pipeline canvas, node inspector).
  - `src/shared/` – reusable hooks (`usePipelines.ts`), API client wrappers, UI primitives.

#### Data Flow Example
```tsx
// src/features/manage-nodes/components/DatabaseNode.tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { trpc } from '@/shared/trpc';

const schema = z.object({
  name: z.string().min(1),
  connectionString: z.string().url(),
});

export function DatabaseNode({ node }) {
  const utils = trpc.useContext();
  const mutation = trpc.node.updateDatabaseNode.useMutation({
    onSuccess: () => utils.node.invalidate(),
  });
  // component implementation …
}
```
The component uses the shared **tRPC** client generated from the contracts package, ensuring type‑safe server calls.

---

### Astro Landing (pipelines‑landing)

- **Stack:** Astro 7, React 19 islands, Tailwind v4, Lucide icons.
- **Pages:** Located in `src/pages/` and `src/layouts/`.
- **Static/Public assets:** `public/` folder.

---

### NestJS API (pipeline‑api)

- **Stack:** NestJS 11, Prisma 7, PostgreSQL, tRPC v11, Inngest 4, Passport (OAuth + JWT), Argon2, Nodemailer, Google AI SDK.
- **Key directories:**
  - `src/` – core application code.
  - `src/modules/` – feature modules (e.g., `database‑nodes/`).
  - `src/trpc/` – tRPC router (`app‑router.ts`) exposing procedures that map directly to contracts in `@pipeline/contracts`.
  - `prisma/` – Prisma schema (`schema.prisma`) and migrations.
  - `test/` – Jest unit tests.
  - `test/*.e2e‑spec.ts` – End‑to‑end integration tests.

#### API Architecture Overview
- **tRPC Layer** – Defined in `src/trpc/app‑router.ts`. Each procedure validates inputs using Zod schemas from `@pipeline/contracts` and returns typed responses.
- **Service Layer** – Business logic lives in `src/modules/*/services/*`. Services are injected via Nest's DI and interact with Prisma.
- **Controller Layer** – HTTP endpoints (`src/modules/*/controllers/*`) expose Swagger UI and optional REST fallback, but most UI interaction goes through tRPC.
- **Background Jobs** – Inngest workflows are defined under `src/ingest/` and triggered by service actions (e.g., pipeline execution).

#### Example tRPC Procedure
```ts
// src/trpc/database‑nodes.ts
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/trpc/trpc';
import { prisma } from '@/prisma';
import { databaseNodeSchema } from '@pipeline/contracts';

export const databaseNodeRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return prisma.databaseNode.findMany();
  }),
  create: publicProcedure
    .input(databaseNodeSchema)
    .mutation(async ({ input }) => {
      return prisma.databaseNode.create({ data: input });
    }),
});
```
The same `databaseNodeSchema` lives in `packages/contracts/src/database‑nodes.ts`, guaranteeing the React client and the API share identical validation.

---

## Deep Dive: API Architecture

1. **Entry Point** – `src/main.ts` bootstraps NestJS, registers the tRPC module, and connects Prisma.
2. **tRPC Integration** – The `TrpcModule` registers the router built from sub‑routers (`pipeline`, `node`, `user`, etc.). The router is exported via `src/trpc/app‑router.ts` and re‑exported in the package root for the client to consume.
3. **Prisma ORM** – All data models are defined in `prisma/schema.prisma`. After changes run `bun prisma generate` to sync types.
4. **Authentication** – Passport strategies (`GoogleStrategy`, `GithubStrategy`, `JwtStrategy`) are configured in `src/auth/`. tRPC procedures use `publicProcedure` or `protectedProcedure` wrappers that inject the authenticated user.
5. **Background Processing** – Inngest workflows (`src/ingest/workflows/`) handle long‑running pipeline executions. Jobs are enqueued via `ingestClient.send()` from services.
6. **Error Handling** – API errors are normalized into `TRPCError` with appropriate codes (`INTERNAL_SERVER_ERROR`, `BAD_REQUEST`).
7. **Testing** – Unit tests mock Prisma via `@prisma/client/runtime` and use `TestingModule` to instantiate services. E2E tests spin up the Nest application and make real HTTP/tRPC calls.

### Useful Files
- **tRPC Router**: [`src/trpc/app-router.ts`](file:///Users/eugene/WebstormProjects/untitled11/apps/api/src/trpc/app-router.ts)
- **Prisma Schema**: [`prisma/schema.prisma`](file:///Users/eugene/WebstormProjects/untitled11/apps/api/prisma/schema.prisma)
- **Auth Module**: [`src/auth/auth.module.ts`](file:///Users/eugene/WebstormProjects/untitled11/apps/api/src/auth/auth.module.ts)
- **Database Node Service**: [`src/modules/database-nodes/database-nodes.service.ts`](file:///Users/eugene/WebstormProjects/untitled11/apps/api/src/modules/database-nodes/database-nodes.service.ts)

---

## Deep Dive: React Architecture & Data Flow

1. **Feature‑Sliced Design** – Each feature lives under `src/features/<feature>/` and contains:
   - `components/` – UI components specific to the feature.
   - `hooks/` – Custom hooks encapsulating state & API calls.
   - `store/` – Zustand slices (if needed).
   - `types/` – Feature‑specific TypeScript types (often re‑exported from contracts).
2. **tRPC Client** – Initialized once in `src/app/trpc.tsx`:
   ```tsx
   import { createTRPCReact } from '@trpc/react-query';
   import type { AppRouter } from '@pipeline/api/trpc';
   export const trpc = createTRPCReact<AppRouter>();
   ```
   The client automatically uses the contracts' Zod schemas for input validation.
3. **State Management** – Global UI state (selected pipeline, theme) lives in `src/shared/state/`. Feature‑local state is often kept in React Query caches via `trpc`.
4. **Component Example** – `DatabaseNode.tsx` (shown above) demonstrates:
   - Using `react-hook-form` with Zod schema from contracts.
   - Calling `trpc.node.updateDatabaseNode` mutation.
   - Optimistic UI updates via `trpc.useContext()`.
5. **Styling** – All components use Tailwind‑CSS utilities via the `cn()` helper from `@pipeline/ui`.
6. **Routing** – `src/app/router.tsx` defines routes with `react-router-dom` (or `wouter`). Lazy‑load feature bundles via `React.lazy` and `Suspense`.
7. **Testing** – Components are tested with Vitest + React Testing Library. Mock `trpc` client using `msw` or `@trpc/client` test utilities.

### Key Files
- **tRPC Provider**: [`src/app/trpc.tsx`](file:///Users/eugene/WebstormProjects/untitled11/apps/react/src/app/trpc.tsx)
- **Main Entry**: [`src/main.tsx`](file:///Users/eugene/WebstormProjects/untitled11/apps/react/src/main.tsx)
- **Database Node Component**: [`src/features/manage-nodes/components/DatabaseNode.tsx`](file:///Users/eugene/WebstormProjects/untitled11/apps/react/src/features/manage-nodes/components/DatabaseNode.tsx)
- **Contracts Index**: [`packages/contracts/src/index.ts`](file:///Users/eugene/WebstormProjects/untitled11/packages/contracts/src/index.ts)

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/awesome-feature`).
3. Follow the **commit convention**: lower‑case imperative description (e.g., `add pipeline sharing`).
4. Ensure lint, type‑check and format pass.
5. Write tests for any new behavior.
6. Open a Pull Request describing the change, linking any related issue, and include screenshots for UI changes.

---

## License

MIT © 2026 Eugene.

---
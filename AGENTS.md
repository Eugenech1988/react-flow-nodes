# Repository Guidelines

## Project Structure & Module Organization

This is a Bun workspace managed with Turborepo. Applications live in `apps/`:

- `apps/react/` is the Vite + React pipeline UI. Organize code by layer under `src/app`, `pages`, `widgets`, `features`, `entities`, and `shared`.
- `apps/astro/` is the Astro landing site; pages, layouts, and components are under `src/`.
- `apps/api/` is the NestJS API; source is in `src/`, E2E tests in `test/`, and Prisma files in `prisma/`.
- `packages/ui/` contains shared UI primitives; `packages/eslint-config/` and `packages/typescript-config/` provide shared tooling.

Keep images and other static files in an app's `public/` directory. Use each package's existing barrel (`index.ts`/`index.tsx`) when exposing public modules.

## Build, Test, and Development Commands

Use Bun 1.3+ (Node 18+ is required at the workspace level; the Astro app requires Node 22.12+).

```sh
bun install                         # install workspace dependencies
bun run dev                         # start all Turbo dev tasks
bun run build                       # build all packages/apps
bun run lint                        # run configured linters
bun run check-types                 # run Turbo type-check tasks
bun run format:check                # verify Prettier formatting
bun --filter pipelines-app run test # run React Vitest suite
bun --filter pipelines-backend run test:e2e # run API Jest E2E tests
```

Run `bun --filter <package> run dev` for a single app. Use `bun run format` only when you intend to rewrite formatting.

## Coding Style & Naming Conventions

Write TypeScript and follow the local ESLint and Prettier configuration; do not hand-format around their output. React uses PascalCase components (for example, `PipelineCard.tsx`), camelCase hooks/utilities (`usePipelinesFilter.tsx`), and colocated `*.test.tsx` tests. Prefer the existing `@/` alias in the React app and keep feature-specific code inside its feature directory. Tailwind utilities and shared components should follow nearby patterns.

## Testing Guidelines

React tests use Vitest, Testing Library, and jsdom; name them `*.test.ts` or `*.test.tsx` next to the unit under test. API unit tests use Jest `*.spec.ts`; E2E tests use `test/*.e2e-spec.ts`. Add focused tests for behavior changes. No repository-wide coverage threshold is configured, but run the relevant suite before submitting.

## Commit & Pull Request Guidelines

Recent commits use short, lowercase, imperative descriptions such as `auth form` and `search fix`. Keep commits focused; use a brief scope when it clarifies intent. Pull requests should explain the change and validation performed, link the issue when available, and include screenshots or recordings for visible React/Astro UI changes. Do not commit secrets, local `.env` files, build output, or unrelated generated files.

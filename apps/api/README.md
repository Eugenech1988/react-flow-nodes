# Pipeline Studio API

Backend application for Pipeline Studio, built with NestJS. Handles authentication, pipeline management, job vacancies, file uploads, billing, blog, and email notifications.

This project is part of a monorepo powered by **Turborepo** and **Bun**.

## 📑 Table of Contents

- [ Tech Stack](#tech-stack)
- [ Project Structure & Modules](#project-structure--modules)
- [ tRPC Architecture](#trpc-architecture)
- [ Project Setup](#project-setup)
    - [Environment Variables](#environment-variables)
    - [Database Setup & Seeding](#database-setup--seeding)
- [ Running the Application](#running-the-application)
- [ API Documentation](#api-documentation)
- [ Running Tests](#running-tests)
- [ File Uploads & Storage](#file-uploads--storage)
- [ Email Templates](#email-templates)
- [ Deployment Checklist](#deployment-checklist)

---
---

## Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) (v11)
- **Database ORM:** [Prisma](https://www.prisma.io/) (using `@prisma/adapter-pg` for connection pooling)
- **Database:** PostgreSQL
- **API Layer:** [tRPC](https://trpc.io/) (for end-to-end type safety) + REST (for file uploads & webhooks)
- **Validation:** [Zod](https://zod.dev/) (shared contracts via `@pipeline/contracts`) & `class-validator`
- **Authentication:** Passport.js (JWT, Google, GitHub OAuth) + `argon2` for hashing + `otplib` for 2FA
- **Payments:** [Stripe](https://stripe.com/)
- **Background Jobs:** [Inngest](https://www.inngest.com/)
- **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/docs) (`@ai-sdk/google`)
- **Mailer:** `@nestjs-modules/mailer` (Handlebars templates)
- **Testing:** Jest + Supertest

## Project Structure & Modules

The `src` directory is organized into domain-driven modules. Each module typically exposes both **tRPC routers** (for frontend) and **REST controllers** (for file uploads, webhooks, or external integrations).

- **`applications`** — Handles job applications. Receives `multipart/form-data` via Multer, saves resumes and cover letters, increments the `applications` counter, and sends an email with download links.
- **`auth`** — Authentication and authorization (JWT, Password Recovery, OAuth, 2FA).
- **`billing`** — Stripe integration. Manages checkout sessions, handles Stripe webhooks (requires raw body), generates and downloads PDF invoices, and cancels subscriptions.
- **`blog`** — CRUD for blog posts. Includes public endpoints and admin endpoints for creation and publishing.
- **`common`** — Shared utilities, custom decorators (e.g., `@CurrentUser`, `@Roles`), guards (e.g., `JwtAuthGuard`, `RolesGuard`), and global filters.
- **`database-nodes`** — Logic for database-specific nodes within the visual pipeline builder.
- **`executions`** — Tracks pipeline runs. Provides pagination, search filtering, status updates, and formats execution duration into `MM.SS`.
- **`inngest`** — Background job processing and event-driven workflows.
- **`jobs`** — Job vacancies management. Includes public endpoints for fetching published vacancies and admin endpoints for full CRUD.
- **`mail`** — Centralized email service using Handlebars templates (`request.hbs`, `application.hbs`, `recovery.hbs`).
- **`pipelines`** — Manages visual pipelines. Supports creating, updating, and deleting pipelines, processing base64 screenshots, handling graph data (JSON), and managing uploaded screenshot files on disk.
- **`prisma`** — Database access layer. Exports the `PrismaService` (configured with `PrismaPg` adapter) and handles the database connection lifecycle.
- **`profile`** — User profile management. Handles updating user details and processing avatar uploads (supports both `multipart/form-data` and base64 strings).
- **`trpc`** — Centralized tRPC setup. Contains context creation (extracting JWT from cookies), middleware/procedures, and the main app router.
- **`users`** — Core user entity management. Handles registration (with `argon2` hashing), password updates, account deletion (cascading), and admin-level listing (RBAC).

## tRPC Architecture

The API uses tRPC for type-safe client-server communication. It is structured as follows:

### 1. Context (`trpc/context.ts`)
Creates a context object for every request. It extracts the `accessToken` from HTTP-only cookies, verifies it using `JwtService`, and fetches the `UserWithRelations` object from the database. If the token is invalid or missing, `user` is set to `null`.

### 2. Procedures (`trpc/init.ts`)
We use custom procedures to enforce authorization at the router level:
- `publicProcedure` — No auth required.
- `protectedProcedure` — Requires an authenticated user (throws `UNAUTHORIZED` if `ctx.user` is missing).
- `contentManagerProcedure` — Requires a user with `CONTENT_MANAGER` or `SUPER_ADMIN` role.
- `superAdminProcedure` — Requires a user with `SUPER_ADMIN` role.

### 3. App Router (`trpc/app-router.ts`)
The main `createAppRouter` function aggregates all sub-routers (auth, users, billing, pipelines, etc.) into a single, typesafe `AppRouter`. This type is exported and used by the frontend to ensure end-to-end type safety.

## Project Setup

Since this is a monorepo, dependencies should be installed from the root of the project.

```bash
# Install dependencies (from monorepo root)
$ bun install
```

## Environment Variables

Create a .env file in the apps/api directory based on the .env.example provided. You will need to configure:

| Variable | Description |
| :--- | :--- |
| **Database** | |
| `DATABASE_URL` | PostgreSQL connection string |
| **App & Client URLs** | |
| `FRONTEND_URL` | Frontend URL for Stripe redirects (e.g., `http://localhost:5173`) |
| `API_URL` | Base URL of the API (used to generate absolute links for uploaded files, e.g., `http://localhost:3000`) |
| `ADMIN_EMAIL` | Email address where inquiries and job applications are sent |
| `CSRF_SECRET` | Secret key for CSRF protection (used in `main.ts`) |
| **JWT Auth** | |
| `JWT_ACCESS_SECRET` | Secret for signing short-lived access tokens |
| `JWT_ACCESS_TEMP_EXPIRES` | Expiration for temporary access tokens (e.g., during 2FA) |
| `JWT_ACCESS_EXPIRES` | Expiration time for standard access tokens (e.g., `15m`) |
| `JWT_REFRESH_SECRET` | Secret for signing long-lived refresh tokens |
| `JWT_REFRESH_EXPIRES` | Expiration time for refresh tokens (e.g., `7d`) |
| `JWT_RECOVERY_SECRET` | Secret for signing temporary password recovery tokens |
| **OAuth Google** | |
| `GOOGLE_CLIENT_ID` | Google OAuth App Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth App Client Secret |
| `GOOGLE_CALLBACK_URL` | Redirect URI configured in Google Cloud Console |
| **OAuth GitHub** | |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret |
| `GITHUB_CALLBACK_URL` | Redirect URI configured in GitHub Developer Settings |
| **Stripe Payments** | |
| `STRIPE_SECRET_KEY` | Stripe API Secret Key (`sk_test_...` or `sk_live_...`) |
| `STRIPE_PRO_PRICE_ID` | Stripe Price ID for the "Pro" subscription plan |
| `STRIPE_ENTERPRISE_PRICE_ID` | Stripe Price ID for the "Enterprise" subscription plan |
| `STRIPE_WEBHOOK_SECRET` | Secret for verifying Stripe webhook signatures (`whsec_...`) |
| **Mail SMTP Server** | |
| `MAIL_HOST` | SMTP server hostname (e.g., `smtp.gmail.com` or `sandbox.smtp.mailtrap.io`) |
| `MAIL_PORT` | SMTP port (e.g., `587`, `465`, or `2525` for Mailtrap) |
| `MAIL_USER` | SMTP username |
| `MAIL_PASSWORD` | SMTP password |
| `MAIL_FROM` | Default "From" address for outgoing emails |

## Database Setup & Seeding
Make sure your PostgreSQL instance is running. To apply the Prisma schema to your database, run:

```bash
# Push schema to database (development)
$ bunx prisma db push

# Or apply migrations (production/recommended)
$ bunx prisma migrate dev

# Generate the Prisma Client
$ bunx prisma generate
To populate the database with initial job vacancies (for testing):
```

```bash
$ bun run db:seed:jobs
```

## Running the Application
From the monorepo root, you can start the API along with other apps:

```bash
# Start all apps in watch mode
$ bun dev
```

If you are inside the apps/api directory, use:

```bash
# development / watch mode
$ bun run dev

# production mode (requires build first)
$ bun run build
$ bun run start:prod
```

## API Documentation
**Swagger UI**: is available at:


`'http://localhost:3000/api/docs`

**tRPC:** Handled dynamically via `@/trpc` (used by the frontend for type-safe queries/mutations).

# Running Tests
```bash
# unit tests
$ bun run test

# e2e tests
$ bun run test:e2e

# test coverage
$ bun run test:cov
```


## File Uploads & Storage
Uploaded files (resumes, cover letters) are stored locally in the ./uploads directory.

- **Path Structure:** ./uploads/applications/{jobId}/cvs/ and ./uploads/applications/{jobId}/covers/

- **Static Serving:** The API serves this directory at `/uploads/...`.

- **Production Note:** Ensure the `uploads` folder is persistent (e.g., mounted as a Docker volume) when deploying.

## Email Templates
Email templates are written in Handlebars (.hbs) and stored in apps/api/src/mail/templates/.
When building the project for production, ensure that nest-cli.json is configured to copy these assets to the dist folder:

```json
{
  "assets": [
      {
      "include": "mail/templates/**/*",
      "watchAssets": true
      }
  ]
}
```

## Deployment Checklist
Run `bun run build.`

Run database migrations `(bunx prisma migrate deploy).`

Set all production environment variables.

Ensure uploads folder has write permissions and is persisted.

Configure Stripe webhook endpoint to point to `https://your-api.com/billing/webhook.`

Add the production frontend URL to CORS settings and Stripe redirect URLs.
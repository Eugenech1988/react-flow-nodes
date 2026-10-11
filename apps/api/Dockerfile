FROM node:22-bookworm-slim

WORKDIR /workspace

RUN npm install --global bun@1.4.2

COPY package.json bun.lock turbo.json ./
COPY apps/react/package.json ./apps/react/package.json
COPY apps/astro/package.json ./apps/astro/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages ./packages

RUN bun install --frozen-lockfile
RUN bun run --filter @pipeline/contracts build

COPY apps/api ./apps/api

RUN cd apps/api && DATABASE_URL=postgresql://pipeline:pipeline@localhost:5432/pipeline bunx prisma generate

WORKDIR /workspace/apps/api

EXPOSE 3000

CMD ["sh", "-c", "bunx prisma migrate deploy && node node_modules/@nestjs/cli/bin/nest.js start --watch"]

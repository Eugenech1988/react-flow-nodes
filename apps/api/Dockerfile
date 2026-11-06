FROM node:22-bookworm-slim

RUN npm install --global bun@1.4.2

WORKDIR /workspace

COPY package.json bun.lock turbo.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/react/package.json ./apps/react/package.json
COPY apps/next/package.json ./apps/next/package.json
COPY packages ./packages

RUN bun install

RUN bun run --filter @pipeline/contracts build

COPY apps/api ./apps/api

RUN cd apps/api && DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" bunx prisma generate

WORKDIR /workspace/apps/api

EXPOSE 3000

# Запускаем миграции и NestJS
CMD ["sh", "-c", "bunx prisma migrate deploy && bunx nest start --watch"]
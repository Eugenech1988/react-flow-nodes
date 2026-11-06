FROM oven/bun:1.4-alpine AS base
WORKDIR /app

FROM base AS pruner
RUN apk add --no-cache libc6-compat
COPY . .
RUN bun x turbo prune pipelines-next --docker

FROM base AS builder
RUN apk add --no-cache libc6-compat

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lockb ./bun.lockb
RUN bun install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
RUN bun x turbo run build --filter=pipelines-next...

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=4321
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/next/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/next/.next/static ./apps/next/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/next/public ./apps/next/public

USER nextjs

EXPOSE 4321

CMD ["bun", "apps/next/server.js"]
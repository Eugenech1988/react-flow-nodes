FROM oven/bun:1.4.2

WORKDIR /workspace

COPY package.json bun.lock turbo.json ./
COPY apps/react/package.json ./apps/react/package.json
COPY apps/astro/package.json ./apps/astro/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages ./packages

RUN bun install --frozen-lockfile
RUN bun run --filter @pipeline/contracts build

COPY apps/astro ./apps/astro

EXPOSE 4321

CMD ["bun", "run", "--filter", "pipelines-landing", "dev", "--host", "0.0.0.0"]

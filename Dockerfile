FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM deps AS builder
ARG DATABASE_URL
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG ONX_FOUNDER_EMAIL
ARG ONX_FOUNDER_PASSWORD
ARG ONX_FOUNDER_NAME
ENV DATABASE_URL=${DATABASE_URL}
ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV BETTER_AUTH_URL=${BETTER_AUTH_URL}
ENV ONX_FOUNDER_EMAIL=${ONX_FOUNDER_EMAIL}
ENV ONX_FOUNDER_PASSWORD=${ONX_FOUNDER_PASSWORD}
ENV ONX_FOUNDER_NAME=${ONX_FOUNDER_NAME}
WORKDIR /app
COPY . .
RUN bun run build

FROM oven/bun:1-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder --chown=bun:bun /app/package.json ./package.json
COPY --from=builder --chown=bun:bun /app/bun.lock ./bun.lock
COPY --from=builder --chown=bun:bun /app/node_modules ./node_modules
COPY --from=builder --chown=bun:bun /app/.next ./.next
COPY --from=builder --chown=bun:bun /app/public ./public
COPY --from=builder --chown=bun:bun /app/next.config.ts ./next.config.ts
USER bun
EXPOSE 3000
CMD ["bun", "run", "start"]

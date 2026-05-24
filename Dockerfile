FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat python3 make g++

FROM base AS builder
WORKDIR /app
# Development NODE_ENV so devDependencies (TypeScript etc.) install
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
ARG DATABASE_URI
ARG PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
RUN node node_modules/.bin/payload generate:importmap || true
RUN node node_modules/.bin/next build
# Create initial migration file from collections schema
RUN node_modules/.bin/tsx node_modules/.bin/payload migrate:create --name=initial 2>/dev/null || true

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/src ./src
# Copy migrations generated at build time
COPY --from=builder /app/migrations ./migrations

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run migrations then start the server
CMD ["sh", "-c", "node_modules/.bin/tsx node_modules/.bin/payload migrate 2>&1 || echo 'Migrations already applied'; node_modules/.bin/next start"]

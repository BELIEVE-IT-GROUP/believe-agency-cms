FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat python3 make g++

FROM base AS deps
WORKDIR /app
# Force development so devDependencies (typescript, etc.) are installed
ENV NODE_ENV=development
COPY package.json ./
RUN npm install --legacy-peer-deps

FROM base AS builder
WORKDIR /app
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Payload import map so admin chunks are properly isolated
ARG DATABASE_URI
ARG PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
RUN node node_modules/.bin/payload generate:importmap || true
# Limit workers to avoid EAGAIN on constrained VPS
RUN node node_modules/.bin/next build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]

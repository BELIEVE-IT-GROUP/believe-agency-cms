FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat python3 make g++

FROM base AS builder
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json ./
# --include=dev installs TypeScript and other devDependencies needed for build
RUN npm install --legacy-peer-deps --include=dev
COPY . .
ARG DATABASE_URI
ARG PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
RUN node node_modules/.bin/payload generate:importmap || true
RUN node node_modules/.bin/next build
RUN mkdir -p migrations

FROM base AS runner
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/migrations ./migrations

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# NODE_ENV=development so Payload's connect() runs pushDevSchema to create tables on first startup
CMD ["sh", "-c", "NODE_ENV=development exec node_modules/.bin/next start"]

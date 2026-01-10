# 1. Base image
FROM node:20-alpine AS base

# 2. Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# ============================================================
# Build-time environment variables (placeholders for static generation)
# Real values are injected at runtime via Coolify Environment Variables
# These are ONLY used during `npm run build` to satisfy Next.js
# ============================================================
ARG MONGODB_URI="mongodb://placeholder:27017/placeholder"
ARG JWT_SECRET="build-time-placeholder-secret-32chars"
ARG NEXTAUTH_SECRET="build-time-placeholder-secret"
ARG NEXTAUTH_URL="http://localhost:3000"
ARG ADMIN_PASSWORD="build-placeholder"
ARG ADMIN_SESSION_SECRET="build-time-placeholder-secret-32chars"
ARG GROQ_API_KEY="placeholder"
ARG NEXT_PUBLIC_GA_ID="G-PLACEHOLDER"
ARG NEXT_PUBLIC_SITE_URL="https://andrewaltair.ge"
ARG NEXT_PUBLIC_BASE_URL="http://localhost:3000"

ENV MONGODB_URI=${MONGODB_URI}
ENV JWT_SECRET=${JWT_SECRET}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}
ENV ADMIN_SESSION_SECRET=${ADMIN_SESSION_SECRET}
ENV GROQ_API_KEY=${GROQ_API_KEY}
ENV NEXT_PUBLIC_GA_ID=${NEXT_PUBLIC_GA_ID}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}

RUN npm run build

# 4. Production Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create system group/user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Set permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone build
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Port is configurable via Coolify Environment Variables
# Default: 3001 (set in Coolify or override at runtime)
# Next.js standalone server automatically reads PORT env var
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

# ---------- Builder ----------
FROM node:20-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
RUN npm ci

# Copy source and build Next.js (standalone)
COPY . .
RUN npm run build

# ---------- Runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Cloud Run listens on 8080
ENV PORT=8080 HOST=0.0.0.0

# Copy the minimal runtime produced by "output: 'standalone'"
COPY --from=builder /app/.next/standalone ./
# Static assets
COPY --from=builder /app/.next/static ./.next/static
# Public assets (favicons, images…)
COPY --from=builder /app/public ./public

# (Optional) run as non-root
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
USER nextjs

EXPOSE 8080
CMD ["node", "server.js"# ---------- Builder ----------
FROM node:20-alpine AS builder

# Required for some dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./

# If package-lock.json exists -> npm ci, else npm install
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps; \
    else \
      npm install --legacy-peer-deps; \
    fi

# Copy all app files
COPY . .

# Build Next.js (will output to .next)
RUN npm run build

# ---------- Runner ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built app & assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 8080

CMD ["npm", "start"]

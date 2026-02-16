FROM node:20-bookworm-slim AS base
WORKDIR /usr/app

FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM base AS prod-deps
ENV NODE_ENV=production
ENV PORT=1338
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev && npm cache clean --force

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=1338
WORKDIR /usr/app

COPY --from=prod-deps /usr/app/node_modules ./node_modules
COPY --from=build /usr/app/dist ./dist
COPY prisma ./prisma

EXPOSE 1338
USER node
CMD ["node", "dist/infra/server/index.js"]


# Build
FROM node:22-alpine3.22 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx svelte-kit sync

RUN npx prisma generate

RUN npm run build
RUN npm prune --production


# Last stage
FROM node:22-alpine3.22

WORKDIR /app

COPY --from=builder /app/prisma prisma/

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

CMD ["node", "build"]
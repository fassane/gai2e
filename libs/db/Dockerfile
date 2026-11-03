# Image one-shot qui applique les migrations Prisma (`prisma migrate deploy`)
# avant chaque déploiement. L'image de l'API ne contient ni le CLI ni les migrations.
FROM node:24-alpine

ARG PRISMA_VERSION=7.10.1

WORKDIR /app
RUN npm init -y >/dev/null \
  && npm install --no-audit --no-fund prisma@${PRISMA_VERSION} dotenv \
  && npm cache clean --force

COPY prisma.config.ts ./
COPY libs/db/prisma ./libs/db/prisma

USER node
CMD ["npx", "prisma", "migrate", "deploy"]

# Image construite par la CI à partir du build Nx (`nx build api`), qui produit
# dist/apps/api/main.js et un package.json aux versions exactes.
FROM node:24-alpine

# Le client Prisma généré est bundlé dans main.js, mais son runtime (@prisma/client)
# n'est pas détecté par Nx (dossier généré ignoré par git) : on l'installe explicitement.
ARG PRISMA_VERSION=7.10.1

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

COPY dist/apps/api/package.json ./
RUN npm install --omit=dev --ignore-scripts --no-package-lock @prisma/client@${PRISMA_VERSION} \
  && npm cache clean --force

COPY dist/apps/api/main.js ./
# Habillage de Swagger (servi sur /api/docs-assets)
COPY dist/apps/api/assets ./assets

USER node
CMD ["node", "main.js"]

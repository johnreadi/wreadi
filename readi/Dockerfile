# Étape 1 : Dépendances
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./
RUN npm ci

# Étape 2 : Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copier les dépendances
COPY --from=deps /app/node_modules ./node_modules

# Copier tout le code
COPY . .

# Générer Prisma Client
RUN npx prisma generate

# Build l'application
RUN npm run build

# Étape 3 : Production
FROM node:18-alpine AS runner
WORKDIR /app

# Installer OpenSSL pour Prisma
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier les fichiers nécessaires
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env

# Créer le dossier uploads et définir les permissions
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads

# Nous avons besoin de prisma cli pour les migrations, mais standalone ne l'inclut pas forcément.
# On copie node_modules pour s'assurer d'avoir tout ce qu'il faut, même si ça alourdit l'image.
# Une alternative plus légère serait de copier uniquement le nécessaire ou d'utiliser un script dédié.
COPY --from=builder /app/node_modules ./node_modules

# Changer les permissions
RUN chown -R nextjs:nodejs /app

COPY start.sh ./
RUN apk add --no-cache dos2unix && dos2unix start.sh && chmod +x start.sh && chown nextjs:nodejs start.sh

USER nextjs

EXPOSE 3000

CMD ["./start.sh"]

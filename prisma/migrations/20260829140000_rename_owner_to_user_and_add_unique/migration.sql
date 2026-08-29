-- Aligner la colonne "restaurants.ownerId" (nom réel en base, hérité d'un ancien schéma)
-- sur "restaurants.userId" (nom attendu par schema.prisma / le code applicatif).
ALTER TABLE "restaurants" RENAME COLUMN "ownerId" TO "userId";

-- Renommer la contrainte de clé étrangère en conséquence
ALTER TABLE "restaurants" RENAME CONSTRAINT "restaurants_ownerId_fkey" TO "restaurants_userId_fkey";

-- Contrainte @@unique([userId, name]) définie dans schema.prisma, jamais appliquée en base
CREATE UNIQUE INDEX "restaurants_userId_name_key" ON "restaurants"("userId", "name");

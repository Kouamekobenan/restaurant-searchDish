-- Safe creation of DeliveryStatus enum
DO $$ BEGIN
    CREATE TYPE "DeliveryStatus" AS ENUM ('ASSIGNED', 'IN_DELIVERY', 'DELIVERED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterEnum (ajouter les valeurs manquantes à OrderStatus)
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'CONFIRMED';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'IN_DELIVERY';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'DELIVERED';

-- AlterTable: ajouter les colonnes delivery à la table orders
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "deliveryUserId" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "deliveryStatus" "DeliveryStatus";
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "deliveryNote" TEXT;

-- AddForeignKey: lien vers users pour le livreur
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'orders_deliveryUserId_fkey'
    ) THEN
        ALTER TABLE "orders" ADD CONSTRAINT "orders_deliveryUserId_fkey" FOREIGN KEY ("deliveryUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

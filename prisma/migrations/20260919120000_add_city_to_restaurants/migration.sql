-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "city" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "restaurants_city_idx" ON "restaurants"("city");

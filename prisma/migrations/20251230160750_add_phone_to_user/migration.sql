/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `restaurants` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_userId_name_key" ON "restaurants"("userId", "name");

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

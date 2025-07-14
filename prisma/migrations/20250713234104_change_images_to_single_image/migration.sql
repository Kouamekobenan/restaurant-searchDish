/*
  Warnings:

  - You are about to drop the column `images` on the `restaurants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "restaurants" DROP COLUMN "images",
ADD COLUMN     "image" TEXT;

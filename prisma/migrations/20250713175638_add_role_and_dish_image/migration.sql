-- CreateEnum
CREATE TYPE "Role" AS ENUM ('RESTAURATEUR', 'ADMIN', 'DELIVERY');

-- AlterTable
ALTER TABLE "dishes" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'RESTAURATEUR';

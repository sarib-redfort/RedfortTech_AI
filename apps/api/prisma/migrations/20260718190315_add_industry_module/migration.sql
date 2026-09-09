/*
  Warnings:

  - You are about to drop the column `categoryId` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_categoryId_fkey";

-- DropIndex
DROP INDEX "blogs_categoryId_idx";

-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "categoryId",
ADD COLUMN     "authorName" TEXT,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "createdBy" TEXT;

-- DropTable
DROP TABLE "categories";

-- CreateTable
CREATE TABLE "industries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT NOT NULL,
    "segmentBenefits" JSONB NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "industries_slug_key" ON "industries"("slug");

-- CreateIndex
CREATE INDEX "industries_slug_idx" ON "industries"("slug");

-- CreateIndex
CREATE INDEX "industries_status_idx" ON "industries"("status");

-- CreateIndex
CREATE INDEX "blogs_category_idx" ON "blogs"("category");

/*
  Warnings:

  - The `segmentBenefits` column on the `industries` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "industries" ADD COLUMN     "icon" TEXT,
DROP COLUMN "segmentBenefits",
ADD COLUMN     "segmentBenefits" TEXT[];

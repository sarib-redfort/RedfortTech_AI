-- AlterTable
ALTER TABLE "faqs" ADD COLUMN "page" TEXT;

-- Backfill existing rows with a safe default so the new required column can be populated.
UPDATE "faqs" SET "page" = 'HOME' WHERE "page" IS NULL;

-- Make the column required.
ALTER TABLE "faqs" ALTER COLUMN "page" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "faqs" ADD COLUMN "serviceId" TEXT;

ALTER TABLE "faqs"
ADD CONSTRAINT "faqs_serviceId_fkey"
FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "faqs_page_idx" ON "faqs"("page");
CREATE INDEX "faqs_serviceId_idx" ON "faqs"("serviceId");

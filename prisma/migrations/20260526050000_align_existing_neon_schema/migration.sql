ALTER TABLE "Package"
  ADD COLUMN IF NOT EXISTS "duration" TEXT;

ALTER TABLE "Promo"
  ADD COLUMN IF NOT EXISTS "name" TEXT NOT NULL DEFAULT 'Promo',
  ADD COLUMN IF NOT EXISTS "description" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Promo' AND column_name = 'active'
  ) THEN
    EXECUTE 'UPDATE "Promo" SET "isActive" = "active"';
  END IF;
END $$;

DROP INDEX IF EXISTS "Promo_code_active_idx";

ALTER TABLE "Promo"
  ALTER COLUMN "startDate" DROP NOT NULL,
  ALTER COLUMN "endDate" DROP NOT NULL,
  DROP COLUMN IF EXISTS "active";

CREATE INDEX IF NOT EXISTS "Promo_code_isActive_idx" ON "Promo"("code", "isActive");

ALTER TABLE "Testimonial"
  ADD COLUMN IF NOT EXISTS "clientId" INTEGER,
  ALTER COLUMN "name" DROP NOT NULL,
  ALTER COLUMN "role" DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'Testimonial_clientId_fkey'
  ) THEN
    ALTER TABLE "Testimonial"
      ADD CONSTRAINT "Testimonial_clientId_fkey"
      FOREIGN KEY ("clientId") REFERENCES "Client"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

ALTER TABLE "Package"
  ADD COLUMN IF NOT EXISTS "badgeType" TEXT NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS "badgeText" TEXT;

UPDATE "Package"
SET "badgeType" = 'popular'
WHERE "popular" = true AND "badgeType" = 'none';

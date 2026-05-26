ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "brand" TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Testimonial' AND column_name = 'role'
  ) THEN
    EXECUTE 'UPDATE "Testimonial" SET "brand" = COALESCE(NULLIF("brand", ''''), NULLIF("role", ''''), ''Brand'')';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Testimonial' AND column_name = 'clientId'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'Client'
  ) THEN
    EXECUTE 'UPDATE "Testimonial" AS t
      SET
        "name" = COALESCE(NULLIF(t."name", ''''), c."name", ''Client''),
        "brand" = COALESCE(NULLIF(t."brand", ''''), c."industry", ''Brand'')
      FROM "Client" AS c
      WHERE t."clientId" = c."id"';
  END IF;
END $$;

UPDATE "Testimonial"
SET
  "name" = COALESCE(NULLIF("name", ''), 'Client'),
  "brand" = COALESCE(NULLIF("brand", ''), 'Brand');

ALTER TABLE "Testimonial" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "Testimonial" ALTER COLUMN "brand" SET NOT NULL;
ALTER TABLE "Testimonial" ALTER COLUMN "rating" SET DEFAULT 5;

DROP INDEX IF EXISTS "Testimonial_verified_createdAt_idx";

ALTER TABLE "Testimonial" DROP CONSTRAINT IF EXISTS "Testimonial_clientId_fkey";
ALTER TABLE "Testimonial" DROP COLUMN IF EXISTS "clientId";
ALTER TABLE "Testimonial" DROP COLUMN IF EXISTS "role";
ALTER TABLE "Testimonial" DROP COLUMN IF EXISTS "image";
ALTER TABLE "Testimonial" DROP COLUMN IF EXISTS "verified";
ALTER TABLE "Testimonial" DROP COLUMN IF EXISTS "order";

DROP TABLE IF EXISTS "Client";

CREATE INDEX IF NOT EXISTS "Testimonial_createdAt_idx" ON "Testimonial"("createdAt");

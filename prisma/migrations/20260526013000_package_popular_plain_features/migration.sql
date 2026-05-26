ALTER TABLE "Package"
  ADD COLUMN IF NOT EXISTS "popular" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Package"
  ALTER COLUMN "features" SET DEFAULT '';

UPDATE "Package"
SET "features" = (
  SELECT string_agg(feature, E'\n')
  FROM jsonb_array_elements_text("Package"."features"::jsonb) AS feature
)
WHERE trim("features") LIKE '[%';

ALTER TABLE "landing_contents"
  DROP COLUMN IF EXISTS "packageSectionHeading",
  DROP COLUMN IF EXISTS "packageSectionSubheading";

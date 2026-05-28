ALTER TABLE "Package" ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;

WITH ranked_packages AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY "createdAt" ASC, id ASC) AS display_order
  FROM "Package"
)
UPDATE "Package"
SET "order" = ranked_packages.display_order
FROM ranked_packages
WHERE "Package".id = ranked_packages.id
  AND "Package"."order" = 0;

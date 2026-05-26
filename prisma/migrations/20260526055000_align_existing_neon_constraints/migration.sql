ALTER TABLE "Promo"
  ALTER COLUMN "name" DROP DEFAULT,
  ALTER COLUMN "description" DROP DEFAULT;

UPDATE "Testimonial"
SET "clientId" = (
  SELECT "id" FROM "Client" ORDER BY "id" ASC LIMIT 1
)
WHERE "clientId" IS NULL
  AND EXISTS (SELECT 1 FROM "Client");

ALTER TABLE "Testimonial"
  ALTER COLUMN "clientId" SET NOT NULL;

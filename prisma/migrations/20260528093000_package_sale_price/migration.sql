ALTER TABLE "Package" ADD COLUMN IF NOT EXISTS "salePrice" DOUBLE PRECISION;

UPDATE "Package"
SET
  "salePrice" = "price",
  "price" = "strikePrice"
WHERE "strikePrice" IS NOT NULL
  AND "strikePrice" > "price"
  AND "salePrice" IS NULL;

ALTER TABLE "Package" DROP COLUMN IF EXISTS "strikePrice";

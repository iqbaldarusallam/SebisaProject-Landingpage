DROP INDEX IF EXISTS "TrustedBrand_order_idx";

ALTER TABLE "TrustedBrand" DROP COLUMN IF EXISTS "order";

ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "followedUpAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Order_followedUpAt_idx" ON "Order"("followedUpAt");

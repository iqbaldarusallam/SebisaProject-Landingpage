CREATE TABLE "TrustedBrand" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrustedBrand_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TrustedBrand_order_idx" ON "TrustedBrand"("order");
CREATE INDEX "TrustedBrand_createdAt_idx" ON "TrustedBrand"("createdAt");

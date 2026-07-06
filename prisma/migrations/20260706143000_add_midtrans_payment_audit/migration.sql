ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "paymentType" TEXT,
  ADD COLUMN IF NOT EXISTS "midtransTransactionId" TEXT,
  ADD COLUMN IF NOT EXISTS "midtransTransactionStatus" TEXT,
  ADD COLUMN IF NOT EXISTS "midtransFraudStatus" TEXT,
  ADD COLUMN IF NOT EXISTS "midtransGrossAmount" INTEGER,
  ADD COLUMN IF NOT EXISTS "midtransCurrency" TEXT,
  ADD COLUMN IF NOT EXISTS "midtransTransactionTime" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "midtransSettlementTime" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "midtransSignatureVerified" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "midtransLastSyncedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Order_midtransTransactionId_idx" ON "Order"("midtransTransactionId");
CREATE INDEX IF NOT EXISTS "Order_midtransTransactionStatus_idx" ON "Order"("midtransTransactionStatus");

CREATE TABLE IF NOT EXISTS "MidtransPaymentEvent" (
  "id" SERIAL NOT NULL,
  "orderId" INTEGER NOT NULL,
  "midtransOrderId" TEXT NOT NULL,
  "midtransTransactionId" TEXT NOT NULL,
  "paymentType" TEXT NOT NULL DEFAULT 'unknown',
  "transactionStatus" TEXT NOT NULL,
  "fraudStatus" TEXT NOT NULL DEFAULT 'unknown',
  "grossAmount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'IDR',
  "transactionTime" TIMESTAMP(3),
  "settlementTime" TIMESTAMP(3),
  "signatureVerified" BOOLEAN,
  "amountVerified" BOOLEAN,
  "verificationSource" TEXT NOT NULL DEFAULT 'webhook',
  "rawWebhook" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MidtransPaymentEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "MidtransPaymentEvent_unique_event_idx"
  ON "MidtransPaymentEvent"("midtransOrderId", "midtransTransactionId", "transactionStatus", "grossAmount", "fraudStatus");
CREATE INDEX IF NOT EXISTS "MidtransPaymentEvent_orderId_idx" ON "MidtransPaymentEvent"("orderId");
CREATE INDEX IF NOT EXISTS "MidtransPaymentEvent_midtransOrderId_idx" ON "MidtransPaymentEvent"("midtransOrderId");
CREATE INDEX IF NOT EXISTS "MidtransPaymentEvent_midtransTransactionId_idx" ON "MidtransPaymentEvent"("midtransTransactionId");
CREATE INDEX IF NOT EXISTS "MidtransPaymentEvent_transactionStatus_idx" ON "MidtransPaymentEvent"("transactionStatus");
CREATE INDEX IF NOT EXISTS "MidtransPaymentEvent_createdAt_idx" ON "MidtransPaymentEvent"("createdAt");

DO $$
BEGIN
  ALTER TABLE "MidtransPaymentEvent"
    ADD CONSTRAINT "MidtransPaymentEvent_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

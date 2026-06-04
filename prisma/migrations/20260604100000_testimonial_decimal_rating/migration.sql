ALTER TABLE "Testimonial"
  ALTER COLUMN "rating" DROP DEFAULT,
  ALTER COLUMN "rating" TYPE DOUBLE PRECISION USING "rating"::DOUBLE PRECISION,
  ALTER COLUMN "rating" SET DEFAULT 5.0;

UPDATE "Testimonial"
SET "rating" = 4.5
WHERE "name" = 'Pak Saimin'
  AND "brand" = 'Yu! Kebab';

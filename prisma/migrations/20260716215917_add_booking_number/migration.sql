-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "bookingNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingNumber_key" ON "Booking"("bookingNumber");

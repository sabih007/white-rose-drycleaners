-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "confirmationSmsSentAt" TIMESTAMP(3),
ADD COLUMN     "readySmsSentAt" TIMESTAMP(3);

import type { Booking, BookingItem } from "@/generated/prisma/client";
import { formatBookingNumber } from "@/lib/booking-number";

export function serializeBooking(
  booking: Booking & { items: BookingItem[] }
) {
  return {
    ...booking,
    bookingCode: formatBookingNumber(booking.bookingNumber),
    totalAmount: Number(booking.totalAmount),
    items: booking.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.lineTotal),
    })),
  };
}

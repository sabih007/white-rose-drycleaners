export function formatBookingNumber(n: number): string {
  const prefix = process.env.BOOKING_PREFIX || "WRD";
  return `${prefix}-${String(n).padStart(5, "0")}`;
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { serializeBooking } from "@/lib/serialize";
import { formatBookingNumber } from "@/lib/booking-number";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(serializeBooking(booking));
}

const updateSchema = z.object({
  status: z.enum(["RECEIVED", "READY", "DELIVERED"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = new Date();
  const data: {
    status: "RECEIVED" | "READY" | "DELIVERED";
    readyAt?: Date;
    deliveredAt?: Date;
  } = { status: parsed.data.status };
  if (parsed.data.status === "READY" && !existing.readyAt) data.readyAt = now;
  if (parsed.data.status === "DELIVERED" && !existing.deliveredAt)
    data.deliveredAt = now;

  let booking = await prisma.booking.update({
    where: { id },
    data,
    include: { items: true },
  });

  let smsSent: boolean | undefined;
  let smsError: string | undefined;

  if (parsed.data.status === "READY" && !existing.readySmsSentAt) {
    const shopName = process.env.SHOP_NAME || "the dry cleaner";
    const bookingCode = formatBookingNumber(booking.bookingNumber);
    const sms = await sendWhatsAppMessage(
      booking.phone,
      `Hi ${booking.customerName}, your order at ${shopName} (Booking #${bookingCode}) is ready for pickup/delivery. Total due: ${Number(booking.totalAmount).toFixed(2)}.`
    );
    smsSent = sms.sent;
    smsError = sms.error;
    if (sms.sent) {
      booking = await prisma.booking.update({
        where: { id },
        data: { readySmsSentAt: now },
        include: { items: true },
      });
    }
  }

  return NextResponse.json({ ...serializeBooking(booking), smsSent, smsError });
}

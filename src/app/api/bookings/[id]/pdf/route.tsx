import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { serializeBooking } from "@/lib/serialize";
import { ReceiptDocument } from "@/lib/receipt-pdf";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const inline = request.nextUrl.searchParams.get("inline") === "1";
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const b = serializeBooking(booking);
  const shopName = process.env.SHOP_NAME || "Dry Cleaner";
  const buffer = await renderToBuffer(
    <ReceiptDocument booking={b} shopName={shopName} />
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="receipt-${b.id}.pdf"`,
    },
  });
}

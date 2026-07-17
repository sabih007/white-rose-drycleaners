import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBooking } from "@/lib/serialize";
import { buildOrdersWhere } from "@/lib/orders";

const PAGE_SIZE = 25;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const where = buildOrdersWhere(searchParams);

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.booking.count({ where }),
  ]);

  return NextResponse.json({
    bookings: bookings.map(serializeBooking),
    total,
    page,
    pageSize: PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  });
}

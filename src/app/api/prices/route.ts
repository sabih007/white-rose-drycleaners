import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.priceListItem.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(
    items.map((item) => ({ ...item, price: Number(item.price) }))
  );
}

const createSchema = z.object({
  name: z.string().trim().min(1).max(100),
  price: z.number().nonnegative(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid item" }, { status: 400 });
  }

  const count = await prisma.priceListItem.count();
  const item = await prisma.priceListItem.create({
    data: {
      name: parsed.data.name,
      price: parsed.data.price,
      sortOrder: count,
    },
  });
  return NextResponse.json({ ...item, price: Number(item.price) }, { status: 201 });
}

import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PriceListEditor from "./price-list-editor";

export const dynamic = "force-dynamic";

export default async function PricesPage() {
  const items = await prisma.priceListItem.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price List</CardTitle>
        <CardDescription>
          These items and prices appear when creating a new booking.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PriceListEditor
          initialItems={items.map((item) => ({
            ...item,
            price: Number(item.price),
          }))}
        />
      </CardContent>
    </Card>
  );
}

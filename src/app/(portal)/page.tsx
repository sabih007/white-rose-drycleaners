import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serializeBooking } from "@/lib/serialize";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BookingForm from "./booking-form";
import RecentBookings from "./recent-bookings";

export const dynamic = "force-dynamic";

async function getPriceList() {
  const items = await prisma.priceListItem.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return items.map((item) => ({ ...item, price: Number(item.price) }));
}

async function getRecentBookings() {
  const bookings = await prisma.booking.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return bookings.map(serializeBooking);
}

export default async function DashboardPage() {
  const [priceList, recentBookings] = await Promise.all([
    getPriceList(),
    getRecentBookings(),
  ]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>New Booking</CardTitle>
          <CardDescription>
            Enter the customer&apos;s clothes and phone number. The total is
            calculated automatically and a confirmation SMS is sent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {priceList.length === 0 ? (
            <Alert>
              <AlertDescription>
                No price list items yet. Add some in{" "}
                <Link href="/settings/prices" className="underline">
                  Price List
                </Link>{" "}
                first.
              </AlertDescription>
            </Alert>
          ) : (
            <BookingForm priceList={priceList} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentBookings initialBookings={recentBookings} />
        </CardContent>
      </Card>
    </div>
  );
}

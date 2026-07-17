import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serializeBooking } from "@/lib/serialize";
import { buildOrdersWhere } from "@/lib/orders";
import { statusBadgeClass, statusLabel } from "@/lib/status";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrdersFilters from "./orders-filters";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(rawParams)) {
    if (typeof value === "string") params.set(key, value);
  }

  const page = Math.max(1, Number(params.get("page")) || 1);
  const where = buildOrdersWhere(params);

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

  const orders = bookings.map(serializeBooking);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(p: number) {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    return `/orders?${next.toString()}`;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <OrdersFilters />

          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No orders match these filters.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Phone
                      </TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell>
                          <Link
                            href={`/bookings/${b.id}`}
                            className="font-mono text-xs font-medium text-foreground hover:underline"
                          >
                            {b.bookingCode}
                          </Link>
                        </TableCell>
                        <TableCell>{b.customerName}</TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">
                          {b.phone}
                        </TableCell>
                        <TableCell>{b.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={statusBadgeClass[b.status]}>
                            {statusLabel[b.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <p className="text-xs text-muted-foreground">
                  {total.toLocaleString()} order{total === 1 ? "" : "s"} total
                  &middot; page {page} of {pageCount}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    render={page > 1 ? <Link href={pageHref(page - 1)} /> : undefined}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pageCount}
                    render={
                      page < pageCount ? <Link href={pageHref(page + 1)} /> : undefined
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

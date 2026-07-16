import Link from "next/link";
import { Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoutButton from "./logout-button";
import MobileNav from "./mobile-nav";

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shopName = process.env.SHOP_NAME || "Dry Cleaner Portal";

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="border-b bg-card print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shirt className="size-4" />
            </div>
            <span className="truncate text-sm font-semibold text-foreground">
              {shopName}
            </span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <Button variant="ghost" size="sm" render={<Link href="/" />}>
              New Booking
            </Button>
            <Button variant="ghost" size="sm" render={<Link href="/search" />}>
              Find by Phone
            </Button>
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/settings/prices" />}
            >
              Price List
            </Button>
            <LogoutButton />
          </nav>
          <MobileNav />
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}

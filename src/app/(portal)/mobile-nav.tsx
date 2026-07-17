"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export default function MobileNav() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="sm:hidden" />}
      >
        <Menu />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          <SheetClose
            render={<Link href="/" />}
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            New Booking
          </SheetClose>
          <SheetClose
            render={<Link href="/search" />}
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Find by Phone
          </SheetClose>
          <SheetClose
            render={<Link href="/orders" />}
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Orders
          </SheetClose>
          <SheetClose
            render={<Link href="/settings/prices" />}
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Price List
          </SheetClose>
        </nav>
        <Separator />
        <div className="px-4 pb-4">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut />
            Log out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

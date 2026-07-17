"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusLabel } from "@/lib/status";

const STATUSES = ["RECEIVED", "READY", "DELIVERED"] as const;

export default function OrdersFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const status = searchParams.get("status") ?? "ALL";
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`/orders?${params.toString()}`);
  }

  function handleQueryChange(value: string) {
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParams({ q: value }), 300);
  }

  const hasFilters = status !== "ALL" || from || to || q;
  const exportParams = new URLSearchParams(searchParams.toString());
  exportParams.delete("page");

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto_auto] sm:items-end">
      <div className="grid gap-1.5">
        <Label htmlFor="orders-q" className="text-xs text-muted-foreground">
          Search
        </Label>
        <Input
          id="orders-q"
          value={q}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Name, phone, booking #"
        />
      </div>

      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">Status</Label>
        <Select
          value={status}
          onValueChange={(value) =>
            updateParams({ status: !value || value === "ALL" ? "" : value })
          }
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabel[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="orders-from" className="text-xs text-muted-foreground">
          From
        </Label>
        <Input
          id="orders-from"
          type="date"
          value={from}
          onChange={(e) => updateParams({ from: e.target.value })}
          className="w-full sm:w-40"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="orders-to" className="text-xs text-muted-foreground">
          To
        </Label>
        <Input
          id="orders-to"
          type="date"
          value={to}
          onChange={(e) => updateParams({ to: e.target.value })}
          className="w-full sm:w-40"
        />
      </div>

      <div className="flex gap-2">
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQ("");
              router.push("/orders");
            }}
          >
            <X className="size-3.5" />
            Clear
          </Button>
        )}
        <Button
          size="sm"
          className="rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 hover:bg-primary/90 hover:shadow-md"
          render={<a href={`/api/orders/export?${exportParams.toString()}`} />}
        >
          <Download className="size-3.5" />
          Export to Excel
        </Button>
      </div>
    </div>
  );
}

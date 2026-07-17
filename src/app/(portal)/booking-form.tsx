"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, CircleCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type PriceItem = {
  id: string;
  name: string;
  price: number;
};

export default function BookingForm({ priceList }: { priceList: PriceItem[] }) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    id: string;
    totalAmount: number;
    smsSent: boolean;
  } | null>(null);

  const lines = useMemo(
    () =>
      priceList
        .map((item) => ({
          ...item,
          quantity: quantities[item.id] ?? 0,
        }))
        .filter((line) => line.quantity > 0),
    [priceList, quantities]
  );

  const total = useMemo(
    () => lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [lines]
  );

  function setQuantity(id: string, quantity: number) {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, quantity) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (lines.length === 0) {
      setError("Add at least one item.");
      return;
    }
    if (!customerName.trim() || !phone.trim()) {
      setError("Customer name and phone number are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          notes: notes || undefined,
          items: lines.map((line) => ({
            name: line.name,
            unitPrice: line.price,
            quantity: line.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save booking");
        return;
      }
      setResult({
        id: data.id,
        totalAmount: data.totalAmount,
        smsSent: data.smsSent,
      });
      toast.success("Booking saved", {
        description: data.smsSent
          ? "Confirmation WhatsApp message sent to the customer."
          : "WhatsApp message could not be sent — check Twilio settings.",
      });
      setCustomerName("");
      setPhone("");
      setNotes("");
      setQuantities({});
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <Alert>
        <CircleCheck />
        <AlertTitle>
          Booking saved. Total amount: {result.totalAmount.toFixed(2)}
        </AlertTitle>
        <AlertDescription>
          {result.smsSent
            ? "Confirmation WhatsApp message sent to the customer."
            : "Booking saved, but the WhatsApp message could not be sent (check Twilio settings)."}
        </AlertDescription>
        <div className="mt-3 flex gap-2">
          <Button size="sm" render={<a href={`/bookings/${result.id}`} />}>
            View receipt
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setResult(null)}
          >
            New booking
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="customerName">Customer name</Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+92 300 1234567"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Clothes</Label>
        <div className="divide-y rounded-lg border">
          {priceList.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.price.toFixed(2)} each
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() =>
                    setQuantity(item.id, (quantities[item.id] ?? 0) - 1)
                  }
                >
                  <Minus />
                </Button>
                <Input
                  type="number"
                  min={0}
                  value={quantities[item.id] ?? 0}
                  onChange={(e) =>
                    setQuantity(item.id, Number(e.target.value) || 0)
                  }
                  className="w-14 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() =>
                    setQuantity(item.id, (quantities[item.id] ?? 0) + 1)
                  }
                >
                  <Plus />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      <Separator />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-base font-semibold">Total: {total.toFixed(2)}</p>
        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Saving..." : "Save Booking & Notify"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}

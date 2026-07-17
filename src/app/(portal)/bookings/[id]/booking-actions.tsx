"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Printer, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusLabel } from "@/lib/status";

type Status = "RECEIVED" | "READY" | "DELIVERED";

const STATUSES: Status[] = ["RECEIVED", "READY", "DELIVERED"];

export default function BookingActions({
  id,
  status,
}: {
  id: string;
  status: Status;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<Status>(status);
  const [loading, setLoading] = useState(false);

  async function changeStatus(next: Status) {
    if (next === current) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to update status");
        return;
      }
      setCurrent(next);
      if (next === "READY") {
        if (data.smsSent) {
          toast.success("Marked ready and WhatsApp message sent to customer.");
        } else {
          toast.warning("Marked ready, but WhatsApp message could not be sent.");
        }
      } else {
        toast.success(`Status set to ${statusLabel[next]}.`);
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4 print:hidden">
      <div className="flex items-center gap-2">
        <Label className="text-sm text-muted-foreground">Status</Label>
        <Select
          value={current}
          onValueChange={(value) => changeStatus(value as Status)}
          disabled={loading}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabel[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          render={
            <a
              href={`/api/bookings/${id}/pdf?inline=1`}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <Printer />
          Print Receipt
        </Button>
        <Button variant="outline" render={<a href={`/api/bookings/${id}/pdf`} />}>
          <Download />
          Download PDF
        </Button>
      </div>
    </div>
  );
}

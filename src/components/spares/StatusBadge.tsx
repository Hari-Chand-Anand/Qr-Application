import React from "react";
import { Badge } from "@/components/ui";

export function StatusBadge({ status }: { status: string }) {
  const s = (status || "").trim();

  if (s === "Open") {
    return (
      <Badge className="border-green-200 bg-green-50/80 text-green-800">
        Open
      </Badge>
    );
  }

  if (s === "Close") {
    return (
      <Badge className="border-yellow-200 bg-yellow-50/80 text-yellow-900">
        Close
      </Badge>
    );
  }

  return <Badge className="border-black/10 bg-white/60">{s || "Unknown"}</Badge>;
}

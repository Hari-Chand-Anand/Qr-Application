"use client";

import React, { useMemo, useState } from "react";
import type { SpareRow } from "./types";
import { Card } from "@/components/ui";
import { SparesFilters } from "./SparesFilters";
import { SparesAdminTable } from "./SparesAdminTable";

export function SparesAdminClient({ rows }: { rows: SpareRow[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | "Open" | "Close">("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredCount = useMemo(() => {
    // Count is displayed in the table header too; this is optional extra.
    // Keeping as a lightweight signal below.
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const okQ =
        !q ||
        String(r.TicketID || "").toLowerCase().includes(q) ||
        String(r.Category || "").toLowerCase().includes(q) ||
        String(r.Problem || "").toLowerCase().includes(q) ||
        String(r.Technician || "").toLowerCase().includes(q);
      const okStatus = status === "All" ? true : (r.Status || "").trim() === status;
      return okQ && okStatus;
    }).length;
  }, [rows, search, status]);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <SparesFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={(v) => setStatus(v as any)}
          showDateRange
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
        />
      </Card>

      <SparesAdminTable
        rows={rows}
        search={search}
        status={status}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />

      <div className="text-xs text-black/50">Filtered: {filteredCount} entries</div>
    </div>
  );
}

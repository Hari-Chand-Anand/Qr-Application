"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { SpareRow as TicketRow } from "@/components/spares/types";
import { Card } from "@/components/ui";
import { LoadingSpinner } from "@/components/spares/LoadingSpinner";
import { SparesFilters } from "@/components/spares/SparesFilters";
import { SparesMobileList } from "@/components/spares/SparesMobileList";
import { StatCards } from "@/components/spares/StatCards";
import { computeSummary, matchesSearch } from "@/components/spares/utils";

/**
 * Public service dashboard (mobile-friendly).
 * Reuses the ticket-style components from /components/spares since columns are identical.
 */
export function ServicePublicClient({ machineId }: { machineId: string }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<TicketRow[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("All");

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        const r = await fetch(`/api/service-reports/${machineId}`);
        if (!r.ok) throw new Error(`Failed to fetch (${r.status})`);
        const data = (await r.json()) as TicketRow[];
        if (alive) setRows(Array.isArray(data) ? data : []);
      } catch {
        if (alive) setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [machineId]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const okStatus = status === "All" ? true : String(r.Status || "").trim() === status;
      const okSearch = matchesSearch(r, search);
      return okStatus && okSearch;
    });
  }, [rows, search, status]);

  const summary = useMemo(() => computeSummary(filtered), [filtered]);


  if (loading) return <LoadingSpinner />;

  return (
    <>

      <Card className="p-4 mb-4">
        <SparesFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="text-black/80 font-medium">No records found</div>
          <div className="mt-1 text-sm text-black/60">
            No service records found for this machine.
          </div>
        </Card>
      ) : (
        <SparesMobileList rows={filtered} />
      )}
    </>
  );
}

"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { SpareRow } from "./types";
import { computeSummary, matchesSearch } from "./utils";
import { StatCards } from "./StatCards";
import { SparesFilters } from "./SparesFilters";
import { SparesMobileList } from "./SparesMobileList";
import { LoadingSpinner } from "./LoadingSpinner";
import { Card } from "@/components/ui";

export function SparesPublicClient({ machineId }: { machineId: string }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<SpareRow[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | "Open" | "Close">("All");

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        const r = await fetch(`/api/spares/${machineId}`);
        if (!r.ok) throw new Error(`Failed to fetch (${r.status})`);
        const data = (await r.json()) as SpareRow[];
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

  const stats = useMemo(
    () => [
      { label: "Total Parts Installed", value: summary.totalInstalledQty },
      { label: "Last Installation Date", value: summary.lastInstallationDate },
      { label: "Pending Parts", value: summary.pendingQty },
    ],
    [summary]
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="mb-4">
        <StatCards stats={stats} />
      </div>

      <Card className="p-4 mb-4">
        <SparesFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={(v) => setStatus(v as any)}
        />
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="text-black/80 font-medium">No records found</div>
          <div className="mt-1 text-sm text-black/60">
            No spares installation records found for this machine.
          </div>
        </Card>
      ) : (
        <SparesMobileList rows={filtered} />
      )}
    </>
  );
}

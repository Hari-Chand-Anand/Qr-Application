"use client";

import React from "react";
import type { SpareRow as TicketRow } from "@/components/spares/types";
import { Card } from "@/components/ui";
import { StatusBadge } from "@/components/spares/StatusBadge";
import { formatDateDisplay } from "@/components/spares/utils";

export function TicketsPublicTable({ rows }: { rows: TicketRow[] }) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
        <div className="text-sm font-semibold text-[#1d1d1f]">Service Records</div>
        <div className="text-sm text-black/60">{rows.length} entries</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-black/[0.02]">
              {[
                "TicketID",
                "Date",
                "Status",
                "Technician",
                "Type",
                "Category",
                "Problem",
                "Action Taken",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-semibold text-blue-700 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((r, idx) => {
              const actionTaken =
                (r as any)["Action Taken"] ??
                (r as any)["ActionTaken"] ??
                "-";

              return (
                <tr
                  key={`${r.TicketID}-${idx}`}
                  className="border-b border-black/5 hover:bg-white/80"
                >
                  <td className="px-4 py-3 whitespace-nowrap">{r.TicketID || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDateDisplay(r.Date)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={String(r.Status || "")} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.Technician || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.Type || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-[#1d1d1f]">
                    {r.Category || "-"}
                  </td>
                  <td className="px-4 py-3 min-w-[220px]">{r.Problem || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{actionTaken}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
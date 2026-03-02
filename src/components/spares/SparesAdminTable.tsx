"use client";

import React, { useMemo, useState } from "react";
import type { SpareRow } from "./types";
import { StatusBadge } from "./StatusBadge";
import { formatDateDisplay, parseDateSafe } from "./utils";
import { Card } from "@/components/ui";

function getActionTaken(r: SpareRow) {
  // Support both header styles
  return r["Action Taken"] ?? r.ActionTaken ?? "-";
}

export function SparesAdminTable(props: {
  rows: SpareRow[];
  search: string;
  status: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const filtered = useMemo(() => {
    const q = props.search.trim().toLowerCase();
    const from = props.dateFrom ? new Date(props.dateFrom) : null;
    const to = props.dateTo ? new Date(props.dateTo) : null;

    return props.rows.filter((r) => {
      const ticketId = String(r.TicketID || "").toLowerCase();
      const category = String(r.Category || "").toLowerCase();
      const problem = String(r.Problem || "").toLowerCase();
      const technician = String(r.Technician || "").toLowerCase();

      const matchesQ =
        !q ||
        ticketId.includes(q) ||
        category.includes(q) ||
        problem.includes(q) ||
        technician.includes(q);

      const matchesStatus =
        props.status === "All"
          ? true
          : String(r.Status || "").trim() === props.status;

      const d = parseDateSafe(r.Date);
      const matchesDate =
        !from && !to ? true : d ? (!from || d >= from) && (!to || d <= to) : false;

      return matchesQ && matchesStatus && matchesDate;
    });
  }, [props.rows, props.search, props.status, props.dateFrom, props.dateTo]);

  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
        <div className="text-sm font-semibold text-[#1d1d1f]">Spares Records</div>
        <div className="text-sm text-black/60">{filtered.length} entries</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-black/10">
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
                  className="text-left px-5 py-3 font-semibold text-blue-700 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((r, idx) => {
              const key = `${r.TicketID}-${r.Category}-${idx}`;
              const isOpen = expandedKey === key;

              const ticketId = r.TicketID || "-";
              const date = formatDateDisplay(r.Date);
              const status = String(r.Status || "");
              const technician = r.Technician || "-";
              const type = r.Type || "-";
              const category = r.Category || "-";
              const problem = r.Problem || "-";
              const actionTaken = getActionTaken(r);

              return (
                <React.Fragment key={key}>
                  <tr
                    className="border-b border-black/5 hover:bg-white/80 cursor-pointer"
                    onClick={() => setExpandedKey(isOpen ? null : key)}
                  >
                    <td className="px-5 py-3 whitespace-nowrap">{ticketId}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{date}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-5 py-3">{technician}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{type}</td>
                    <td className="px-5 py-3 font-medium text-[#1d1d1f]">{category}</td>
                    <td className="px-5 py-3 max-w-[380px] truncate" title={problem}>
                      {problem}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">{actionTaken || "-"}</td>
                  </tr>

                  {isOpen ? (
                    <tr className="border-b border-black/5 bg-white/60">
                      <td colSpan={8} className="px-5 py-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <div className="text-xs text-black/50">TicketID</div>
                            <div className="font-medium text-black">{ticketId}</div>
                          </div>
                          <div>
                            <div className="text-xs text-black/50">Date</div>
                            <div className="font-medium text-black">{date}</div>
                          </div>
                          <div>
                            <div className="text-xs text-black/50">Technician</div>
                            <div className="font-medium text-black">{technician}</div>
                          </div>
                          <div>
                            <div className="text-xs text-black/50">Action Taken</div>
                            <div className="font-medium text-black">{actionTaken || "-"}</div>
                          </div>

                          <div className="col-span-2">
                            <div className="text-xs text-black/50">Category</div>
                            <div className="text-black/80">{category}</div>
                          </div>

                          <div className="col-span-2">
                            <div className="text-xs text-black/50">Type</div>
                            <div className="text-black/80">{type}</div>
                          </div>

                          <div className="col-span-4">
                            <div className="text-xs text-black/50">Problem</div>
                            <div className="text-black/80">{problem}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              );
            })}

            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-black/60">
                  No spares records found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

"use client";

import React from "react";
import type { SpareRow } from "./types";
import { Card } from "@/components/ui";
import { StatusBadge } from "./StatusBadge";
import { formatDateDisplay } from "./utils";

function getActionTaken(r: SpareRow) {
  return r["Action Taken"] ?? r.ActionTaken ?? "-";
}

export function SparesMobileList({ rows }: { rows: SpareRow[] }) {
  return (
    <div className="space-y-3">
      {rows.map((r, idx) => {
        const ticketId = r.TicketID || "-";
        const date = formatDateDisplay(r.Date);
        const status = String(r.Status || "");
        const technician = r.Technician || "-";
        const type = r.Type || "-";
        const category = r.Category || "-";
        const problem = r.Problem || "-";
        const actionTaken = getActionTaken(r);

        return (
          <Card key={`${ticketId}-${idx}`} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold leading-tight">{category}</div>
                <div className="mt-1 text-sm text-black/60">
                  TicketID: <span className="text-black font-medium">{ticketId}</span>
                </div>
              </div>
              <StatusBadge status={status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-black/50">Date</div>
                <div className="font-medium text-black">{date}</div>
              </div>
              <div>
                <div className="text-xs text-black/50">Action Taken</div>
                <div className="font-medium text-black">{actionTaken || "-"}</div>
              </div>

              <div className="col-span-2">
                <div className="text-xs text-black/50">Technician</div>
                <div className="font-medium text-black">{technician}</div>
              </div>

              <div className="col-span-2">
                <div className="text-xs text-black/50">Type</div>
                <div className="font-medium text-black">{type}</div>
              </div>

              <div className="col-span-2">
                <div className="text-xs text-black/50">Problem</div>
                <div className="text-black/80">{problem}</div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

"use client";

import React from "react";
import { Input } from "@/components/ui";

export function SparesFilters(props: {
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  showDateRange?: boolean;
  dateFrom?: string;
  dateTo?: string;
  onDateFromChange?: (v: string) => void;
  onDateToChange?: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="flex-1">
        <div className="text-sm text-black/60 mb-1">Search</div>
        <Input
          value={props.search}
          onChange={(e) => props.onSearchChange(e.target.value)}
          placeholder="Search by part name or technician..."
        />
      </div>

      <div className="w-full md:w-56">
        <div className="text-sm text-black/60 mb-1">Status</div>
        <select
          value={props.status}
          onChange={(e) => props.onStatusChange(e.target.value)}
          className="w-full rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm text-[#1d1d1f] shadow-sm focus:outline-none focus:ring-4 focus:ring-black/10"
        >
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="Close">Close</option>
        </select>
      </div>

      {props.showDateRange ? (
        <div className="flex gap-3 w-full md:w-auto">
          <div className="flex-1 md:w-44">
            <div className="text-sm text-black/60 mb-1">From</div>
            <input
              type="date"
              value={props.dateFrom || ""}
              onChange={(e) => props.onDateFromChange?.(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm text-[#1d1d1f] shadow-sm focus:outline-none focus:ring-4 focus:ring-black/10"
            />
          </div>
          <div className="flex-1 md:w-44">
            <div className="text-sm text-black/60 mb-1">To</div>
            <input
              type="date"
              value={props.dateTo || ""}
              onChange={(e) => props.onDateToChange?.(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm text-[#1d1d1f] shadow-sm focus:outline-none focus:ring-4 focus:ring-black/10"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

import React from "react";
import { Card } from "@/components/ui";

type Stat = { label: string; value: React.ReactNode };

export function StatCards({
  stats,
}: {
  stats: Stat[];
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <Card key={s.label} className="p-4">
          <div className="text-xs text-black/50">{s.label}</div>
          <div className="mt-1 text-lg font-semibold text-[#1d1d1f]">
            {s.value}
          </div>
        </Card>
      ))}
    </div>
  );
}

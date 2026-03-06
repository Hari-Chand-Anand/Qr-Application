// src/app/admin/[id]/service/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/prisma";
import { envPublic } from "@/lib/env";
import type { SpareRow as TicketRow } from "@/components/spares/types";
import { computeSummary, parseDateSafe } from "@/components/spares/utils";
import { StatCards } from "@/components/spares/StatCards";
import { SparesAdminClient } from "@/components/spares/SparesAdminClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getBaseUrl() {
  const envBase = (envPublic.baseUrl || "").trim().replace(/\/$/, "");
  const h = await headers();

  const host = (h.get("x-forwarded-host") || h.get("host") || "").trim();
  const proto = (h.get("x-forwarded-proto") || "http").trim();
  const inferred = host ? `${proto}://${host}` : "";

  const looksLocal =
    !envBase ||
    envBase.includes("localhost") ||
    envBase.includes("127.0.0.1") ||
    envBase.includes("0.0.0.0");

  return (looksLocal ? inferred || envBase : envBase) || "http://localhost:3000";
}

async function fetchService(baseUrl: string, machineId: string): Promise<TicketRow[]> {
  try {
    const r = await fetch(`${baseUrl.replace(/\/$/, "")}/api/service-reports/${machineId}`, {
      cache: "no-store",
    });
    if (!r.ok) return [];
    const data = (await r.json()) as TicketRow[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default async function AdminMachineServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  noStore();

  const { id: routeId } = await params;
  if (!routeId) return notFound();

  const machine =
    (await prisma.machine.findUnique({ where: { id: routeId } })) ??
    (await prisma.machine.findUnique({ where: { machineId: routeId } }));
  if (!machine) return notFound();

  const baseUrl = await getBaseUrl();
  const rows = await fetchService(baseUrl, machine.machineId);

  const summary = computeSummary(rows);

  const stats = [
    { label: "Open", value: (summary as any).openCount ?? summary.openCount  ?? 0 },
    { label: "Last Date", value: summary.lastInstallationDate ?? "-" },
    { label: "Closed", value: (summary as any).closeCount ?? summary.closeCount ?? 0 },
  ];

  // ✅ Warranty cards (based on earliest Date in sheet)
  const dates = rows
    .map((r) => parseDateSafe((r as any).Date))
    .filter((d): d is Date => !!d)
    .sort((a, b) => a.getTime() - b.getTime());

  const warrantyStart = dates.length ? formatDate(dates[0]) : "-";
  const warrantyEnd = (() => {
    if (!dates.length) return "-";
    const end = new Date(dates[0]);
    end.setFullYear(end.getFullYear() + 1);
    return formatDate(end);
  })();

  const warrantyStats = [
    { label: "Warranty Start", value: warrantyStart },
    { label: "Warranty End", value: warrantyEnd },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="text-sm text-black/50">
          Machine → <span className="text-black/70">{machine.machineId}</span> →{" "}
          <span className="text-black font-medium">Service & Installation Reports</span>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm text-black/60">Machine</div>
            <div className="text-2xl font-semibold">{machine.name}</div>
            <div className="text-sm text-black/60">{machine.machineId}</div>
          </div>

          <Link
            href={`/admin/${machine.id}`}
            className="rounded-2xl border border-black/10 bg-white/60 px-4 py-2 hover:bg-white/80 text-sm"
          >
            ← Back
          </Link>
        </div>
      </div>

      <StatCards stats={stats} />

      {/* ✅ Warranty cards appear above the Search/Filters (inside SparesAdminClient) */}
      <StatCards stats={warrantyStats} />

      <SparesAdminClient rows={rows} />
    </div>
  );
}
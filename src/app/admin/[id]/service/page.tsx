import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/prisma";
import { envPublic } from "@/lib/env";
import type { SpareRow as TicketRow } from "@/components/spares/types";
import { computeSummary } from "@/components/spares/utils";
import { StatCards } from "@/components/spares/StatCards";
import { SparesAdminClient } from "@/components/spares/SparesAdminClient";

export const runtime = "nodejs";
// Avoid DB access during build-time prerender
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
  { label: "Open", value: summary.openCount },
  { label: "Last Date", value: summary.lastInstallationDate },
  { label: "Closed", value: summary.closeCount },
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
      <SparesAdminClient rows={rows} />
    </div>
  );
}

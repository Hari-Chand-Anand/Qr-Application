import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/prisma";
import { envPublic } from "@/lib/env";
import { Card, Button } from "@/components/ui";
import QrDownloader from "@/components/qr-downloader";

import { deleteMachineAction as deleteMachineActionImpl } from "../actions";

export const runtime = "nodejs";
// Avoid DB access during build-time prerender
export const dynamic = "force-dynamic";

async function getBaseUrl() {
  const envBase = (envPublic.baseUrl || "").trim().replace(/\/$/, "");
  // Next.js 15/16: `headers()` is async
  const h = await headers();

  const host = (h.get("x-forwarded-host") || h.get("host") || "").trim();
  const proto = (h.get("x-forwarded-proto") || "http").trim();

  const inferred = host ? `${proto}://${host}` : "";

  // If env points to localhost (common mistake), prefer inferred host in production.
  const looksLocal =
    !envBase ||
    envBase.includes("localhost") ||
    envBase.includes("127.0.0.1") ||
    envBase.includes("0.0.0.0");

  return (looksLocal ? inferred || envBase : envBase) || "http://localhost:3000";
}

// ✅ Wrapper: <form action={...}> expects void | Promise<void>
async function deleteMachineAction(formData: FormData): Promise<void> {
  "use server";
  await deleteMachineActionImpl(formData);
}

export default async function AdminMachineDetailPage({
  params,
}: {
  // Next.js 16 expects `params` to be a Promise.
  params: Promise<{ id: string }>;
}) {
  noStore();

  const { id: routeId } = await params;
  if (!routeId) return notFound();

  // Try DB primary id first, fallback to machineId
  const machine =
    (await prisma.machine.findUnique({ where: { id: routeId }, include: { company: true } })) ??
    (await prisma.machine.findUnique({ where: { machineId: routeId }, include: { company: true } }));

  if (!machine) return notFound();

  const baseUrl = (await getBaseUrl()).replace(/\/$/, "");
  const landingUrl = `${baseUrl}/m/${machine.machineId}`;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm text-neutral-400">Machine</div>
          <div className="text-2xl font-semibold">{machine.name}</div>
          <div className="text-sm text-neutral-400">{machine.machineId}</div>
          <div className="mt-1 text-xs text-neutral-400">
            Company: {machine.company ? `${machine.company.name} (${machine.company.code})` : "—"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="rounded-xl border border-white/10 px-4 py-2 hover:bg-white/5 text-sm"
          >
            ← Back
          </Link>

          <Link
            href={`/admin/${machine.id}/service`}
            className="rounded-xl border border-white/10 px-4 py-2 hover:bg-white/5 text-sm"
          >
            Service Reports
          </Link>

          <a
            href={landingUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/10 px-4 py-2 hover:bg-white/5 text-sm"
          >
            Open Landing →
          </a>

          <form action={deleteMachineAction}>
            <input type="hidden" name="id" value={machine.id} />
            <Button type="submit" variant="danger">
              Delete
            </Button>
          </form>
        </div>
      </div>

      <QrDownloader url={landingUrl} label={`QR • ${machine.machineId}`} />

      <Card className="p-4">
        <div className="text-sm text-neutral-400 mb-1">Drive link</div>
        <div className="break-all">{machine.driveLink || "-"}</div>

        <div className="text-sm text-neutral-400 mt-4 mb-1">Service reports source</div>
        <div className="break-all">{machine.sheetsLink || "-"}</div>

        <div className="text-sm text-neutral-400 mt-4 mb-1">WhatsApp</div>
        <div className="break-all">{machine.whatsappNumber || "-"}</div>
      </Card>
    </div>
  );
}

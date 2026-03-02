import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui";
import { Sheet } from "lucide-react";
import { ServicePublicClient } from "@/components/service/ServicePublicClient";
import { unstable_noStore as noStore } from "next/cache";

export const runtime = "nodejs";

export default async function ServiceReportsPage({
  params,
}: {
  params: Promise<{ machineId: string }>;
}) {
  noStore();

  const { machineId: raw } = await params;
  const machineId = (raw || "").trim();
  if (!machineId) return notFound();

  const machine = await prisma.machine.findUnique({ where: { machineId } });
  if (!machine) return notFound();

  return (
    <main className="min-h-dvh p-4 md:p-8">
      <div className="mx-auto max-w-lg space-y-4">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-black/5 grid place-items-center">
              <Sheet className="h-6 w-6 text-black/70" />
            </div>
            <div>
              <div className="text-sm text-black/60">Service & Installation Reports</div>
              <div className="text-lg font-semibold leading-tight">{machine.name}</div>
              <div className="text-sm text-black/60">
                Machine ID: <span className="text-black font-medium">{machine.machineId}</span>
              </div>
            </div>
          </div>
        </Card>

        <ServicePublicClient machineId={machine.machineId} />
      </div>
    </main>
  );
}

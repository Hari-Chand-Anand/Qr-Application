import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, Badge, Button } from "@/components/ui";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminListPage() {
  const machines = await prisma.machine.findMany({
    orderBy: { updatedAt: "desc" },
    include: { company: true },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Machines</h1>
          <p className="text-sm text-black/60">
            Create machine entries, then download printable QR codes.
          </p>
        </div>

        <Link href="/admin/new">
          <Button>+ Add Machine</Button>
        </Link>
      </div>

      {machines.length === 0 ? (
        <Card className="p-6">
          <p className="text-black/80">No machines yet.</p>
          <p className="mt-1 text-sm text-black/60">
            Click <span className="text-black font-medium">Add Machine</span> to create your first one.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {machines.map((m) => (
            <Link
              key={m.id}
              href={`/admin/${m.id}`}
              className="block rounded-3xl border border-black/10 bg-white/60 p-4 shadow-sm hover:bg-white/80 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{m.name}</div>
                  <div className="mt-1 text-sm text-black/60">
                    Machine ID: <span className="text-black font-medium">{m.machineId}</span>
                  </div>
                  {m.company ? (
                    <div className="mt-1 text-xs text-black/40">
                      Company: {m.company.name} ({m.company.code})
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-black/40">Company: —</div>
                  )}
                </div>
                <Badge>Open</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

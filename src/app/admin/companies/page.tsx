import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, Badge, Button } from "@/components/ui";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminCompaniesPage() {
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { machines: true } },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Companies</h1>
          <p className="text-sm text-black/60">
            Add one Google Sheet per company. Machines linked to that company will read data from its sheet.
          </p>
        </div>

        <Link href="/admin/companies/new">
          <Button>+ Add Company</Button>
        </Link>
      </div>

      {companies.length === 0 ? (
        <Card className="p-6">
          <p className="text-black/80">No companies yet.</p>
          <p className="mt-1 text-sm text-black/60">
            Click <span className="text-black font-medium">Add Company</span> to create your first company.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {companies.map((c) => (
            <Link
              key={c.id}
              href={`/admin/companies/${c.id}`}
              className="block rounded-3xl border border-black/10 bg-white/60 p-4 shadow-sm hover:bg-white/80 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{c.name}</div>
                  <div className="mt-1 text-sm text-black/60">
                    Code: <span className="text-black font-medium">{c.code}</span>
                  </div>
                  <div className="mt-1 text-xs text-black/40 break-all">Sheet ID: {c.sheetId}</div>
                </div>

                <Badge>{c._count.machines} machines</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

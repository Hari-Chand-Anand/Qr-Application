import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/prisma";
import { Card, Input, Button, Badge } from "@/components/ui";
import { updateCompanyAction as updateCompanyActionImpl, deleteCompanyAction as deleteCompanyActionImpl } from "../actions";

export const runtime = "nodejs";
// Avoid DB access during build-time prerender
export const dynamic = "force-dynamic";

async function updateCompanyAction(formData: FormData): Promise<void> {
  "use server";
  await updateCompanyActionImpl(formData);
}

async function deleteCompanyAction(formData: FormData): Promise<void> {
  "use server";
  const res = await deleteCompanyActionImpl(formData);
  // If delete failed, we simply stay on page; user will see nothing though.
  // In a later iteration, we can surface errors with client-side toast.
  if (res?.ok === false) {
    // noop
  }
}

export default async function AdminCompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  noStore();

  const { id } = await params;
  if (!id) return notFound();

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      machines: { orderBy: { updatedAt: "desc" } },
    },
  });

  if (!company) return notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm text-neutral-400">Company</div>
          <div className="text-2xl font-semibold">{company.name}</div>
          <div className="text-sm text-neutral-400">{company.code}</div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/companies"
            className="rounded-xl border border-white/10 px-4 py-2 hover:bg-white/5 text-sm"
          >
            ← Back
          </Link>

          <form action={deleteCompanyAction}>
            <input type="hidden" name="id" value={company.id} />
            <Button type="submit" variant="danger">
              Delete
            </Button>
          </form>
        </div>
      </div>

      <Card className="p-6">
        <div className="text-lg font-semibold mb-3">Edit Company</div>

        <form action={updateCompanyAction} className="space-y-4">
          <input type="hidden" name="id" value={company.id} />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-black/60">Company Code</label>
              <Input name="code" defaultValue={company.code} required />
            </div>
            <div>
              <label className="text-sm text-black/60">Company Name</label>
              <Input name="name" defaultValue={company.name} required />
            </div>
          </div>

          <div>
            <label className="text-sm text-black/60">Google Sheet ID (or URL)</label>
            <Input name="sheet" defaultValue={company.sheetId} required />
            <p className="mt-1 text-xs text-black/40">
              Paste Sheet ID or full URL. We store only the Sheet ID.
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold">Machines in this company</div>
          <Badge>{company.machines.length} machines</Badge>
        </div>

        {company.machines.length === 0 ? (
          <div className="mt-3 text-sm text-black/60">
            No machines linked yet. Create a machine and select this company.
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {company.machines.map((m) => (
              <Link
                key={m.id}
                href={`/admin/${m.id}`}
                className="block rounded-3xl border border-black/10 bg-white/60 p-4 shadow-sm hover:bg-white/80 hover:shadow-md transition"
              >
                <div className="text-base font-semibold">{m.name}</div>
                <div className="mt-1 text-sm text-black/60">
                  Machine ID: <span className="text-black font-medium">{m.machineId}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

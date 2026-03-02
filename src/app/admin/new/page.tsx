import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createMachineAction as createMachineActionImpl } from "../actions";
import { Card, Input, Textarea, Button } from "@/components/ui";

export const runtime = "nodejs";
// Avoid DB access during build-time prerender
export const dynamic = "force-dynamic";

// ✅ Wrapper: <form action> expects void | Promise<void>
async function createMachineAction(formData: FormData): Promise<void> {
  "use server";
  await createMachineActionImpl(formData);
}

export default async function AdminNewMachinePage() {
  const companies = await prisma.company.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Add Machine</h1>
          <p className="text-sm text-black/60">
            Leave Machine ID blank to auto-generate one.
          </p>
        </div>
        <Link href="/admin" className="text-sm text-black/60 hover:text-black">
          ← Back
        </Link>
      </div>

      <Card className="p-6">
        <form action={createMachineAction} className="space-y-4">
          <div>
            <label className="text-sm text-black/60">Company (optional)</label>
            <select
              name="companyId"
              className="w-full rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm text-[#1d1d1f] shadow-sm focus:outline-none focus:ring-4 focus:ring-black/10"
              defaultValue=""
            >
              <option value="">— Not set (uses global sheet) —</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-black/40">
              If set, service report data will be read from the company&apos;s Google Sheet.
            </p>
            {companies.length === 0 ? (
              <p className="mt-1 text-xs text-black/40">
                No companies found. Add companies from <Link className="underline" href="/admin/companies">Companies</Link>.
              </p>
            ) : null}
          </div>

          <div>
            <label className="text-sm text-black/60">Machine ID (optional)</label>
            <Input name="machineId" placeholder="e.g., DY-4412P-001" />
          </div>

          <div>
            <label className="text-sm text-black/60">Machine Name</label>
            <Input name="name" placeholder="e.g., DUKE DY-4412P Pattern Sewer" required />
          </div>

          <div>
            <label className="text-sm text-black/60">Machine Specs / Catalog (Google Drive link)</label>
            <Input name="driveLink" placeholder="https://drive.google.com/..." required />
          </div>

          <div>
            <label className="text-sm text-black/60">Service Reports Source</label>
            <Input
              name="sheetsLink"
              placeholder="Tab name (recommended) OR CSV URL OR Google Sheets tab link (gid=...)"
              required
            />
            <p className="mt-1 text-xs text-black/40">
              Recommended: enter the <b>tab name</b> inside the company&apos;s sheet (e.g., <code>DY-4411PSF__SERVICE</code>).<br />
              Also supported: a published CSV link (gviz/export) or a Google Sheets tab URL.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-black/60">WhatsApp Number (optional)</label>
              <Input name="whatsappNumber" placeholder="919999999999" />
              <p className="mt-1 text-xs text-black/40">
                Use digits only, include country code (India: 91...).
              </p>
            </div>
            <div>
              <label className="text-sm text-black/60">WhatsApp Message Template (optional)</label>
              <Textarea
                name="whatsappTemplate"
                rows={3}
                placeholder="Hi, I'd like to request a quote for [Machine Name] ([Machine ID])."
              />
              <p className="mt-1 text-xs text-black/40">
                Supports placeholders: [Machine Name], [Machine ID]
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">Save & Generate QR</Button>
            <Button type="reset" variant="ghost">
              Clear
            </Button>
          </div>

          <p className="text-xs text-black/40">
            After saving, open the machine entry to download the QR code.
          </p>
        </form>
      </Card>
    </div>
  );
}

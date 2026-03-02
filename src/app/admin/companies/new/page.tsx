import Link from "next/link";
import { Card, Input, Button } from "@/components/ui";
import { createCompanyAction as createCompanyActionImpl } from "../actions";

export const runtime = "nodejs";

// ✅ Wrapper: <form action> expects void | Promise<void>
async function createCompanyAction(formData: FormData): Promise<void> {
  "use server";
  await createCompanyActionImpl(formData);
}

export default function AdminNewCompanyPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Add Company</h1>
          <p className="text-sm text-black/60">
            Create one record per customer company, and paste its Google Sheet ID (or full sheet URL).
          </p>
        </div>
        <Link href="/admin/companies" className="text-sm text-black/60 hover:text-black">
          ← Back
        </Link>
      </div>

      <Card className="p-6">
        <form action={createCompanyAction} className="space-y-4">
          <div>
            <label className="text-sm text-black/60">Company Code</label>
            <Input name="code" placeholder="e.g., GOKALDAS" required />
            <p className="mt-1 text-xs text-black/40">
              Short unique code (letters/numbers/-/_). Used for internal identification.
            </p>
          </div>

          <div>
            <label className="text-sm text-black/60">Company Name</label>
            <Input name="name" placeholder="e.g., Gokaldas Exports Ltd" required />
          </div>

          <div>
            <label className="text-sm text-black/60">Google Sheet ID (or URL)</label>
            <Input
              name="sheet"
              placeholder="Paste Sheet ID or full https://docs.google.com/spreadsheets/d/... link"
              required
            />
            <p className="mt-1 text-xs text-black/40">
              Tip: open your sheet → copy the URL → paste it here. We automatically extract the Sheet ID.
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="reset" variant="ghost">
              Clear
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

"use server";

import { prisma } from "@/lib/prisma";
import { CompanySchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function normalizeSheetId(input: string): string {
  const v = (input || "").trim();
  if (!v) return "";

  // If user pasted a full URL, extract the /d/{ID}/ part.
  const m = v.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (m?.[1]) return m[1];

  // Otherwise assume it's already a Sheet ID.
  return v;
}

export async function createCompanyAction(formData: FormData) {
  const raw = {
    code: String(formData.get("code") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    sheet: String(formData.get("sheet") ?? "").trim(),
  };

  const parsed = CompanySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const sheetId = normalizeSheetId(parsed.data.sheet);
  if (!sheetId) {
    return { ok: false, message: "Invalid Google Sheet ID / URL" };
  }

  const created = await prisma.company.create({
    data: {
      code: parsed.data.code,
      name: parsed.data.name,
      sheetId,
    },
  });

  revalidatePath("/admin/companies");
  redirect(`/admin/companies/${created.id}`);
}

export async function updateCompanyAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Missing company id" };

  const raw = {
    id,
    code: String(formData.get("code") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    sheet: String(formData.get("sheet") ?? "").trim(),
  };

  const parsed = CompanySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const sheetId = normalizeSheetId(parsed.data.sheet);
  if (!sheetId) {
    return { ok: false, message: "Invalid Google Sheet ID / URL" };
  }

  await prisma.company.update({
    where: { id },
    data: {
      code: parsed.data.code,
      name: parsed.data.name,
      sheetId,
    },
  });

  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
  return { ok: true };
}

export async function deleteCompanyAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Missing company id" };

  // Optional safety: prevent delete if machines exist.
  const count = await prisma.machine.count({ where: { companyId: id } });
  if (count > 0) {
    return {
      ok: false,
      message: `Cannot delete: ${count} machine(s) are linked to this company. Remove the link first.`,
    };
  }

  await prisma.company.delete({ where: { id } });

  revalidatePath("/admin/companies");
  redirect("/admin/companies");
}

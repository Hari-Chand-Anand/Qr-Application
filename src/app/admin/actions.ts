"use server";

import { prisma } from "@/lib/prisma";
import { MachineSchema } from "@/lib/validators";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * NOTE:
 * In a "use server" file, you must export ONLY async functions.
 * Do NOT export consts like runtime/dynamic/revalidate here.
 */

function normalizeWhatsAppNumber(num?: string | null) {
  if (!num) return null;
  // keep digits only (WhatsApp wants countrycode+number, no '+' or spaces)
  const digits = String(num).replace(/\D/g, "");
  return digits.length ? digits : null;
}

export async function createMachineAction(formData: FormData) {
  const raw = {
    machineId: String(formData.get("machineId") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    driveLink: String(formData.get("driveLink") ?? "").trim(),

    // ✅ now can be: tab name OR CSV URL OR sheets tab URL
    sheetsLink: String(formData.get("sheetsLink") ?? "").trim(),

    // ✅ optional company assignment (so API knows which sheet ID to use)
    companyId: String(formData.get("companyId") ?? "").trim(),

    whatsappNumber: String(formData.get("whatsappNumber") ?? "").trim(),
    whatsappTemplate: String(formData.get("whatsappTemplate") ?? "").trim(),
  };

  const parsed = MachineSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const machineId =
    parsed.data.machineId && parsed.data.machineId.trim()
      ? parsed.data.machineId.trim()
      : `m-${nanoid(8)}`;

  const created = await prisma.machine.create({
    data: {
      machineId,
      name: parsed.data.name,
      driveLink: parsed.data.driveLink,
      sheetsLink: parsed.data.sheetsLink,
      companyId: parsed.data.companyId?.trim() ? parsed.data.companyId.trim() : null,
      whatsappNumber: normalizeWhatsAppNumber(parsed.data.whatsappNumber),
      whatsappTemplate: parsed.data.whatsappTemplate?.trim() || null,
    },
  });

  revalidatePath("/admin");
  redirect(`/admin/${created.id}`);
}

export async function updateMachineAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Missing machine id" };

  const raw = {
    id,
    machineId: String(formData.get("machineId") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    driveLink: String(formData.get("driveLink") ?? "").trim(),
    sheetsLink: String(formData.get("sheetsLink") ?? "").trim(),
    companyId: String(formData.get("companyId") ?? "").trim(),
    whatsappNumber: String(formData.get("whatsappNumber") ?? "").trim(),
    whatsappTemplate: String(formData.get("whatsappTemplate") ?? "").trim(),
  };

  const parsed = MachineSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  await prisma.machine.update({
    where: { id },
    data: {
      machineId: parsed.data.machineId?.trim() || undefined,
      name: parsed.data.name,
      driveLink: parsed.data.driveLink,
      sheetsLink: parsed.data.sheetsLink,
      companyId: parsed.data.companyId?.trim() ? parsed.data.companyId.trim() : null,
      whatsappNumber: normalizeWhatsAppNumber(parsed.data.whatsappNumber),
      whatsappTemplate: parsed.data.whatsappTemplate?.trim() || null,
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/${id}`);
  return { ok: true };
}

export async function deleteMachineAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Missing machine id" };

  await prisma.machine.delete({ where: { id } });

  revalidatePath("/admin");
  redirect("/admin");
}

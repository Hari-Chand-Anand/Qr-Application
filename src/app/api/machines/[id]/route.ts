import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Next.js 16 route handlers pass `params` as a Promise.
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const machine = await prisma.machine.findUnique({ where: { id } });
  if (!machine) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(machine);
}

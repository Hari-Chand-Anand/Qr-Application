import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const machines = await prisma.machine.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(machines);
}

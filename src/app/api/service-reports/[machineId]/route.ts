import { NextResponse } from "next/server";
import Papa from "papaparse";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 60;

function isHttpUrl(v: string) {
  return /^https?:\/\//i.test(v);
}

function extractSheetIdFromUrl(url: string): string | null {
  const m = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return m?.[1] || null;
}

function extractGidFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const gid = u.searchParams.get("gid");
    return gid ? String(gid) : null;
  } catch {
    return null;
  }
}

function looksLikeCsvUrl(url: string) {
  return (
    url.includes("tqx=out:csv") ||
    url.includes("format=csv") ||
    /\.csv($|\?)/i.test(url)
  );
}

function buildCsvUrl(opts: { sheetId?: string; source: string }) {
  const source = (opts.source || "").trim();
  const fallbackSheetId = (opts.sheetId || "").trim();

  // If user pasted a URL
  if (isHttpUrl(source)) {
    if (looksLikeCsvUrl(source)) return source;

    // Support: Google Sheets tab URL (contains gid=...)
    const sid = extractSheetIdFromUrl(source);
    const gid = extractGidFromUrl(source);
    if (sid && gid) {
      return `https://docs.google.com/spreadsheets/d/${sid}/export?format=csv&gid=${encodeURIComponent(
        gid
      )}`;
    }

    // Unknown URL format
    return null;
  }

  // Otherwise treat as tab name
  if (!fallbackSheetId) return null;
  const tabName = source;
  return `https://docs.google.com/spreadsheets/d/${fallbackSheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    tabName
  )}`;
}

function getMachineIdFromRow(row: any): string {
  if (!row || typeof row !== "object") return "";
  const candidates = ["MachineID", "Machine Id", "Machine ID", "machineId", "machine_id"];
  for (const k of candidates) {
    const v = row[k];
    if (v) return String(v).trim();
  }
  return "";
}

/**
 * Service & Installation Reports API
 *
 * Sheet selection priority:
 *  1) If machine is linked to a company -> use Company.sheetId
 *  2) Else fallback to NEXT_PUBLIC_GLOBAL_SHEET_ID
 *
 * Service source priority (Machine.sheetsLink):
 *  - If it's a direct CSV URL (gviz/export) -> use it
 *  - If it's a Google Sheets tab URL containing gid=... -> convert to export CSV
 *  - Else treat it as a TAB NAME inside the selected sheet
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ machineId: string }> }
) {
  try {
    const { machineId: raw } = await ctx.params;
    const machineId = (raw || "").trim();

    const machine = await prisma.machine.findUnique({
      where: { machineId },
      include: { company: true },
    });

    if (!machine) {
      return NextResponse.json({ message: "Machine not found" }, { status: 404 });
    }

    const sheetId = (machine.company?.sheetId || process.env.NEXT_PUBLIC_GLOBAL_SHEET_ID || "").trim();

    const rawSource = (machine.sheetsLink || "").trim();
    if (!rawSource) {
      return NextResponse.json(
        { message: "Service reports source not set for this machine" },
        { status: 400 }
      );
    }

    const csvUrl = buildCsvUrl({ sheetId, source: rawSource });

    if (!csvUrl) {
      return NextResponse.json(
        {
          message:
            "Unable to build CSV URL. Set a company sheet (or NEXT_PUBLIC_GLOBAL_SHEET_ID) and use a tab name, or paste a CSV link / tab URL (with gid).",
        },
        { status: 400 }
      );
    }

    const res = await fetch(csvUrl, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { message: `Failed to fetch CSV (${res.status})` },
        { status: 500 }
      );
    }

    const csvText = await res.text();
    if (!csvText || csvText.trim().length === 0) {
      return NextResponse.json({ message: "CSV is empty" }, { status: 500 });
    }

    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    if (parsed.errors?.length) {
      return NextResponse.json(
        { message: "CSV parse error", errors: parsed.errors },
        { status: 500 }
      );
    }

    let rows = Array.isArray(parsed.data) ? parsed.data : [];

    // Optional future-proofing:
    // If the tab is shared across multiple machines and contains a MachineID column,
    // filter rows to only this machine.
    if (rows.length > 0) {
      const firstMachineId = getMachineIdFromRow(rows[0]);
      if (firstMachineId) {
        rows = rows.filter((r: any) => getMachineIdFromRow(r) === machineId);
      }
    }

    const out = NextResponse.json(rows, { status: 200 });
    out.headers.set("Cache-Control", "s-maxage=60, stale-while-revalidate=60");
    return out;
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

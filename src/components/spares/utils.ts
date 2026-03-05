import type { SpareRow } from "./types";

export function parseDateSafe(value?: string): Date | null {
  if (!value) return null;
  // best-effort parse (supports ISO and many human formats)
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateDisplay(value?: string) {
  const d = parseDateSafe(value);
  if (!d) return value || "-";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function matchesSearch(row: SpareRow, q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return true;

  // Ticket-style search fields
  const ticketId = String(row.TicketID || "").toLowerCase();
  const technician = String(row.Technician || "").toLowerCase();
  const category = String(row.Category || "").toLowerCase();
  const problem = String(row.Problem || "").toLowerCase();

  return (
    ticketId.includes(query) ||
    technician.includes(query) ||
    category.includes(query) ||
    problem.includes(query)
  );
}

export function computeSummary(rows: SpareRow[]) {
  const norm = (v: any) => String(v ?? "").trim().toLowerCase();

  const openCount = rows.filter((r) => norm(r.Status) === "open").length;

  // support both "close" and "closed"
  const closeCount = rows.filter((r) => {
    const s = norm(r.Status);
    return s === "close" || s === "closed";
  }).length;

  const lastDate = rows
    .map((r) => parseDateSafe(r.Date))
    .filter((d): d is Date => !!d)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return {
    openCount,
    closeCount,
    lastInstallationDate: lastDate
      ? lastDate.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
      : "-",
  };
}
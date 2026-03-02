import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { envPublic } from "@/lib/env";
import Link from "next/link";
import { Card } from "@/components/ui";
import { FileText, Sheet, MessageCircle } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";

export const runtime = "nodejs";

function buildWhatsAppLink(opts: {
  number: string;
  template: string;
  machineName: string;
  machineId: string;
}) {
  const msg = (opts.template || "")
    .replaceAll("[Machine Name]", opts.machineName)
    .replaceAll("[Machine ID]", opts.machineId);

  const numberDigits = (opts.number || "").replace(/\D/g, "");
  const encoded = encodeURIComponent(msg);
  return `https://wa.me/${numberDigits}?text=${encoded}`;
}

export default async function MachineLandingPage({
  params,
}: {
  params: Promise<{ machineId: string }>;
}) {
  noStore();

  const { machineId: rawMachineId } = await params;
  const machineId = (rawMachineId || "").trim();

  if (!machineId || machineId === "undefined" || machineId === "null") {
    return notFound();
  }

  const machine = await prisma.machine.findUnique({ where: { machineId } });
  if (!machine) return notFound();

  const waNumber = machine.whatsappNumber || envPublic.defaultWaNumber || "91";
  const waTemplate =
    machine.whatsappTemplate ||
    envPublic.defaultWaTemplate ||
    "Hi, I'd like to request a quote for [Machine Name] ([Machine ID]).";

  const waLink = buildWhatsAppLink({
    number: waNumber,
    template: waTemplate,
    machineName: machine.name,
    machineId: machine.machineId,
  });

  const driveLink = machine.driveLink?.trim() || "";
  const sheetsLink = machine.sheetsLink?.trim() || "";

  return (
    <main
      className="
        min-h-[100dvh]
        flex flex-col
        px-4 md:px-8
        pt-4 md:pt-8
        pb-[calc(env(safe-area-inset-bottom,0px)+16px)]
      "
    >
      {/* ✅ This wrapper grows to fill the screen so footer sits at bottom */}
      <div className="mx-auto w-full max-w-lg flex-1 flex flex-col">
        <div className="space-y-4">
          <header className="rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3">
              {envPublic.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={envPublic.logoUrl}
                  alt={`${envPublic.companyName} logo`}
                  className="h-10 w-10 rounded-2xl object-contain bg-white p-1 shadow-sm"
                />
              ) : (
                <div className="h-10 w-10 rounded-2xl bg-white text-[#1d1d1f] grid place-items-center font-bold shadow-sm">
                  {envPublic.companyName.slice(0, 1).toUpperCase()}
                </div>
              )}

              <div>
                <div className="text-sm text-black/60">{envPublic.companyName}</div>
                <h1 className="text-xl font-semibold leading-tight">{machine.name}</h1>
                <div className="text-sm text-black/60">
                  Machine ID:{" "}
                  <span className="text-black font-medium">{machine.machineId}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="grid gap-3">
            {driveLink ? (
              <a href={driveLink} target="_blank" rel="noreferrer" className="block">
                <Card className="p-5 hover:bg-white/90 hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-black/5 grid place-items-center">
                      <FileText className="h-6 w-6 text-black/70" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">Machine Specs & Catalog</div>
                      <div className="text-sm text-black/60">
                        Manuals, brochures, drawings, PDFs
                      </div>
                    </div>
                  </div>
                </Card>
              </a>
            ) : (
              <Card className="p-5">
                <div className="text-lg font-semibold">Machine Specs & Catalog</div>
                <div className="text-sm text-black/60">No drive link added yet.</div>
              </Card>
            )}

            {sheetsLink ? (
              <Link href={`/m/${machine.machineId}/service`} className="block">
                <Card className="p-5 hover:bg-white/90 hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-black/5 grid place-items-center">
                      <Sheet className="h-6 w-6 text-black/70" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">
                        Service & Installation Reports
                      </div>
                      <div className="text-sm text-black/60">
                        Installation date, tickets, work done
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ) : (
              <Card className="p-5">
                <div className="text-lg font-semibold">Service & Installation Reports</div>
                <div className="text-sm text-black/60">No sheets link added yet.</div>
              </Card>
            )}

            <a href={waLink} target="_blank" rel="noreferrer" className="block">
              <Card className="p-5 hover:bg-white/90 hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-black/5 grid place-items-center">
                    <MessageCircle className="h-6 w-6 text-black/70" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Request Quote</div>
                    <div className="text-sm text-black/60">
                      Opens WhatsApp with a pre-filled message
                    </div>
                  </div>
                </div>
              </Card>
            </a>
          </div>
        </div>

        {/* ✅ Footer pushed to bottom */}
        <footer className="mt-auto text-center text-xs text-black/50 pt-4">
          For best results, keep QR stickers clean and place them on a flat surface.
        </footer>
      </div>
    </main>
  );
}
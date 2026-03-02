"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Button, Card, Input } from "@/components/ui";

type Props = {
  url: string;
  label?: string;
};

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function QrDownloader({ url, label = "QR Code" }: Props) {
  const [dataUrl1024, setDataUrl1024] = useState<string>("");
  const [dataUrl2048, setDataUrl2048] = useState<string>("");
  const safeFileBase = useMemo(() => label.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40), [label]);

  useEffect(() => {
    let cancelled = false;

    async function gen() {
      const opts = { margin: 2, errorCorrectionLevel: "H" as const };

      const d1 = await QRCode.toDataURL(url, { ...opts, width: 1024 });
      const d2 = await QRCode.toDataURL(url, { ...opts, width: 2048 });

      if (!cancelled) {
        setDataUrl1024(d1);
        setDataUrl2048(d2);
      }
    }

    gen().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-lg font-semibold">{label}</div>
          <p className="mt-1 text-sm text-black/60">
            Printable high-resolution PNG (error correction: High).
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => dataUrl1024 && downloadDataUrl(dataUrl1024, `${safeFileBase}-1024.png`)}
            disabled={!dataUrl1024}
          >
            Download 1024px
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => dataUrl2048 && downloadDataUrl(dataUrl2048, `${safeFileBase}-2048.png`)}
            disabled={!dataUrl2048}
          >
            Download 2048px
          </Button>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-[220px_1fr] gap-4 items-start">
        <div className="rounded-2xl bg-white p-3 w-fit">
          {dataUrl1024 ? (
            // preview only (smaller)
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl1024} alt="QR preview" className="w-[180px] h-[180px]" />
          ) : (
            <div className="w-[180px] h-[180px] grid place-items-center text-black/50">
              Generating…
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div>
            <div className="text-sm text-black/60">QR destination URL</div>
            <Input value={url} readOnly onFocus={(e) => e.currentTarget.select()} />
          </div>
          <p className="text-xs text-black/40">
            Tip: use a shorter base URL (your domain) so the QR stays simpler and scans faster.
          </p>
        </div>
      </div>
    </Card>
  );
}

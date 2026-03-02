import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Machine QR System",
  description: "QR-based machine information system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        {/* Soft Apple-like background */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f5f5f7] to-[#ececf0]" />
          <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-black/5 blur-3xl" />
          <div className="absolute top-1/3 right-[-140px] h-[460px] w-[460px] rounded-full bg-black/5 blur-3xl" />
          <div className="absolute bottom-[-160px] left-[-160px] h-[520px] w-[520px] rounded-full bg-black/5 blur-3xl" />
        </div>

        {children}
      </body>
    </html>
  );
}

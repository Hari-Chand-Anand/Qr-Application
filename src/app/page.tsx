import Link from "next/link";
import { Card, Button } from "@/components/ui";

export default function HomePage() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Machine QR System</h1>
        <p className="mt-2 text-sm text-black/60">
          Go to the admin panel to create machines and download QR codes.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/admin"
            className="w-full"
          >
            <Button className="w-full py-3">Open Admin</Button>
          </Link>
          <Link
            href="/m/demo-001"
            className="w-full"
          >
            <Button variant="ghost" className="w-full py-3">Demo Landing</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}

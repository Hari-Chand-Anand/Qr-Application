import Link from "next/link";
import { Card, Button } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-6">
        <h1 className="text-2xl font-semibold">Machine not found</h1>
          <p className="mt-2 text-sm text-black/60">
          This QR code does not match any machine entry in the system.
        </p>
        <div className="mt-6">
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
        </div>
      </Card>
    </main>
  );
}

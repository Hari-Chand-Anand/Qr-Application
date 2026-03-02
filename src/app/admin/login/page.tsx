"use client";

import { useState } from "react";
import { Card, Input, Button } from "@/components/ui";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: form,
    });

    setLoading(false);

    if (res.ok) {
      window.location.href = "/admin";
      return;
    }

    const data = await res.json().catch(() => ({ message: "Login failed" }));
    setErr(data.message ?? "Login failed");
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <Card className="max-w-sm w-full p-6">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <p className="mt-1 text-sm text-black/60">
          Enter your admin username and password.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div>
            <label className="text-sm text-black/60">Username</label>
            <Input name="username" autoComplete="username" required />
          </div>

          <div>
            <label className="text-sm text-black/60">Password</label>
            <Input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          {err ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>
    </main>
  );
}

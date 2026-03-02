import * as React from "react";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className = "", ...rest } = props;
  return (
    <div
      className={
        "rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] " +
        className
      }
      {...rest}
    />
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      className={
        "w-full rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm text-[#1d1d1f] placeholder:text-black/40 shadow-sm focus:outline-none focus:ring-4 focus:ring-black/10 " +
        className
      }
      {...rest}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      className={
        "w-full rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm text-[#1d1d1f] placeholder:text-black/40 shadow-sm focus:outline-none focus:ring-4 focus:ring-black/10 " +
        className
      }
      {...rest}
    />
  );
}

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }
) {
  const { className = "", variant = "primary", ...rest } = props;

  const base =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm";

  const styles =
    variant === "primary"
      ? "bg-[#1d1d1f] text-white hover:bg-black"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "border border-black/10 bg-white/60 text-[#1d1d1f] hover:bg-white/80";

  return <button className={`${base} ${styles} ${className}`} {...rest} />;
}

export function Badge(props: React.HTMLAttributes<HTMLSpanElement>) {
  const { className = "", ...rest } = props;
  return (
    <span
      className={
        "inline-flex items-center rounded-full border border-black/10 bg-white/60 px-2 py-1 text-xs text-black/70 " +
        className
      }
      {...rest}
    />
  );
}

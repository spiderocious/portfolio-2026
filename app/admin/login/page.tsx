"use client";

import { useActionState, useRef } from "react";
import { loginAction } from "./actions";
import Link from "next/link";

const initialState = { error: "" };

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await loginAction(formData);
      return result ?? initialState;
    },
    initialState
  );

  return (
    <main className="min-h-screen bg-white flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex w-[420px] flex-shrink-0 bg-black flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <span className="inline-block w-3 h-3 rounded-full bg-[#4ade80]" />
            <span className="font-mono text-[13px] font-bold text-white tracking-tight">feranmi.admin</span>
          </div>
          <h2 className="font-mono text-[32px] font-black text-white leading-[1.1] tracking-tight mb-4">
            Content<br />Management
          </h2>
          <p className="font-mono text-[13px] text-white/50 leading-relaxed">
            Manage projects, writing,<br />experience, and site data.
          </p>
        </div>
        <p className="font-mono text-[11px] text-white/25">
          © {new Date().getFullYear()} feranmi.dev
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-[360px]">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#4ade80]" />
            <span className="font-mono text-[12px] font-bold text-black">feranmi.admin</span>
          </div>

          <div className="mb-10">
            <h1 className="font-mono text-[28px] font-black text-black tracking-tight leading-none mb-3">
              Sign in
            </h1>
            <p className="font-mono text-[13px] text-[#666666] font-medium">
              Enter your credentials to continue.
            </p>
          </div>

          <form action={formAction} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-black"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@domain.com"
                disabled={isPending}
                className="admin-input"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-black"
              >
                Password
              </label>
              <PasswordField disabled={isPending} />
            </div>

            {/* Error */}
            {state?.error && (
              <div className="border-l-4 border-[#ef4444] pl-4 py-2">
                <p className="font-mono text-[12px] text-[#ef4444] font-semibold">
                  {state.error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="admin-btn-primary mt-2"
            >
              {isPending ? "Signing in…" : "Sign in →"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#e4e4e4]">
            <Link
              href="/"
              className="font-mono text-[12px] font-semibold text-[#666666] hover:text-black transition-colors duration-150"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function PasswordField({ disabled }: { disabled: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);

  function toggle() {
    if (!inputRef.current) return;
    inputRef.current.type =
      inputRef.current.type === "password" ? "text" : "password";
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
        disabled={disabled}
        className="admin-input w-full pr-12"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label="Toggle password visibility"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-black transition-colors duration-150 p-1"
      >
        <EyeIcon />
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
      <path
        d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

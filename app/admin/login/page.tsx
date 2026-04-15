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
    <main className="min-h-screen flex items-center justify-center px-4 bg-a-base admin-grain">
      <div className="w-full max-w-100 flex flex-col">

        {/* Terminal bar */}
        <div className="h-10 flex items-center justify-between px-4 bg-a-raised border border-dashed border-a-border-hov/40 border-b-a-border rounded-t-md">
          <span className="font-mono text-[11px] text-a-ink-4 flex items-center gap-1">
            feranmi@admin&nbsp;~&nbsp;$
            <span className="inline-block w-[7px] h-[13px] bg-a-green align-middle animate-[cursor-blink_1s_step-end_infinite]" />
          </span>
        </div>

        {/* Card */}
        <div className="px-9 pt-10 pb-9 bg-a-card border border-t-0 border-a-border rounded-b-md">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-display text-[26px] font-normal leading-tight tracking-tight text-a-ink mb-2">
              Welcome back, Feranmi.
            </h1>
            <p className="font-mono text-[11px] text-a-ink-4">
              Enter your credentials to access the admin panel.
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-a-ink-4"
              >
                email
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
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-a-ink-4"
              >
                password
              </label>
              <PasswordField disabled={isPending} />
            </div>

            {/* Error */}
            {state?.error && (
              <p className="font-mono text-[11px] text-a-red -mt-1">
                {state.error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="admin-btn-primary mt-1 disabled:opacity-65"
            >
              {isPending ? "entering..." : "enter →"}
            </button>
          </form>

          {/* Back to site */}
          <div className="mt-7 text-center">
            <Link
              href="/"
              className="font-mono text-[11px] text-a-ink-4 hover:text-a-ink-3 transition-colors duration-150"
            >
              ← back to site
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
        className="admin-input w-full pr-10"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label="Toggle password visibility"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-a-ink-5 hover:text-a-ink-4 transition-colors duration-150"
      >
        <EyeIcon />
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

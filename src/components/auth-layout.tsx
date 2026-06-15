import type { ReactNode } from "react";
import jabilLogo from "@/assets/jabil-logo.png.asset.json";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      {/* LEFT PANEL */}
      <aside
        className="relative hidden w-2/5 flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground md:flex"
        aria-hidden="true"
      >
        {/* dot grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(0,163,224,0.6) 0%, transparent 70%)",
          }}
        />

        <div className="relative flex items-center">
          <div className="rounded-md bg-white px-3 py-2">
            <img src={jabilLogo.url} alt="Jabil" className="h-8 w-auto" />
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-5xl font-extrabold tracking-tight leading-[1.05]">
            Jabil Forms
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Operational forms for a global workforce.
          </p>
        </div>

        <p className="relative text-xs text-white/60">
          © 2025 Jabil Inc. Internal use only.
        </p>
      </aside>

      {/* RIGHT PANEL */}
      <main className="flex w-full flex-col md:w-3/5">
        {/* Mobile header */}
        <div className="flex items-center bg-primary px-6 py-4 md:hidden">
          <div className="rounded-md bg-white px-2 py-1">
            <img src={jabilLogo.url} alt="Jabil" className="h-5 w-auto" />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-[420px] animate-fade-up rounded-xl bg-card p-8 shadow-[0_8px_40px_-12px_rgba(0,54,92,0.18)]">
            <div className="mb-6">
              <img src={jabilLogo.url} alt="Jabil Forms" className="h-6 w-auto" />
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

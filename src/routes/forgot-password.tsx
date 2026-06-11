import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Field } from "./signin";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset Password — Jabil Forms" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!email) {
      setError("Email is required");
      setShake(true); setTimeout(() => setShake(false), 450);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email");
      setShake(true); setTimeout(() => setShake(false), 450);
      return;
    }
    setError(undefined);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setSentTo(email);
    setCooldown(30);
    setLoading(false);
  };

  const resend = () => {
    if (cooldown > 0) return;
    toast.success("Reset link sent again");
    setCooldown(30);
  };

  return (
    <AuthLayout>
      {!sentTo ? (
        <div className={shake ? "animate-shake" : undefined}>
          <h2 className="text-3xl font-bold tracking-tight">Reset your password</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Enter your work email and we'll send you a reset link.
          </p>
          <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
            <Field
              label="Work Email"
              id="email"
              type="email"
              placeholder="you@jabil.com"
              value={email}
              onChange={setEmail}
              error={error}
              autoComplete="email"
            />
            <Button type="submit" disabled={loading} className="h-12 w-full text-base">
              {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm">
            <Link to="/signin" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </Link>
          </p>
        </div>
      ) : (
        <div className="animate-fade-in text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight">Check your inbox</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a password reset link to{" "}
            <span className="font-medium text-foreground">{sentTo}</span>. Check your spam folder if you don't see it.
          </p>
          <button
            onClick={resend}
            disabled={cooldown > 0}
            className="mt-5 text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            {cooldown > 0 ? `Resend email in ${cooldown}s` : "Resend email"}
          </button>
          <div className="mt-6 border-t border-border pt-5">
            <Link to="/signin" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

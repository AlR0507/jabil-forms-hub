import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth-layout";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Field, PasswordField } from "./signin";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create Account — Jabil Forms" }] }),
  component: SignUpPage,
});

const DEPARTMENTS = [
  "Manufacturing",
  "Quality",
  "Engineering",
  "Logistics",
  "Finance",
  "HR",
  "IT",
  "Other",
];

function passwordStrength(pw: string): { label: string; score: 0 | 1 | 2 | 3; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "Weak", score: 1, color: "bg-destructive" };
  if (score === 2 || score === 3) return { label: "Fair", score: 2, color: "bg-amber-500" };
  return { label: "Strong", score: 3, color: "bg-success" };
}

function SignUpPage() {
  const { signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!department) e.department = "Select a department";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "At least 8 characters";
    else if (!/[A-Z]/.test(password)) e.password = "Must include 1 uppercase letter";
    else if (!/\d/.test(password)) e.password = "Must include 1 number";
    if (!confirm) e.confirm = "Confirm your password";
    else if (confirm !== password) e.confirm = "Passwords do not match";
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }
    setLoading(true);
    try {
      await signUp(name, email);
      toast.success("Account created. Welcome to Jabil Forms!");
      navigate({ to: "/dashboard" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={shake ? "animate-shake" : undefined}>
        <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Join your Jabil team on Jabil Forms
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <Field label="Full Name" id="name" value={name} onChange={setName}
            placeholder="Jane Smith" error={errors.name} autoComplete="name" />
          <Field label="Work Email" id="email" type="email" value={email} onChange={setEmail}
            placeholder="you@jabil.com" error={errors.email} autoComplete="email" />

          <div>
            <label htmlFor="department" className="mb-1.5 block text-sm font-medium">
              Department
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              aria-invalid={!!errors.department}
              aria-describedby={errors.department ? "department-error" : undefined}
              className={`h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                errors.department ? "border-destructive" : "border-input"
              }`}
            >
              <option value="">Select department…</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.department && (
              <p id="department-error" className="mt-1 text-xs text-destructive">{errors.department}</p>
            )}
          </div>

          <div>
            <PasswordField label="Password" id="password" value={password} onChange={setPassword}
              show={showPw} onToggle={() => setShowPw((s) => !s)} error={errors.password}
              autoComplete="new-password" />
            {password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= strength.score ? strength.color : "bg-border"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Strength: <span className="font-medium text-foreground">{strength.label}</span>
                </p>
              </div>
            )}
          </div>

          <PasswordField label="Confirm Password" id="confirm" value={confirm} onChange={setConfirm}
            show={showConfirm} onToggle={() => setShowConfirm((s) => !s)} error={errors.confirm}
            autoComplete="new-password" />

          <label className="flex cursor-pointer items-start gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-input accent-[var(--color-primary)]"
            />
            <span className="text-muted-foreground">
              I agree to the{" "}
              <a href="#" target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">Terms of Service</a>{" "}
              and{" "}
              <a href="#" target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">Privacy Policy</a>
            </span>
          </label>

          <Button type="submit" disabled={!agree || loading} className="h-12 w-full text-base">
            {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="font-medium text-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

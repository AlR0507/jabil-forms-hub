import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell, ChevronDown, FileText, Home, BarChart3, Users, Settings as SettingsIcon,
  CheckCircle2, Clock, Plus, Search, Menu, LogOut, User as UserIcon, ClipboardList,
  Workflow, Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Jabil Forms" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isAuthenticated || !user) return <Navigate to="/signin" replace />;

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out");
    navigate({ to: "/signin" });
  };

  const firstName = user.name.split(" ")[0];
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
        <button
          aria-label="Toggle sidebar"
          onClick={() => setSidebarOpen((s) => !s)}
          className="rounded-md p-2 hover:bg-secondary lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="hidden text-sm font-bold tracking-tight sm:inline">
            Jabil Forms
          </span>
        </div>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {["Dashboard", "My Forms", "Templates", "Reports"].map((n, i) => (
            <button
              key={n}
              onClick={() => i > 0 && toast.info(`${n} coming soon`)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                i === 0 ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search forms…"
              className="h-9 w-64 rounded-md border border-input bg-background pl-8 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            aria-label="Notifications"
            onClick={() => toast.info("No new notifications")}
            className="relative rounded-md p-2 hover:bg-secondary"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-md p-1.5 hover:bg-secondary"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {user.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:inline" />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="animate-fade-in absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-border bg-popover shadow-lg"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <div className="border-b border-border px-3 py-2.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <MenuItem icon={UserIcon} label="Profile" onClick={() => toast.info("Profile")} />
                <MenuItem icon={SettingsIcon} label="Settings" onClick={() => toast.info("Settings")} />
                <div className="border-t border-border" />
                <MenuItem icon={LogOut} label="Sign Out" onClick={handleSignOut} destructive />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside
          className={`${sidebarOpen ? "w-60" : "w-16"} hidden shrink-0 border-r border-border bg-card transition-all duration-200 lg:block`}
        >
          <nav className="flex flex-col gap-1 p-3">
            {[
              { icon: Home, label: "Home", active: true },
              { icon: ClipboardList, label: "Forms" },
              { icon: Inbox, label: "Approvals" },
              { icon: BarChart3, label: "Analytics" },
              { icon: Users, label: "Team" },
              { icon: SettingsIcon, label: "Settings" },
            ].map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                onClick={() => !active && toast.info(`${label} coming soon`)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>{label}</span>}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="mx-3 mt-2 hidden w-[calc(100%-1.5rem)] rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary lg:block"
          >
            {sidebarOpen ? "Collapse" : "Expand"}
          </button>
        </aside>

        {/* MAIN */}
        <main className="flex-1 overflow-x-auto px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {greeting}, {firstName}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{today}</p>
              </div>
              <Button
                onClick={() => toast.success("New form created")}
                className="h-10"
              >
                <Plus className="h-4 w-4" /> New Form
              </Button>
            </div>

            {/* STATS */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={FileText} label="Total Forms" value="248" tint="bg-primary/10 text-primary" />
              <StatCard icon={Clock} label="Pending Approvals" value="12" tint="bg-amber-500/10 text-amber-600" />
              <StatCard icon={CheckCircle2} label="Submitted Today" value="34" tint="bg-success/10 text-success" />
              <StatCard icon={Workflow} label="Active Workflows" value="7" tint="bg-accent/10 text-accent" />
            </div>

            {/* RECENT ACTIVITY */}
            <section className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold">Recent Activity</h2>
                  <p className="text-xs text-muted-foreground">Latest form submissions across your facilities</p>
                </div>
                <button
                  onClick={() => toast.info("Showing all activity")}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View all
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3 text-left font-medium">Form Name</th>
                      <th className="px-5 py-3 text-left font-medium">Submitted By</th>
                      <th className="px-5 py-3 text-left font-medium">Date</th>
                      <th className="px-5 py-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {ACTIVITY.map((r) => (
                      <tr key={r.id} className="transition-colors hover:bg-secondary/40">
                        <td className="px-5 py-3.5 font-medium">{r.name}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{r.by}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{r.date}</td>
                        <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon, label, onClick, destructive,
}: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void; destructive?: boolean }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-secondary ${
        destructive ? "text-destructive" : "text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function StatCard({
  icon: Icon, label, value, tint,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; tint: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tint}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: "Pending" | "Approved" | "Rejected" }) {
  const styles = {
    Pending: "bg-amber-500/10 text-amber-700 ring-amber-500/20",
    Approved: "bg-success/10 text-success ring-success/20",
    Rejected: "bg-destructive/10 text-destructive ring-destructive/20",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}>
      {status}
    </span>
  );
}

const ACTIVITY: Array<{ id: number; name: string; by: string; date: string; status: "Pending" | "Approved" | "Rejected" }> = [
  { id: 1, name: "Equipment Calibration Log #4421", by: "Maria Chen", date: "Today, 09:42", status: "Pending" },
  { id: 2, name: "Quality Inspection — Line 3", by: "David Patel", date: "Today, 08:15", status: "Approved" },
  { id: 3, name: "Material Variance Report", by: "Aisha Okafor", date: "Yesterday, 17:22", status: "Approved" },
  { id: 4, name: "Safety Incident — Bay 12", by: "Tomás Rivera", date: "Yesterday, 14:08", status: "Rejected" },
  { id: 5, name: "Shift Handover — Night Crew", by: "Lin Wei", date: "Jun 10, 23:05", status: "Approved" },
];

import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell, ChevronDown, FileText, Settings as SettingsIcon, CheckCircle2, Clock, Plus, Search, LogOut, User as UserIcon,
  Workflow, LayoutTemplate, Upload, Star, List, LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Jabil Forms" }] }),
  component: DashboardPage,
});

const TABS = ["Recent", "My forms", "Filled forms", "Shared with me", "Favorites"] as const;

const TEMPLATES = [
  { title: "Workflow Solution", desc: "Streamline your work flow: collect info, send reminders, view summaries. All set!", gradient: "from-[#6366f1] to-[#8b5cf6]" },
  { title: "Registration", desc: "Event sign-ups, training enrollment, visitor check-in.", gradient: "from-[#f97316] to-[#fb923c]" },
  { title: "Research", desc: "Surveys, feedback collection, market research.", gradient: "from-[#3b82f6] to-[#60a5fa]" },
  { title: "Quiz", desc: "Knowledge checks, certifications, compliance tests.", gradient: "from-[#ec4899] to-[#f472b6]" },
];

const FORMS = [
  { id: 1, name: "Equipment Calibration Log #4421", by: "Maria Chen", date: "Today, 09:42", status: "Pending" as const, responses: 12 },
  { id: 2, name: "Quality Inspection — Line 3", by: "David Patel", date: "Today, 08:15", status: "Approved" as const, responses: 34 },
  { id: 3, name: "Material Variance Report", by: "Aisha Okafor", date: "Yesterday, 17:22", status: "Approved" as const, responses: 8 },
  { id: 4, name: "Safety Incident — Bay 12", by: "Tomás Rivera", date: "Yesterday, 14:08", status: "Rejected" as const, responses: 1 },
  { id: 5, name: "Shift Handover — Night Crew", by: "Lin Wei", date: "Jun 10, 23:05", status: "Approved" as const, responses: 5 },
  { id: 6, name: "Supplier Audit Checklist", by: "Rachel Kim", date: "Jun 9, 16:30", status: "Pending" as const, responses: 0 },
];

function DashboardPage() {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredForms = FORMS.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.by.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
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

      {/* MAIN */}
      <main className="flex-1 overflow-x-auto px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* 1. Greeting */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {greeting}, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{today}</p>
          </div>

          {/* 2. Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => toast.success("New form created")}>
              <Plus className="h-4 w-4 mr-1.5" /> New Form
            </Button>
            <Button variant="outline" onClick={() => toast.success("New quiz created")}>
              <LayoutTemplate className="h-4 w-4 mr-1.5" /> New Quiz
            </Button>
            <Button variant="outline" onClick={() => toast.info("Import feature coming soon")}>
              <Upload className="h-4 w-4 mr-1.5" /> Quick import
            </Button>
          </div>

          {/* 3. Templates */}
          <section className="mt-8">
            <h2 className="mb-4 text-base font-semibold text-foreground">Explore templates</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TEMPLATES.map((t) => (
                <button
                  key={t.title}
                  onClick={() => toast.info(`Template "${t.title}" selected`)}
                  className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${t.gradient} p-5 text-left text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md`}
                >
                  <div className="relative z-10">
                    <p className="text-sm font-semibold">{t.title}</p>
                    <p className="mt-1 text-xs leading-relaxed opacity-90">{t.desc}</p>
                  </div>
                  {/* Decorative circle */}
                  <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
                </button>
              ))}
            </div>
          </section>

          {/* 4. Stats */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={FileText} label="Total Forms" value="248" tint="bg-primary/10 text-primary" />
            <StatCard icon={Clock} label="Pending Approvals" value="12" tint="bg-amber-500/10 text-amber-600" />
            <StatCard icon={CheckCircle2} label="Submitted Today" value="34" tint="bg-success/10 text-success" />
            <StatCard icon={Workflow} label="Active Workflows" value="7" tint="bg-accent/10 text-accent" />
          </div>

          {/* 5. Tabs + Search */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab !== "Recent") toast.info(`${tab} view coming soon`);
                  }}
                  className={`relative whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {tab === "Favorites" && <Star className="mr-1 inline h-3.5 w-3.5" />}
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Filter by keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-56 rounded-md border border-input bg-background pl-8 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-md p-2 ${viewMode === "list" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-md p-2 ${viewMode === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 6. Forms Grid / List */}
          <section className="mt-4">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredForms.map((form) => (
                  <FormCard key={form.id} form={form} />
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card">
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
                      {filteredForms.map((r) => (
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
              </div>
            )}
          </section>

        </div>
      </main>
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

function FormCard({ form }: { form: typeof FORMS[number] }) {
  const statusColors = {
    Pending: "bg-amber-500",
    Approved: "bg-success",
    Rejected: "bg-destructive",
  } as const;

  return (
    <button
      onClick={() => toast.info(`Opening "${form.name}"`)}
      className="rounded-xl border border-border bg-card p-0 text-left transition-shadow hover:shadow-sm overflow-hidden"
    >
      {/* Thumbnail area */}
      <div className="relative h-28 bg-secondary/60 flex items-center justify-center">
        <FileText className="h-10 w-10 text-muted-foreground/40" />
        <span className={`absolute top-3 right-3 h-2.5 w-2.5 rounded-full ${statusColors[form.status]}`} />
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold line-clamp-2">{form.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">{form.by}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{form.date}</span>
          <span className="text-xs font-medium text-muted-foreground">{form.responses} responses</span>
        </div>
      </div>
    </button>
  );
}

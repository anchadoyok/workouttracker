import { Link, NavLink, Outlet } from "react-router-dom";
import { Bike, Gauge, History, House, ReceiptText, Settings } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAppData } from "@/hooks/useAppData";
import { cn } from "@/lib/utils";

const navigation = [
  { to: "/", label: "Home", icon: House },
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/service-log", label: "Service Log", icon: ReceiptText },
  { to: "/odometer", label: "Odometer", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const AppShell = () => {
  const { motorcycles, selectedMotorcycleId, selectMotorcycle, profile } = useAppData();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(65,111,71,0.16),transparent_40%),linear-gradient(180deg,#f6f7f4_0%,#f3f0ea_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="rounded-2xl bg-brand-700 p-3 text-white">
                  <Bike className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-700">Daily commuter</p>
                  <h1 className="text-xl font-bold text-stone-950">Motorcycle Service Tracker</h1>
                </div>
              </Link>
            </div>
            <Card className="hidden min-w-52 p-4 sm:block">
              <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Session</p>
              <p className="mt-1 font-semibold text-stone-900">{profile?.displayName ?? "Anonymous rider"}</p>
              <p className="mt-1 text-xs text-stone-500">Anonymous auth is enabled for fast onboarding.</p>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Selected motorcycle</p>
                <p className="mt-1 text-lg font-semibold text-stone-900">
                  {motorcycles.find((motorcycle) => motorcycle.id === selectedMotorcycleId)?.nickname ?? "None yet"}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={selectedMotorcycleId ?? ""}
                  onChange={(event) => selectMotorcycle(event.target.value)}
                  className="min-w-56 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-brand-500"
                >
                  {motorcycles.length === 0 ? <option value="">No motorcycles</option> : null}
                  {motorcycles.map((motorcycle) => (
                    <option key={motorcycle.id} value={motorcycle.id}>
                      {motorcycle.nickname}
                    </option>
                  ))}
                </select>
                <Link to="/motorcycles/new">
                  <Button variant="secondary">Add motorcycle</Button>
                </Link>
              </div>
            </div>
          </Card>
        </header>

        <main className="grid flex-1 gap-6 lg:grid-cols-[220px,1fr]">
          <nav className="hidden lg:block">
            <Card className="sticky top-6 space-y-2 p-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                        isActive ? "bg-brand-700 text-white" : "text-stone-600 hover:bg-stone-100",
                      )
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </Card>
          </nav>

          <div className="space-y-6">
            <Outlet />
          </div>
        </main>

        <nav className="fixed inset-x-4 bottom-4 z-50 rounded-3xl bg-white/95 p-2 shadow-card ring-1 ring-stone-200 backdrop-blur lg:hidden">
          <div className="grid grid-cols-5 gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-medium transition",
                      isActive ? "bg-brand-700 text-white" : "text-stone-500",
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

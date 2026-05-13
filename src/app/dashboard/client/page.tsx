"use client";

import { useEffect, useState } from "react";
import { 
  Package, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Boxes,
  ArrowRight,
  Bell
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getClientDashboardStats, getClientBookingHistory } from "@/lib/actions/client";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ClientDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [s, h] = await Promise.all([
        getClientDashboardStats(),
        getClientBookingHistory()
      ]);
      setStats(s);
      setHistory(h);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="p-8 animate-pulse space-y-4"><div className="h-32 bg-slate-100 rounded-xl" /><div className="h-64 bg-slate-50 rounded-2xl" /></div>;

  const notifications = history.filter(b => b.status !== 'PENDING').slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Client Workspace</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Inventory Tracker</p>
        </div>
        <Link href="/dashboard/client/book">
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-8 text-[11px] font-bold uppercase tracking-wider rounded-lg gap-2">
            <Package className="h-3.5 w-3.5" /> Book Space
          </Button>
        </Link>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Managed Weight" 
          value={`${stats?.totalWeight || 0} MT`} 
          subtext="Net weight in approved nodes"
          icon={TrendingUp} 
          iconColor="text-emerald-500"
        />
        <StatCard 
          label="Active Contracts" 
          value={stats?.activeBookings || 0} 
          subtext="Live storage facilities"
          icon={Boxes} 
          iconColor="text-blue-500"
        />
        <StatCard 
          label="Pending Requests" 
          value={stats?.pendingRequests || 0} 
          subtext="Awaiting owner verification"
          icon={Clock} 
          iconColor="text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Notifications */}
        <Card className="lg:col-span-1 p-4 border border-slate-200 shadow-sm rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Bell className="h-3 w-3" /> System Alerts
            </h3>
          </div>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-[10px] text-slate-400 font-medium italic">No recent status updates</p>
            ) : notifications.map(n => (
              <div key={n.id} className="flex items-start gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <div className={cn(
                  "h-1.5 w-1.5 rounded-full mt-1.5 shrink-0",
                  n.status === 'APPROVED' ? "bg-emerald-500" : "bg-red-500"
                )} />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-slate-900 leading-tight">
                    {n.warehouse?.name} Request {n.status === 'APPROVED' ? 'Accepted' : 'Rejected'}
                  </p>
                  <p className="text-[9px] text-slate-400 font-medium">Verified by owner</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Commodity Distribution Placeholder */}
        <Card className="lg:col-span-2 p-4 border border-slate-200 shadow-sm rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Package className="h-3 w-3" /> Distribution by Material
            </h3>
          </div>
          <div className="h-48 flex items-center justify-center border-dashed border border-slate-100 rounded-lg">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Live weight visualization active</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, subtext, icon: Icon, iconColor }: any) {
  return (
    <Card className="p-4 border border-slate-200 shadow-sm rounded-xl bg-white flex items-center justify-between group hover:border-indigo-500/20 transition-all">
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
        <p className="text-[9px] text-slate-400 font-medium">{subtext}</p>
      </div>
      <div className={cn("h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center", iconColor)}>
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
    </Card>
  );
}
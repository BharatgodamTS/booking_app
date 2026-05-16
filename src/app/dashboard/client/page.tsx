"use client";

import { useEffect, useState } from "react";
import { 
  Package, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Boxes,
  Bell,
  ArrowUpRight,
  ChevronRight,
  AlertCircle
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

  if (isLoading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-64 bg-slate-100 rounded-xl" />
        <div className="lg:col-span-2 h-64 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );

  const notifications = history.filter(b => b.status !== 'PENDING').slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight italic">Overview <span className="text-slate-400 font-normal not-italic">Dashboard</span></h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Logistics Monitoring</p>
        </div>
        <Link href="/dashboard/client/book">
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 h-8 text-[10px] font-black uppercase tracking-wider rounded-lg px-4 gap-2 shadow-lg shadow-orange-100">
            <Package className="h-3.5 w-3.5" /> Acquire Space
          </Button>
        </Link>
      </div>

      {/* High-Density Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Managed Weight" 
          value={`${stats?.totalWeight || 0} MT`} 
          subtext="Net weight in approved nodes"
          icon={TrendingUp} 
          iconColor="text-emerald-500"
          trend="+2.4% vs last month"
        />
        <StatCard 
          label="Active Contracts" 
          value={stats?.activeBookings || 0} 
          subtext="Verified storage nodes"
          icon={Boxes} 
          iconColor="text-indigo-500"
        />
        <StatCard 
          label="Pending Requests" 
          value={stats?.pendingRequests || 0} 
          subtext="Awaiting owner authorization"
          icon={Clock} 
          iconColor="text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Alerts (Left Column) */}
        <Card className="lg:col-span-1 border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Bell className="h-3.5 w-3.5" /> System Alerts
            </h3>
            <span className="text-[9px] font-bold text-slate-400 uppercase">{notifications.length} New</span>
          </div>
          <div className="p-1.5 space-y-1.5">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <AlertCircle className="h-6 w-6 text-slate-200 mx-auto mb-2" />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No Recent Alerts</p>
              </div>
            ) : notifications.map(n => (
              <div key={n.id} className="flex items-start gap-3 p-2.5 bg-slate-50/50 hover:bg-slate-50 rounded-lg border border-slate-100/50 transition-colors group">
                <div className={cn(
                  "h-2 w-2 rounded-full mt-1 shrink-0 shadow-sm",
                  n.status === 'APPROVED' ? "bg-emerald-500 shadow-emerald-200" : "bg-red-500 shadow-red-200"
                )} />
                <div className="flex-1 space-y-0.5">
                  <p className="text-[11px] font-black text-slate-800 leading-tight">
                    {n.warehouse?.name} Request {n.status === 'APPROVED' ? 'Accepted' : 'Rejected'}
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                    {new Date(n.updatedAt).toLocaleDateString()} • Authorization Complete
                  </p>
                </div>
                <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
          <div className="p-3 bg-slate-50/30 border-t border-slate-100">
            <Link href="/dashboard/client/history" className="text-[9px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest flex items-center justify-center gap-1 transition-colors">
              View Full Audit Ledger <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </Card>

        {/* Distribution & Performance (Right Column) */}
        <Card className="lg:col-span-2 p-4 border border-slate-200 shadow-sm rounded-xl bg-white space-y-6">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Package className="h-3.5 w-3.5" /> Distribution by Material
            </h3>
            <div className="flex gap-2">
              <div className="h-1.5 w-8 bg-indigo-500 rounded-full" />
              <div className="h-1.5 w-8 bg-emerald-500 rounded-full" />
              <div className="h-1.5 w-8 bg-slate-200 rounded-full" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 py-8">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                  <span className="text-slate-600 tracking-wider">Industrial Grains</span>
                  <span className="text-slate-400 italic">42%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                  <span className="text-slate-600 tracking-wider">Chemical Grade</span>
                  <span className="text-slate-400 italic">28%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                  <span className="text-slate-600 tracking-wider">Metals / Alloys</span>
                  <span className="text-slate-400 italic">30%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-600 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center border-l border-slate-50 text-center">
              <div className="h-16 w-16 rounded-full border-4 border-indigo-600 border-t-slate-100 animate-spin-slow flex items-center justify-center mb-2">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-tight">Infrastructure<br/>Audit Active</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, subtext, icon: Icon, iconColor, trend }: any) {
  return (
    <Card className="p-4 border border-slate-200 shadow-sm rounded-xl bg-white flex items-center justify-between group hover:border-orange-500/20 transition-all cursor-default">
      <div className="space-y-0.5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
        <div className="flex items-center gap-1.5 mt-1">
          {trend ? (
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter px-1.5 py-0.5 bg-emerald-50 rounded-md">
              {trend}
            </span>
          ) : (
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{subtext}</span>
          )}
        </div>
      </div>
      <div className={cn("h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm", iconColor)}>
        <Icon className="h-5 w-5" strokeWidth={2.5} />
      </div>
    </Card>
  );
}
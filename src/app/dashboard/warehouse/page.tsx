"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  Boxes, 
  Warehouse, 
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/actions/warehouse";
import { TransactionFilterBar } from "@/components/features/TransactionFilterBar";
import { cn } from "@/lib/utils";

export default function SimplifiedLogisticsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  if (isLoading) return (
    <div className="space-y-6 animate-pulse p-10">
      <div className="grid grid-cols-2 gap-8">
        {[1,2].map(i => <div key={i} className="h-40 bg-slate-100 rounded-[2rem]" />)}
        {[1,2].map(i => <div key={i} className="h-28 bg-slate-50 rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Command Center</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Logistics Intelligence</p>
        </div>
      </div>

      {/* Primary Logistics Row: 2 Large Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PrimaryWidget 
          title="Total Transactions" 
          value={stats?.totalTransactions || "0"} 
          icon={Activity}
          iconColor="text-orange-600"
          description="Logistics movements"
        />
        <PrimaryWidget 
          title="Current Inventory (MT)" 
          value={stats?.currentInventory?.toLocaleString() || "0"} 
          icon={Boxes}
          iconColor="text-blue-600"
          description="Stored weight"
        />
      </div>

      {/* Secondary Operations Row: 2 Medium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailWidget 
          title="Active Warehouses" 
          value={stats?.activeWarehouses || "0"} 
          icon={Warehouse}
          color="border-l-indigo-600"
        />
        <DetailWidget 
          title="Pending Requests" 
          value={stats?.pendingRequests || "0"} 
          icon={Clock}
          color="border-l-orange-500"
        />
      </div>

      {/* Bottom Section: Transactions Report */}
      <div className="space-y-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900">Transaction Analytics</h3>
            <p className="text-[10px] font-medium text-slate-500 uppercase">Audit trail across network nodes</p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-100 text-center min-w-[80px]">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Inwards</p>
              <p className="text-sm font-bold text-slate-900">58</p>
            </div>
            <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-100 text-center min-w-[80px]">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Outwards</p>
              <p className="text-sm font-bold text-slate-900">3</p>
            </div>
          </div>
        </div>

        <TransactionFilterBar />
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-64 flex items-center justify-center border-dashed">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">Logistics stream active</p>
        </div>
      </div>
    </div>
  );
}

function PrimaryWidget({ title, value, icon: Icon, iconColor, description }: any) {
  return (
    <Card className="border border-slate-200 shadow-sm p-4 flex items-center justify-between bg-white rounded-xl">
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h4>
        <p className="text-[9px] font-medium text-slate-400">{description}</p>
      </div>
      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center bg-slate-50", iconColor)}>
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
    </Card>
  );
}

function DetailWidget({ title, value, icon: Icon, color }: any) {
  return (
    <Card className={cn("border border-slate-200 shadow-sm p-3 bg-white border-l-4 rounded-lg flex items-center justify-between", color)}>
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{value}</h4>
      </div>
      <Icon className="h-4 w-4 text-slate-300" strokeWidth={1.5} />
    </Card>
  );
}

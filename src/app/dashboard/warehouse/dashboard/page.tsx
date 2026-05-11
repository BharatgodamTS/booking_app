"use client";

import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Layers, 
  IndianRupee,
  Building2,
  Users,
  FileText,
  Download
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/actions/warehouse";
import { TransactionFilterBar } from "@/components/features/TransactionFilterBar";
import { cn } from "@/lib/utils";

export default function BNSDashboard() {
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
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-3 gap-6">
        {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Top Row: 3 Primary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PrimaryWidget 
          title="Total Transactions" 
          value="61" 
          icon={LayoutDashboard}
          iconColor="bg-orange-100 text-orange-600"
        />
        <PrimaryWidget 
          title="Current Inventory (MT)" 
          value="1,227" 
          icon={Layers}
          iconColor="bg-blue-100 text-blue-600"
        />
        <PrimaryWidget 
          title="Total Revenue" 
          value={`₹${(134865.07).toLocaleString()}`} 
          icon={IndianRupee}
          iconColor="bg-emerald-100 text-emerald-600"
        />
      </div>

      {/* Middle Row: 4 Detail Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <DetailWidget title="ACTIVE WAREHOUSES" value="4" />
        <DetailWidget title="ACTIVE CLIENTS" value="15" />
        <DetailWidget title="INVOICES" value="19" />
        <DetailWidget title="INWARDS THIS MONTH" value="2" />
      </div>

      {/* Bottom Section: Transactions Report */}
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Transaction Report</h3>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              All inward and outward transactions made by the client across all warehouses. You can filter the results by selecting a specific client and warehouse from the dropdowns below.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <StatusBadge label="INWARD" value="58" color="text-orange-600 bg-orange-50" />
            <StatusBadge label="OUTWARD" value="3" color="text-blue-600 bg-blue-50" />
            <StatusBadge label="FILTERED TOTAL" value="61" color="text-slate-600 bg-slate-50" />
          </div>
        </div>

        <TransactionFilterBar />
        
        {/* Placeholder for Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-96 flex items-center justify-center">
          <p className="text-xs font-black text-slate-300 uppercase tracking-widest italic">Data Table initialized in Master Control Mode</p>
        </div>
      </div>
    </div>
  );
}

function PrimaryWidget({ title, value, icon: Icon, iconColor }: any) {
  return (
    <Card className="border-none shadow-sm p-6 flex items-center justify-between group hover:shadow-md transition-all duration-300 bg-white">
      <div className="space-y-1">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <h4 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h4>
      </div>
      <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", iconColor)}>
        <Icon className="h-6 w-6" />
      </div>
    </Card>
  );
}

function DetailWidget({ title, value }: any) {
  return (
    <Card className="border-none shadow-sm p-5 bg-white group hover:border-orange-500/20 transition-all border-l-4 border-l-transparent hover:border-l-orange-500">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h4 className="text-xl font-black text-slate-900 tracking-tighter mt-1">{value}</h4>
    </Card>
  );
}

function StatusBadge({ label, value, color }: any) {
  return (
    <div className={cn("px-4 py-2 rounded-lg flex flex-col items-center min-w-[80px]", color)}>
      <span className="text-[9px] font-black tracking-widest">{label}</span>
      <span className="text-sm font-black tracking-tighter">{value}</span>
    </div>
  );
}
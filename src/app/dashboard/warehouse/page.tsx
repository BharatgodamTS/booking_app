"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  Boxes, 
  Warehouse, 
  Clock,
  CheckCircle2,
  XCircle,
  User,
  ArrowRight,
  Package,
  Weight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDashboardStats, getOwnerBookings, updateBookingStatus } from "@/lib/actions/warehouse";
import { TransactionFilterBar } from "@/components/features/TransactionFilterBar";
import { DashboardSkeleton } from "@/components/shared/DashboardSkeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export default function SimplifiedLogisticsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchData = async () => {
    const [statsData, bookingsData] = await Promise.all([
      getDashboardStats(),
      getOwnerBookings('PENDING')
    ]);
    setStats(statsData);
    setPendingRequests(bookingsData.slice(0, 5));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setIsProcessing(id);
    const result = await updateBookingStatus(id, status);
    if (result.success) {
      toast.success(status === 'APPROVED' ? "Logistics Handshake Validated" : "Request Denied");
      fetchData();
    } else {
      toast.error(result.error);
    }
    setIsProcessing(null);
  };

  if (isLoading) return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight italic">Command <span className="text-slate-400 font-normal not-italic">Center</span></h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Logistics Intelligence</p>
      </div>
      <DashboardSkeleton />
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-black text-slate-900 tracking-tight italic">Command <span className="text-slate-400 font-normal not-italic">Center</span></h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Logistics Intelligence</p>
        </div>
        <Link href="/dashboard/warehouse/reports">
          <Button variant="outline" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 rounded-xl gap-2 shadow-sm">
            Operational Reports <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget title="Total Transactions" value={stats?.totalTransactions} icon={Activity} color="text-indigo-600" />
        <StatWidget title="Active Inventory (MT)" value={stats?.currentInventory} icon={Boxes} color="text-orange-600" />
        <StatWidget title="Live Terminals" value={stats?.activeWarehouses} icon={Warehouse} color="text-emerald-600" />
        <StatWidget title="Pending Requests" value={stats?.pendingRequests} icon={Clock} color="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incoming Requests Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-3">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Incoming Logistics Requests</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {pendingRequests.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
                  <CheckCircle2 className="h-6 w-6 text-slate-300" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">Operational Queue Clear</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">You're all caught up! No pending handshakes.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 transition-colors group-hover:bg-indigo-600">
                        <User className="h-5 w-5 text-indigo-600 group-hover:text-white" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none">{req.client?.name}</p>
                          <Badge variant="outline" className="text-[8px] font-black uppercase bg-white border-slate-200">{req.commodityType}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                          <span className="flex items-center gap-1"><Warehouse className="h-3 w-3" /> {req.warehouse?.name}</span>
                          <span className="flex items-center gap-1"><Weight className="h-3 w-3" /> {req.weight} MT</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleAction(req.id, 'REJECTED')}
                        disabled={!!isProcessing}
                        variant="outline" 
                        className="h-8 w-8 rounded-lg border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-100 p-0"
                      >
                        {isProcessing === req.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-4 w-4" />}
                      </Button>
                      <Button 
                        onClick={() => handleAction(req.id, 'APPROVED')}
                        disabled={!!isProcessing}
                        className="h-8 px-4 bg-[#0f172a] hover:bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest rounded-lg gap-2"
                      >
                        {isProcessing === req.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />} Validate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Insights / Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Operational Insights</h3>
          </div>
          <div className="bg-slate-900 p-6 rounded-3xl text-white space-y-6 shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Package className="h-20 w-20" />
            </div>
            <div className="relative z-10 space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Network Pulse</p>
              <h4 className="text-lg font-black uppercase italic">Logistics Stream <span className="text-indigo-400">Active</span></h4>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
               <div className="space-y-0.5">
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Approval Rate</p>
                  <p className="text-xl font-black">94%</p>
               </div>
               <div className="space-y-0.5">
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Avg Response</p>
                  <p className="text-xl font-black">2.4h</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Filter Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-slate-900 pl-3">
          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Transaction Stream</h3>
        </div>
        <TransactionFilterBar />
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm h-48 flex items-center justify-center border-dashed">
          <div className="text-center space-y-2 opacity-30">
            <AlertCircle className="h-8 w-8 mx-auto" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] italic">Full ledger available in reports</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatWidget({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="p-5 border-slate-200 shadow-sm bg-white rounded-3xl flex items-center justify-between group hover:border-indigo-600 transition-all cursor-default">
      <div className="space-y-0.5">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
        <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{value || "0"}</h4>
      </div>
      <div className={cn("h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform", color)}>
        <Icon className="h-5 w-5" strokeWidth={2.5} />
      </div>
    </Card>
  );
}

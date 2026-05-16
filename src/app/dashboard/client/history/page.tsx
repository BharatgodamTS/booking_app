"use client";

import { useEffect, useState } from "react";
import { 
  History, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Warehouse as WarehouseIcon,
  Tag,
  Calendar,
  ExternalLink,
  ChevronDown,
  Download,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getClientBookingHistory } from "@/lib/actions/client";
import { cn } from "@/lib/utils";

export default function BookingHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getClientBookingHistory();
      setHistory(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredHistory = history.filter(b => {
    const matchesSearch = b.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.commodityType || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight italic">Audit <span className="text-slate-400 font-normal not-italic">Ledger</span></h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Historical Verification of Logistics Requests</p>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest border-slate-200 gap-2 hover:bg-slate-50">
          <Download className="h-3 w-3" /> Export CSV
        </Button>
      </div>

      {/* High-Density Filtering Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 flex items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input 
            placeholder="Search by facility or material identification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border-none rounded-lg text-xs font-bold uppercase tracking-wide outline-none placeholder:text-slate-300"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-2 border-r border-slate-200 pr-2">Status</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase outline-none text-slate-600 cursor-pointer"
            >
              <option value="ALL">All States</option>
              <option value="PENDING">Pending Auth</option>
              <option value="APPROVED">Live Contract</option>
              <option value="REJECTED">Denied Node</option>
            </select>
          </div>
          <div className="h-4 w-px bg-slate-100 mx-1" />
          <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400 hover:text-slate-900">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Ledger Core */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0f172a] text-white">
              <tr className="border-b border-slate-800">
                <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest">Initialization Date</th>
                <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest">Facility Terminal</th>
                <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest">Material ID</th>
                <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest">Tonnage (MT)</th>
                <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest">Contract Lifecycle</th>
                <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-right">Auth Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-4 py-3.5"><div className="h-3.5 bg-slate-50 rounded-md w-full" /></td>
                  </tr>
                ))
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-20 text-center text-slate-300 font-black text-[10px] uppercase tracking-[0.2em] italic">
                    No Historical Transactions Identified
                  </td>
                </tr>
              ) : (
                filteredHistory.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                      {new Date(booking.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center transition-colors group-hover:bg-slate-800 group-hover:border-slate-800">
                          <WarehouseIcon className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none block">{booking.warehouse.name}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">LOC: {booking.warehouse.address.split(',')[0]}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50/50 border border-indigo-100/50 rounded-md w-fit">
                        <Tag className="h-2.5 w-2.5 text-indigo-400" />
                        <span className="text-[10px] font-black text-indigo-700 uppercase tracking-tight">{booking.commodityType || "GENERAL"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[11px] font-black text-slate-900 tracking-tighter">
                        {booking.weight.toLocaleString()} <span className="text-[9px] font-bold text-slate-400">MT</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        <Calendar className="h-3 w-3 text-slate-300" />
                        {new Date(booking.startDate).toLocaleDateString()} <ArrowUpRight className="h-2.5 w-2.5" /> {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <StatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string, icon: any, color: string }> = {
    PENDING: { label: "Pending Auth", icon: Clock, color: "bg-amber-50 text-amber-700 border-amber-100" },
    APPROVED: { label: "Live Contract", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    REJECTED: { label: "Denied Node", icon: XCircle, color: "bg-red-50 text-red-700 border-red-100" },
  };

  const config = configs[status] || configs.PENDING;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[9px] font-black uppercase tracking-wider shadow-sm",
      config.color
    )}>
      <config.icon className="h-3 w-3" strokeWidth={3} />
      {config.label}
    </div>
  );
}

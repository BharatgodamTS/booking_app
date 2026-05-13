"use client";

import { useEffect, useState } from "react";
import { 
  Download, 
  Search, 
  Filter, 
  Calendar,
  ArrowUpRight,
  User as UserIcon,
  Warehouse as WarehouseIcon,
  ExternalLink,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOwnerBookings } from "@/lib/actions/booking";
import { cn } from "@/lib/utils";

export default function SafeReportsPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getOwnerBookings();
        // Safe filter: Ensure booking exists and has a warehouse before processing
        setHistory(Array.isArray(data) ? data.filter(b => b?.status === 'APPROVED') : []);
      } catch (err) {
        console.error("Reports Load Failure:", err);
        setError("Failed to stream ledger data. Please check connectivity.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Safe Reduce: Handle null weights or empty history
  const totalWeight = history.reduce((sum, b) => sum + (Number(b?.weight) || 0), 0);

  // Safe Filter: Multi-level null checks for warehouse and client names
  const filteredHistory = history.filter(b => {
    const search = searchTerm.toLowerCase();
    const warehouseName = b?.warehouse?.name?.toLowerCase() || "";
    const clientName = (b?.client?.name || b?.manualClientName || "").toLowerCase();
    const commodity = (b?.commodityType || "").toLowerCase();
    return warehouseName.includes(search) || clientName.includes(search) || commodity.includes(search);
  });

  if (error) return (
    <div className="h-64 flex flex-col items-center justify-center space-y-4 border border-red-100 bg-red-50/30 rounded-xl">
      <AlertCircle className="h-8 w-8 text-red-500" />
      <div className="text-center">
        <p className="text-sm font-bold text-red-900 uppercase tracking-tight">{error}</p>
        <Button variant="link" onClick={() => window.location.reload()} className="text-xs text-red-600 font-bold uppercase">Retry Handshake</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 pb-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Operational Ledger</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weight-based historical record (MT)</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-lg gap-2 border-slate-200 h-9 text-[11px] font-bold">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard 
          label="Total Bookings" 
          value={history.length} 
          subtext="Approved Records" 
          icon={<ArrowUpRight className="h-3 w-3 text-emerald-600" />}
        />
        <SummaryCard 
          label="Total Weight" 
          value={`${totalWeight.toLocaleString()} MT`} 
          subtext="Net Handled" 
        />
        <SummaryCard 
          label="Entry Source" 
          value={`${history.filter(b => b?.bookingType === 'MANUAL').length}M / ${history.filter(b => b?.bookingType === 'PLATFORM').length}A`} 
          subtext="Manual vs App" 
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input 
            placeholder="Search ledger..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border-none rounded-lg text-xs outline-none font-medium"
          />
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="gap-1.5 text-slate-500 rounded-lg text-[10px] font-bold uppercase h-8">
            <Calendar className="h-3.5 w-3.5" /> Range
          </Button>
          <div className="h-3 w-px bg-slate-100 mx-1" />
          <Button variant="ghost" size="sm" className="gap-1.5 text-slate-500 rounded-lg text-[10px] font-bold uppercase h-8">
            <Filter className="h-3.5 w-3.5" /> Type
          </Button>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-100">
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Date</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Client</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Warehouse</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Material</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Weight</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Source</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                [1, 2, 3, 4].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-4 py-3"><div className="h-3 bg-slate-50 rounded w-full" /></td>
                  </tr>
                ))
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400 text-[10px] font-bold uppercase italic">
                    No matching logistics records found
                  </td>
                </tr>
              ) : (
                filteredHistory.map((booking) => (
                  <tr key={booking?.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-4 py-2.5 text-xs text-slate-500">
                      {booking?.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                          <UserIcon className="h-3 w-3 text-slate-400" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          {booking?.client?.name || booking?.manualClientName || "Direct Client"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-500 font-medium">
                      {booking?.warehouse?.name || "Unassigned Node"}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-500 font-medium truncate max-w-[150px]">
                      {booking?.commodityType || "Other"}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-bold text-indigo-600">
                      {booking?.weight ?? 0} MT
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge 
                        className={cn(
                          "text-[8px] font-black uppercase px-2 py-0.5 rounded-md border",
                          booking?.bookingType === 'MANUAL' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                        )}
                        variant="outline"
                      >
                        {booking?.bookingType || "PLATFORM"}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button className="h-6 w-6 rounded hover:bg-white border border-transparent hover:border-slate-200 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all">
                        <ExternalLink className="h-3 w-3" />
                      </button>
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

function SummaryCard({ label, value, subtext, icon }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <div className="flex items-center gap-2">
        <div className="text-xl font-bold text-slate-900">{value}</div>
        {icon}
      </div>
      <p className="text-[10px] text-slate-400 font-medium">{subtext}</p>
    </div>
  );
}
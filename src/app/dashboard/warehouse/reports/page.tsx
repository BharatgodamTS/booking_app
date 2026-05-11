"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, 
  Search, 
  Filter, 
  Download,
  Calendar,
  ArrowUpRight,
  User as UserIcon,
  Warehouse as WarehouseIcon,
  Tag,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOwnerBookings } from "@/lib/actions/booking";

export default function ReportsPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getOwnerBookings();
      setHistory(data.filter(b => b.status === 'APPROVED'));
      setIsLoading(false);
    };
    fetchHistory();
  }, []);

  const totalWeight = history.reduce((sum, b) => sum + (b.weight || 0), 0);

  const filteredHistory = history.filter(b => 
    b.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.client?.name || b.manualClientName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Operational Ledger</h1>
          <p className="text-slate-500">Weight-based historical record (MT) of all active storage contracts.</p>
        </div>
        <Button variant="outline" className="rounded-xl gap-2 border-slate-200">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Bookings</p>
          <div className="text-3xl font-bold text-slate-900">{history.length}</div>
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-1">
            <ArrowUpRight className="h-3 w-3" /> All Time
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Weight Handled</p>
          <div className="text-3xl font-bold text-slate-900">{totalWeight.toLocaleString()} MT</div>
          <p className="text-xs text-slate-400 mt-1">Across all contracts</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Entry distribution</p>
          <div className="text-xl font-bold text-slate-900">
            {history.filter(b => b.bookingType === 'MANUAL').length} Manual / {history.filter(b => b.bookingType === 'PLATFORM').length} App
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-2 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            placeholder="Search client, warehouse or commodity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border-none rounded-xl text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500 rounded-xl">
            <Calendar className="h-4 w-4" /> Date Range
          </Button>
          <div className="h-4 w-px bg-slate-100 mx-2" />
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500 rounded-xl">
            <Filter className="h-4 w-4" /> Commodity
          </Button>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Client</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Warehouse</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Commodity</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Weight</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Source</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="px-6 py-8">
                    <div className="h-4 bg-slate-50 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center text-slate-400 text-sm">
                  No records found matching your filters.
                </td>
              </tr>
            ) : (
              filteredHistory.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-indigo-50 flex items-center justify-center">
                        <UserIcon className="h-3.5 w-3.5 text-indigo-500" />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        {booking.client?.name || booking.manualClientName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <WarehouseIcon className="h-3.5 w-3.5 text-slate-400" />
                      {booking.warehouse.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-[200px]">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 truncate">
                      <Tag className="h-3 w-3 text-slate-400 shrink-0" />
                      {booking.commodityType || "Other"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">
                    {booking.weight} MT
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      className={booking.bookingType === 'MANUAL' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"}
                      variant="outline"
                    >
                      {booking.bookingType}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="h-8 w-8 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
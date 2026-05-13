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
  ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Acquisition Ledger</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Historical record of all logistics requests</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-1.5 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input 
            placeholder="Search warehouse or material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border-none rounded-lg text-xs outline-none font-medium"
          />
        </div>
        <div className="flex items-center gap-1">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2 bg-slate-50 border-none rounded-lg text-[10px] font-bold uppercase outline-none text-slate-500"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <div className="h-3 w-px bg-slate-100 mx-1" />
          <Button variant="ghost" size="sm" className="gap-1.5 text-slate-500 rounded-lg text-[10px] font-bold uppercase h-8">
            <Filter className="h-3.5 w-3.5" /> Filter
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-100">
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Date</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Warehouse</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Material</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Weight</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Duration</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-4 py-3"><div className="h-3 bg-slate-50 rounded w-full" /></td>
                  </tr>
                ))
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-[10px] font-bold uppercase italic">
                    No historical records found
                  </td>
                </tr>
              ) : (
                filteredHistory.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-4 py-2.5 text-xs text-slate-500 font-medium">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                          <WarehouseIcon className="h-3 w-3 text-slate-400" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">{booking.warehouse.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <Tag className="h-3 w-3 text-slate-300" />
                        <span className="text-xs text-slate-500 font-medium">{booking.commodityType || "Other"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs font-bold text-slate-900">
                      {booking.weight} MT
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                        <Calendar className="h-3 w-3" />
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Badge 
                        className={cn(
                          "text-[8px] font-black uppercase px-2 py-0.5 rounded-md border",
                          booking.status === 'APPROVED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                          booking.status === 'REJECTED' ? "bg-red-50 text-red-600 border-red-100" : 
                          "bg-amber-50 text-amber-600 border-amber-100"
                        )}
                        variant="outline"
                      >
                        {booking.status}
                      </Badge>
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

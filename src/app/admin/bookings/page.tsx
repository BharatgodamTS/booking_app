"use client";

import { useEffect, useState } from "react";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Eye, 
  User, 
  Building2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Download,
  Calendar,
  Weight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMasterBookingLedger } from "@/lib/actions/admin";
import AdminBookingDetailModal from "@/components/features/AdminBookingDetailModal";
import { cn } from "@/lib/utils";

export default function AdminBookingHistory() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getMasterBookingLedger();
    setBookings(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredBookings = bookings.filter(b => 
    b.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.warehouse?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.commodityType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-black text-slate-900 tracking-tight italic">Master <span className="text-slate-400 font-normal not-italic">Ledger</span></h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Transaction Monitoring & Audit</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 rounded-xl gap-2">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
          <Badge className="bg-indigo-600 text-white border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">
            {bookings.length} Total Handshakes
          </Badge>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
            <input 
              placeholder="Search by Merchant, Node, or Commodity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-600 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
             <Button variant="ghost" size="sm" className="gap-2 text-slate-500 rounded-lg text-[10px] font-bold uppercase h-9 px-4 hover:bg-slate-100">
               <Filter className="h-3.5 w-3.5" /> Status
             </Button>
             <Button variant="ghost" size="sm" className="gap-2 text-slate-500 rounded-lg text-[10px] font-bold uppercase h-9 px-4 hover:bg-slate-100">
               <Calendar className="h-3.5 w-3.5" /> Date Range
             </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0f172a] text-white">
              <tr className="border-b border-slate-800">
                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Transaction Trace</th>
                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Merchant / Node</th>
                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Logistics Specs</th>
                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Temporal Status</th>
                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4"><div className="h-5 bg-slate-50 rounded-md w-full" /></td>
                  </tr>
                ))
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] italic">
                    No Matching Transactions Found in Ledger
                  </td>
                </tr>
              ) : filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">#{booking.id.slice(-8)}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3 text-indigo-600" />
                          <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{booking.client?.name || "MANUAL ENTRY"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-3 w-3 text-orange-500" />
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">{booking.warehouse?.name}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[9px] font-black uppercase px-2 py-0.5">
                        {booking.commodityType}
                      </Badge>
                      <div className="flex items-center gap-1 text-[11px] font-black text-slate-700 tracking-tighter">
                        <Weight className="h-3.5 w-3.5 text-slate-300" />
                        {booking.weight} MT
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest",
                      booking.status === 'APPROVED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                      booking.status === 'REJECTED' ? "bg-rose-50 text-rose-600 border-rose-100" :
                      "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      {booking.status === 'APPROVED' ? <CheckCircle2 className="h-3 w-3" /> : 
                       booking.status === 'REJECTED' ? <XCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      {booking.status === 'APPROVED' ? 'Network Valid' : 
                       booking.status === 'REJECTED' ? 'De-activated' : 'In Verification'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedBooking(booking)}
                      className="h-8 text-[10px] font-black uppercase tracking-widest border-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all gap-2"
                    >
                      <Eye className="h-3.5 w-3.5" /> Full Audit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminBookingDetailModal 
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onRefresh={fetchData}
      />
    </div>
  );
}

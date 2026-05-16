"use client";

import { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  User, 
  Warehouse, 
  Calendar, 
  Weight, 
  ClipboardList,
  Search,
  Filter,
  Download,
  ArrowLeft
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOwnerBookings } from "@/lib/actions/warehouse";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ApprovalReports() {
  const [approvedBookings, setApprovedBookings] = useState<any[]>([]);
  const [rejectedBookings, setRejectedBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const [approved, rejected] = await Promise.all([
      getOwnerBookings('APPROVED'),
      getOwnerBookings('REJECTED')
    ]);
    setApprovedBookings(approved);
    setRejectedBookings(rejected);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <div className="p-10 animate-pulse space-y-8"><div className="h-20 bg-slate-100 rounded-2xl" /><div className="h-96 bg-slate-50 rounded-3xl" /></div>;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/warehouse">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5 text-slate-400" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-xl font-black text-slate-900 tracking-tight italic">Approval <span className="text-slate-400 font-normal not-italic">Ledger</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Historical Transaction Audit</p>
          </div>
        </div>
        <Button variant="outline" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 rounded-xl gap-2 shadow-sm">
          <Download className="h-3.5 w-3.5" /> Export History
        </Button>
      </div>

      <Tabs defaultValue="approved" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <TabsTrigger value="approved" className="rounded-xl px-8 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600">
            Validated Handshakes
          </TabsTrigger>
          <TabsTrigger value="rejected" className="rounded-xl px-8 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-rose-600">
            Denied Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approved" className="space-y-4 outline-none">
          <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Validated Logistics Stream</h3>
          </div>
          <BookingTable data={approvedBookings} status="APPROVED" />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 outline-none">
          <div className="flex items-center gap-2 border-l-4 border-rose-500 pl-3">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Denied Request History</h3>
          </div>
          <BookingTable data={rejectedBookings} status="REJECTED" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BookingTable({ data, status }: { data: any[], status: string }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#0f172a] text-white">
            <tr className="border-b border-slate-800">
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Trace ID</th>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Merchant / Terminal</th>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Inventory Specs</th>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Handshake Date</th>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-right">Operational Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] italic">
                  No Historical Transactions Found in This Category
                </td>
              </tr>
            ) : data.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">#{b.id.slice(-8)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3 text-indigo-600" />
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{b.client?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Warehouse className="h-3 w-3 text-slate-300" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">{b.warehouse?.name}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5",
                      status === 'APPROVED' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
                    )}>
                      {b.commodityType}
                    </Badge>
                    <div className="flex items-center gap-1 text-[11px] font-black text-slate-700 tracking-tighter">
                      <Weight className="h-3.5 w-3.5 text-slate-300" />
                      {b.weight} MT
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <Calendar className="h-3.5 w-3.5" /> {new Date(b.createdAt).toLocaleDateString()}
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <Badge className={cn(
                     "font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg",
                     status === 'APPROVED' ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                   )}>
                     {status === 'APPROVED' ? 'ACCEPTED' : 'DENIED'}
                   </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
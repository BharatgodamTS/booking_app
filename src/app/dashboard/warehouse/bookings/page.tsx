"use client";

import { useEffect, useState } from "react";
import { 
  Download, 
  CheckCircle2, 
  XCircle, 
  UserPlus, 
  Package, 
  Calendar,
  Truck,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getBookingRequests, updateBookingStatus, createManualBooking } from "@/lib/actions/bookings";
import { getOwnerWarehouses } from "@/lib/actions/warehouse";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function BookingsHub() {
  const [requests, setRequests] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const [reqs, wrhs] = await Promise.all([
      getBookingRequests(),
      getOwnerWarehouses()
    ]);
    setRequests(reqs);
    setWarehouses(wrhs);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const result = await updateBookingStatus(id, status);
    if (result.success) {
      toast.success(`Booking ${status.toLowerCase()} successfully`);
      fetchData();
    } else {
      toast.error(result.error);
    }
  };

  const [manualForm, setManualForm] = useState({
    warehouseId: "",
    clientName: "",
    commodity: "",
    weight: "",
    startDate: "",
    endDate: ""
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await createManualBooking({
      ...manualForm,
      weight: parseFloat(manualForm.weight),
      startDate: new Date(manualForm.startDate),
      endDate: new Date(manualForm.endDate)
    });
    
    if (result.success) {
      toast.success("Manual booking recorded");
      setManualForm({ warehouseId: "", clientName: "", commodity: "", weight: "", startDate: "", endDate: "" });
      fetchData();
    } else {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  if (isLoading) return <div className="p-10 animate-pulse space-y-8"><div className="h-40 bg-slate-100 rounded-2xl" /><div className="h-96 bg-slate-50 rounded-3xl" /></div>;

  return (
    <div className="space-y-6 pb-12">
      <div className="space-y-0.5 border-b border-slate-200 pb-4">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">Booking Management</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inbound Logistics & Authorization</p>
      </div>

      {/* Part 1: Incoming Requests */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-orange-600" strokeWidth={1.5} />
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Platform Requests</h2>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Client</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Warehouse</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Commodity</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase">Weight</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[10px] font-medium text-slate-400 uppercase italic">No pending requests</td>
                </tr>
              ) : requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-900 text-sm">{req.client?.name || req.manualClientName}</td>
                  <td className="px-4 py-2.5 text-slate-500 text-xs">{req.warehouse.name}</td>
                  <td className="px-4 py-2.5 text-slate-500 text-xs">{req.commodityType}</td>
                  <td className="px-4 py-2.5 font-bold text-slate-900 text-sm">{req.weight} MT</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleAction(req.id, 'REJECTED')}
                        className="h-7 text-red-500 text-[10px] uppercase font-bold"
                      >
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleAction(req.id, 'APPROVED')}
                        className="h-7 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-bold px-4"
                      >
                        Approve
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Part 2: Manual Entry Form */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-indigo-600" strokeWidth={1.5} />
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Manual Walk-in Entry</h2>
        </div>

        <Card className="p-4 border border-slate-200 shadow-sm bg-white rounded-xl">
          <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Client Name</label>
              <div className="relative">
                <Truck className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                <input 
                  required
                  value={manualForm.clientName}
                  onChange={e => setManualForm({...manualForm, clientName: e.target.value})}
                  className="w-full h-8 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium outline-none"
                  placeholder="Client Name"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Facility</label>
              <select 
                required
                value={manualForm.warehouseId}
                onChange={e => setManualForm({...manualForm, warehouseId: e.target.value})}
                className="w-full h-8 px-2 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium outline-none"
              >
                <option value="">Select Warehouse</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name} ({w.availableCapacity} MT Free)</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Commodity</label>
              <div className="relative">
                <Package className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                <input 
                  required
                  value={manualForm.commodity}
                  onChange={e => setManualForm({...manualForm, commodity: e.target.value})}
                  className="w-full h-8 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium outline-none"
                  placeholder="Material Type"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Weight (MT)</label>
              <input 
                required
                type="number"
                step="0.01"
                value={manualForm.weight}
                onChange={e => setManualForm({...manualForm, weight: e.target.value})}
                className="w-full h-8 px-2 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium outline-none"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Start Date</label>
              <input 
                required
                type="date"
                value={manualForm.startDate}
                onChange={e => setManualForm({...manualForm, startDate: e.target.value})}
                className="w-full h-8 px-2 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">End Date</label>
              <input 
                required
                type="date"
                value={manualForm.endDate}
                onChange={e => setManualForm({...manualForm, endDate: e.target.value})}
                className="w-full h-8 px-2 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium outline-none"
              />
            </div>

            <div className="md:col-span-3 pt-3">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] uppercase tracking-widest shadow-sm"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Manual Entry"}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
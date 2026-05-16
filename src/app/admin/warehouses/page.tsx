"use client";

import { useEffect, useState } from "react";
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Eye,
  Maximize,
  FileText,
  Weight,
  Calendar,
  IndianRupee,
  Package,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { getPendingWarehouses, verifyWarehouse } from "@/lib/actions/admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminWarehouseApprovals() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getPendingWarehouses();
    setWarehouses(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    setIsProcessing(true);
    const result = await verifyWarehouse(id, action);
    if (result.success) {
      toast.success(`Facility successfully ${action.toLowerCase()}`);
      setSelectedWarehouse(null);
      fetchData();
    } else {
      toast.error(result.error);
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight italic">Facility <span className="text-slate-400 font-normal not-italic">Verification</span></h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Terminal Audit Queue</p>
        </div>
        <Badge className="bg-rose-600 text-white border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">
          {warehouses.length} Nodes Pending Audit
        </Badge>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#0f172a] text-white">
            <tr className="border-b border-slate-800">
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Logistics Terminal</th>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Operator ID</th>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Specifications</th>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Compliance</th>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-right">Operational Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-slate-50 rounded-md w-full" /></td>
                </tr>
              ))
            ) : warehouses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] italic">
                  No Pending Terminal Registrations Found
                </td>
              </tr>
            ) : warehouses.map((w) => (
              <tr key={w.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-colors group-hover:bg-rose-600">
                      <Building2 className="h-4.5 w-4.5 text-slate-400 group-hover:text-white" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none block">{w.name}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" /> {w.address}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-900 leading-none">{w.owner?.name}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase block tracking-widest">{w.owner?.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[8px] font-black uppercase">
                      {w.storageType || 'DRY'}
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[8px] font-black uppercase">
                      {w.totalCapacity} MT
                    </Badge>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {w.wdraStatus ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[8px] font-black uppercase tracking-widest">WDRA VERIFIED</Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-400 border-slate-100 text-[8px] font-black uppercase tracking-widest">WDRA N/A</Badge>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedWarehouse(w)}
                    className="h-8 text-[10px] font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50 gap-2"
                  >
                    <Eye className="h-3.5 w-3.5" /> Audit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedWarehouse} onOpenChange={() => setSelectedWarehouse(null)}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
          <div className="bg-[#0f172a] p-6 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="h-24 w-24" />
            </div>
            <DialogHeader className="relative z-10">
              <Badge className="w-fit bg-rose-600 text-white border-none font-black text-[9px] uppercase tracking-[0.2em] mb-4 italic">Security Verification Active</Badge>
              <DialogTitle className="text-xl font-black uppercase tracking-tight leading-none mb-1">Terminal Node Audit</DialogTitle>
              <DialogDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Verification ID: {selectedWarehouse?.id}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6 bg-white overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Facility Identity</p>
                <p className="text-[12px] font-black text-slate-900 uppercase leading-tight">{selectedWarehouse?.name}</p>
                <p className="text-[10px] font-bold text-slate-500 leading-tight">{selectedWarehouse?.address}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Net Tonnage</p>
                <p className="text-[16px] font-black text-rose-600 tracking-tighter leading-none">{selectedWarehouse?.totalCapacity} MT</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Maximum Storage Potential</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Technical Specifications</p>
              <div className="grid grid-cols-2 gap-y-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Maximize className="h-3 w-3" /> Area (SQFT)
                  </p>
                  <p className="text-[11px] font-black text-slate-800 uppercase">{selectedWarehouse?.area || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Package className="h-3 w-3" /> Storage Type
                  </p>
                  <p className="text-[11px] font-black text-slate-800 uppercase">{selectedWarehouse?.storageType || "DRY"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText className="h-3 w-3" /> GST Identifier
                  </p>
                  <p className="text-[11px] font-black text-rose-600 uppercase tracking-tighter">{selectedWarehouse?.gstNumber || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <IndianRupee className="h-3 w-3" /> Rate (₹/MT)
                  </p>
                  <p className="text-[11px] font-black text-slate-800 uppercase">₹{selectedWarehouse?.pricing}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Available From
                  </p>
                  <p className="text-[11px] font-black text-slate-800 uppercase">
                    {selectedWarehouse?.availableFrom ? new Date(selectedWarehouse.availableFrom).toLocaleDateString() : "Immediate"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <Button 
                onClick={() => handleAction(selectedWarehouse.id, 'REJECTED')}
                disabled={isProcessing}
                variant="outline" 
                className="flex-1 h-12 border-rose-200 text-rose-600 hover:bg-rose-50 font-black text-[10px] uppercase tracking-widest rounded-2xl"
              >
                Deny Node Activation
              </Button>
              <Button 
                onClick={() => handleAction(selectedWarehouse.id, 'APPROVED')}
                disabled={isProcessing}
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-100"
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authorize Node Access"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

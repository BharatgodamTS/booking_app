"use client";

import { useState } from "react";
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  User, 
  Building2, 
  Package, 
  Calendar, 
  Weight, 
  FileText,
  Printer,
  Ban,
  Clock,
  MapPin,
  Phone,
  Mail,
  Loader2
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminForceCancelBooking } from "@/lib/actions/admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AdminBookingDetailModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function AdminBookingDetailModal({ booking, isOpen, onClose, onRefresh }: AdminBookingDetailModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!booking) return null;

  const handleForceCancel = async () => {
    if (!confirm("Are you sure you want to FORCE CANCEL this booking? This action will restore warehouse capacity.")) return;
    
    setIsProcessing(true);
    const result = await adminForceCancelBooking(booking.id, "Administrative Override");
    if (result.success) {
      toast.success("Booking force-cancelled successfully");
      onRefresh();
      onClose();
    } else {
      toast.error(result.error);
    }
    setIsProcessing(false);
  };

  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
        <div className="bg-[#0f172a] p-6 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldAlert className="h-24 w-24" />
          </div>
          <DialogHeader className="relative z-10">
            <Badge className="w-fit bg-rose-600 text-white border-none font-black text-[9px] uppercase tracking-[0.2em] mb-4 italic">Administrative Override Active</Badge>
            <DialogTitle className="text-xl font-black uppercase tracking-tight leading-none mb-1">Transaction Master Audit</DialogTitle>
            <DialogDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Reference Node: {booking.id}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white max-h-[70vh] overflow-y-auto">
          {/* CLIENT DATA */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Merchant Profile</h3>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <div className="space-y-0.5">
                <p className="text-[11px] font-black text-slate-900 uppercase leading-none">{booking.client?.name || "MANUAL ENTRY"}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{booking.client?.businessType || "PRIVATE CLIENT"}</p>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <Mail className="h-3.5 w-3.5 text-slate-300" /> {booking.client?.email || "N/A"}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <Phone className="h-3.5 w-3.5 text-slate-300" /> {booking.client?.phone || booking.manualClientContact || "N/A"}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-slate-300" /> {booking.client?.city || "LOCATION UNKNOWN"}
                </div>
              </div>
            </div>
          </div>

          {/* WAREHOUSE DATA */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-orange-500 pl-3">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Terminal Node</h3>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <div className="space-y-0.5">
                <p className="text-[11px] font-black text-slate-900 uppercase leading-none">{booking.warehouse?.name}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Operator: {booking.warehouse?.owner?.name}</p>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <Building2 className="h-3.5 w-3.5 text-slate-300" /> GST: {booking.warehouse?.gstNumber || "PENDING"}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-slate-300" /> {booking.warehouse?.address}
                </div>
                <div className={cn(
                  "flex items-center gap-2 text-[9px] font-black uppercase tracking-widest",
                  booking.warehouse?.wdraStatus ? "text-emerald-600" : "text-slate-400"
                )}>
                  <ShieldCheck className="h-3.5 w-3.5" /> WDRA STATUS: {booking.warehouse?.wdraStatus ? "VERIFIED" : "UNREGISTERED"}
                </div>
              </div>
            </div>
          </div>

          {/* TRANSACTION SPECS */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Inventory Handshake</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 text-center">
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Commodity</p>
                <p className="text-[12px] font-black text-slate-900 uppercase">{booking.commodityType}</p>
              </div>
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 text-center">
                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Net Weight</p>
                <p className="text-[12px] font-black text-slate-900 uppercase">{booking.weight} MT</p>
              </div>
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50 text-center">
                <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-1">Duration</p>
                <p className="text-[12px] font-black text-slate-900 uppercase">{diffDays} Days</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Operational ID</p>
                <p className="text-[12px] font-black text-slate-900 uppercase">#{booking.id.slice(-6)}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 p-4 bg-slate-900 rounded-2xl flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-800 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Temporal Window</p>
                <p className="text-[11px] font-black uppercase tracking-tight">
                  {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge className={cn(
              "font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-full",
              booking.status === 'APPROVED' ? "bg-emerald-600" :
              booking.status === 'REJECTED' ? "bg-rose-600" : "bg-amber-600"
            )}>
              {booking.status === 'APPROVED' ? 'Network Validated' : 
               booking.status === 'REJECTED' ? 'De-activated' : 'In Review'}
            </Badge>
          </div>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <Button variant="outline" className="flex-1 h-11 border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-xl gap-2">
            <Printer className="h-4 w-4" /> Export Ledger PDF
          </Button>
          <Button 
            onClick={handleForceCancel}
            disabled={isProcessing || booking.status === 'REJECTED'}
            variant="destructive" 
            className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl gap-2 shadow-lg shadow-rose-900/20"
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />} Force De-activate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

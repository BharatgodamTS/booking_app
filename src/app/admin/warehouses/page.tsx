"use client";

import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Warehouse, 
  User, 
  MapPin, 
  Maximize, 
  CheckCircle2, 
  XCircle,
  Loader2,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getPendingWarehouses, verifyWarehouse } from "@/lib/actions/admin";

export default function AdminWarehouseVerification() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPending = async () => {
    setIsLoading(true);
    const data = await getPendingWarehouses();
    setWarehouses(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleVerify = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    setIsSubmitting(true);
    const res = await verifyWarehouse(id, action, action === 'REJECTED' ? rejectionReason : undefined);
    
    if (res.success) {
      toast.success(`Warehouse ${action.toLowerCase()} successfully`);
      setSelectedWarehouse(null);
      setRejectionReason("");
      fetchPending();
    } else {
      toast.error(res.error || "Action failed");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 p-8">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 uppercase tracking-widest">
          <ShieldCheck className="h-3 w-3" />
          Verification Queue
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Warehouse Approval</h1>
        <p className="text-slate-500">Review and verify new storage facility registrations before they go live.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          {[1, 2].map(i => <div key={i} className="h-32 w-full bg-slate-50 animate-pulse rounded-3xl" />)}
        </div>
      ) : warehouses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center">
          <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Queue is Clear!</h3>
          <p className="text-slate-400">No warehouses are currently pending verification.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {warehouses.map((w) => (
            <Card key={w.id} className="border-slate-100 shadow-sm overflow-hidden rounded-3xl">
              <CardContent className="p-0 flex flex-col md:flex-row">
                <div className="flex-1 p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                        <Warehouse className="h-6 w-6 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{w.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <User className="h-3 w-3" />
                          Owner: {w.owner?.name || "Unknown"}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-amber-50 text-amber-600 border-amber-100" variant="outline">PENDING REVIEW</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Location
                      </p>
                      <p className="text-sm text-slate-700 font-medium">{w.address}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Maximize className="h-3 w-3" /> Capacity
                      </p>
                      <p className="text-sm text-slate-700 font-medium">{w.totalCapacity} MT</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Loader2 className="h-3 w-3" /> Submitted
                      </p>
                      <p className="text-sm text-slate-700 font-medium">{new Date(w.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-8 border-t md:border-t-0 md:border-l border-slate-100 flex flex-row md:flex-col justify-center gap-4 min-w-[200px]">
                  <Button 
                    onClick={() => handleVerify(w.id, 'APPROVED')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 px-6 gap-2 flex-1 font-bold shadow-lg shadow-emerald-100"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => setSelectedWarehouse(w)}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-2xl h-12 px-6 gap-2 flex-1 font-bold"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rejection Dialog */}
      <Dialog open={!!selectedWarehouse} onOpenChange={() => setSelectedWarehouse(null)}>
        <DialogContent className="sm:max-w-md bg-white p-8 rounded-3xl border-none shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-slate-900">Reject Registration</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting <span className="font-bold text-slate-900">{selectedWarehouse?.name}</span>. The owner will see this feedback.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="h-3 w-3" /> Feedback Reason
              </label>
              <textarea 
                placeholder="e.g., Incomplete address, capacity mismatched with photos..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-rose-500/10 outline-none transition-all resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setSelectedWarehouse(null)} className="rounded-xl h-11 flex-1">Cancel</Button>
            <Button 
              disabled={!rejectionReason || isSubmitting}
              onClick={() => handleVerify(selectedWarehouse.id, 'REJECTED')}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-11 flex-1 font-bold"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

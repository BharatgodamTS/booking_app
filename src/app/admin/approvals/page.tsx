"use client";

import { useEffect, useState } from "react";
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  User as UserIcon,
  Building2,
  FileText,
  Clock,
  ExternalLink,
  ShieldCheck,
  Mail,
  Phone,
  MapPin
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
import { getPendingRegistrations, updateUserApprovalStatus } from "@/lib/actions/admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getPendingRegistrations();
    setPendingUsers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproval = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setIsProcessing(true);
    const result = await updateUserApprovalStatus(id, status);
    if (result.success) {
      toast.success(`User registration ${status.toLowerCase()} successfully`);
      setSelectedUser(null);
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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight italic">Participant <span className="text-slate-400 font-normal not-italic">Verification</span></h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrative Approval Queue</p>
        </div>
        <Badge className="bg-orange-600 text-white border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">
          {pendingUsers.length} Requests Pending
        </Badge>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#0f172a] text-white">
            <tr className="border-b border-slate-800">
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Participant Identity</th>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Network Role</th>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Contact Node</th>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Request Date</th>
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
            ) : pendingUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] italic">
                  Verification Queue is Currently Empty
                </td>
              </tr>
            ) : pendingUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-colors group-hover:bg-slate-800 group-hover:border-slate-800">
                      <UserIcon className="h-4 w-4 text-slate-400 group-hover:text-white" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none block">{user.name}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" /> {user.location || "Unspecified"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={cn(
                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5",
                    user.role === 'OWNER' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-orange-50 text-orange-600 border-orange-100"
                  )}>
                    {user.role === 'OWNER' ? "Warehouse Operator" : "Logistics Merchant"}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                      <Mail className="h-3 w-3 text-slate-300" /> {user.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                      <Phone className="h-3 w-3 text-slate-300" /> {user.phone || "No Mobile"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {new Date(user.createdAt).toLocaleDateString()} • {new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedUser(user)}
                    className="h-8 text-[10px] font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50 gap-2"
                  >
                    <Eye className="h-3.5 w-3.5" /> Audit Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAIL AUDIT MODAL */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
          <div className="bg-[#0f172a] p-6 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="h-24 w-24" />
            </div>
            <DialogHeader className="relative z-10">
              <Badge className="w-fit bg-orange-600 text-white border-none font-black text-[9px] uppercase tracking-[0.2em] mb-4 italic">Security Verification Active</Badge>
              <DialogTitle className="text-xl font-black uppercase tracking-tight leading-none mb-1">Participant Audit</DialogTitle>
              <DialogDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Verification ID: {selectedUser?.id}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6 bg-white">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Core Identity</p>
                <p className="text-[11px] font-black text-slate-900 uppercase leading-tight">{selectedUser?.name}</p>
                <p className="text-[10px] font-bold text-slate-500 leading-tight">{selectedUser?.email}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Role Designation</p>
                <p className="text-[11px] font-black text-indigo-600 uppercase">{selectedUser?.role}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Industrial Metadata</p>
              
              {selectedUser?.role === 'OWNER' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Company Entity</p>
                    <p className="text-[11px] font-black text-slate-800 uppercase">{selectedUser?.companyName || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Node Inventory</p>
                    <p className="text-[11px] font-black text-slate-800 uppercase">{selectedUser?.warehouseCount || 0} Facilities</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Business Type</p>
                    <p className="text-[11px] font-black text-slate-800 uppercase">{selectedUser?.businessType || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GST Identifier</p>
                    <p className="text-[11px] font-black text-indigo-600 uppercase tracking-tighter">{selectedUser?.gstNumber || "NOT PROVIDED"}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Merchant Location</p>
                    <p className="text-[11px] font-black text-slate-800 uppercase">{selectedUser?.city || selectedUser?.location || "N/A"}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                onClick={() => handleApproval(selectedUser.id, 'REJECTED')}
                disabled={isProcessing}
                variant="outline" 
                className="flex-1 h-11 border-red-200 text-red-600 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest rounded-xl"
              >
                Deny Node Access
              </Button>
              <Button 
                onClick={() => handleApproval(selectedUser.id, 'APPROVED')}
                disabled={isProcessing}
                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-100"
              >
                Authorize Participant
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

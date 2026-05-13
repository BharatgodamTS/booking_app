"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Home, 
  MapPin, 
  Maximize, 
  IndianRupee,
  ShieldCheck,
  Search,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { WarehouseForm } from "@/components/features/WarehouseForm";
import { getOwnerWarehouses } from "@/lib/actions/warehouse";
import { cn } from "@/lib/utils";

export default function WarehouseInventory() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getOwnerWarehouses();
    setWarehouses(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <div className="p-10 animate-pulse space-y-8"><div className="h-40 bg-slate-100 rounded-2xl" /><div className="h-96 bg-slate-50 rounded-3xl" /></div>;

  return (
    <div className="space-y-4 pb-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Inventory Master</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Storage Asset Management</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-4 rounded-lg gap-2 font-bold shadow-sm">
              <Plus strokeWidth={2} className="h-4 w-4" />
              Add Facility
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl bg-white p-6 rounded-xl border border-slate-200">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">New Asset Protocol</DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Register a new storage facility into the network.
              </DialogDescription>
            </DialogHeader>
            <WarehouseForm onSuccess={() => {
              setIsOpen(false);
              fetchData();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Assets ({warehouses.length})</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300" />
            <input 
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-medium outline-none w-48"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-100">
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase">Facility Details</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase">Utilization</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase">Rate</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {warehouses.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Home className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-900 leading-none">{w.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">{w.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-40 space-y-1.5">
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase">
                        <span className="text-slate-400">{w.availableCapacity} MT Free</span>
                        <span className="text-indigo-600">{Math.round((w.availableCapacity / w.totalCapacity) * 100)}%</span>
                      </div>
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600" 
                          style={{ width: `${(w.availableCapacity / w.totalCapacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-slate-900">₹{w.pricing}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">/ MT</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[9px] font-bold uppercase tracking-tight",
                      w.status === 'APPROVED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      <ShieldCheck className="h-3 w-3" />
                      {w.status === 'APPROVED' ? 'LIVE' : 'PENDING'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

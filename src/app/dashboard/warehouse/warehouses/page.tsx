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
  Pencil,
  Building2,
  Calendar,
  AlertCircle,
  Weight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import WarehouseForm from "@/components/features/WarehouseForm";
import { getOwnerWarehouses } from "@/lib/actions/warehouse";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function WarehouseInventory() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          <h1 className="text-xl font-black text-slate-900 tracking-tight italic">Facility <span className="text-slate-400 font-normal not-italic">Inventory</span></h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Storage Asset Lifecycle Management</p>
        </div>

        <WarehouseForm />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Operational Nodes ({warehouses.length})</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300" />
            <input 
              placeholder="Filter by Terminal Name..."
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-medium outline-none w-64 focus:border-indigo-600 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10 bg-[#0f172a] text-white">
              <tr className="border-b border-slate-800">
                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Terminal Node</th>
                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Storage Type</th>
                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Available / Total (MT)</th>
                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Utilization</th>
                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Rate (₹)</th>
                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {warehouses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] italic">
                    No Registered Operational Nodes Found
                  </td>
                </tr>
              ) : warehouses.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-colors group-hover:bg-indigo-600">
                        <Building2 className="h-4.5 w-4.5 text-slate-400 group-hover:text-white" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none">{w.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase truncate max-w-[150px] tracking-tighter flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5" /> {w.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                      {w.storageType || 'DRY STORAGE'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100">
                        <Weight className="h-3.5 w-3.5 text-indigo-600" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-black text-slate-900 tracking-tighter">{w.availableCapacity} / {w.totalCapacity}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Metric Tons (MT)</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32 space-y-1.5">
                      <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest">
                        <span className="text-indigo-600">{Math.round((w.availableCapacity / w.totalCapacity) * 100)}% VACANT</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-indigo-600 transition-all duration-500" 
                          style={{ width: `${(w.availableCapacity / w.totalCapacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-black text-slate-900 tracking-tighter">₹{w.pricing}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase">/ MT</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest",
                      w.status === 'APPROVED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                      w.status === 'REJECTED' ? "bg-red-50 text-red-600 border-red-100" :
                      "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      {w.status === 'APPROVED' ? <ShieldCheck className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      {w.status === 'APPROVED' ? 'LIVE' : w.status === 'REJECTED' ? 'REJECTED' : 'PENDING'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <WarehouseForm 
                      initialData={w} 
                      trigger={
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      } 
                    />
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

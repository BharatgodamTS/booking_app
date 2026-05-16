"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Truck, 
  User, 
  Package, 
  Maximize, 
  FileText, 
  Building2,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { recordStockMovement } from "@/lib/actions/logistics";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const schema = z.object({
  warehouseId: z.string().min(1),
  type: z.enum(['INBOUND', 'OUTBOUND']),
  commodity: z.string().min(2, "Commodity is required"),
  weight: z.coerce.number().min(0.1, "Minimum weight 0.1 MT"),
  truckNumber: z.string().min(4, "Truck Number is required"),
  driverName: z.string().min(3, "Driver Name is required"),
  biltyNumber: z.string().min(2, "Bilty/Receipt No. is required"),
  partyName: z.string().min(2, "Party Name is required"),
});

interface FormValues {
  warehouseId: string;
  type: 'INBOUND' | 'OUTBOUND';
  commodity: string;
  weight: number;
  truckNumber: string;
  driverName: string;
  biltyNumber: string;
  partyName: string;
}

export function StockMovementForm({ 
  warehouseId, 
  warehouses,
  onSuccess 
}: { 
  warehouseId?: string, 
  warehouses: any[],
  onSuccess: () => void 
}) {
  const [movementType, setMovementType] = useState<'INBOUND' | 'OUTBOUND'>('INBOUND');

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      warehouseId: warehouseId || warehouses[0]?.id,
      type: 'INBOUND'
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const result = await recordStockMovement({ ...data, type: movementType });
    if (result.success) {
      toast.success(`${movementType} Entry Recorded Successfully`);
      reset();
      onSuccess();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
      {/* Transaction Type Selector */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'INBOUND', label: 'Inbound Receipt', icon: ArrowDownLeft, color: 'emerald' },
          { id: 'OUTBOUND', label: 'Outbound Dispatch', icon: ArrowUpRight, color: 'rose' }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setMovementType(t.id as any)}
            className={cn(
              "flex items-center gap-4 p-6 rounded-[2rem] border transition-all duration-500 text-left relative overflow-hidden",
              movementType === t.id 
                ? `bg-${t.color}-600 border-${t.color}-600 text-white shadow-xl shadow-${t.color}-100` 
                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
            )}
          >
            <div className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
              movementType === t.id ? "bg-white/20" : "bg-slate-50"
            )}>
              <t.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Movement Type</p>
              <p className="text-sm font-black tracking-tight">{t.label}</p>
            </div>
            {movementType === t.id && (
              <motion.div layoutId="typeIndicator" className="absolute -right-4 -bottom-4 h-16 w-16 bg-white/10 rounded-full blur-xl" />
            )}
          </button>
        ))}
      </div>

      {/* Industrial Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Facility</label>
          <select 
            {...register("warehouseId")}
            className="w-full h-12 px-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          >
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>{w.name} - ({w.availableCapacity} MT Free)</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Commodity Type</label>
          <div className="relative">
            <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
            <input 
              {...register("commodity")}
              placeholder="e.g. Wheat Grains"
              className="w-full pl-12 pr-4 h-12 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Net Weight (MT)</label>
          <div className="relative">
            <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
            <input 
              {...register("weight")}
              type="number"
              step="0.01"
              placeholder="15.50"
              className="w-full pl-12 pr-4 h-12 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Truck Number</label>
          <div className="relative">
            <Truck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
            <input 
              {...register("truckNumber")}
              placeholder="MH 12 AB 1234"
              className="w-full pl-12 pr-4 h-12 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bilty / LR Number</label>
          <div className="relative">
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
            <input 
              {...register("biltyNumber")}
              placeholder="LR/2024/001"
              className="w-full pl-12 pr-4 h-12 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Driver Identity</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
            <input 
              {...register("driverName")}
              placeholder="Driver Full Name"
              className="w-full pl-12 pr-4 h-12 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Party / Client Name</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
            <input 
              {...register("partyName")}
              placeholder="Company or Client Name"
              className="w-full pl-12 pr-4 h-12 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className={cn(
          "w-full h-16 rounded-[1.5rem] font-black text-lg transition-all active:scale-[0.98] shadow-2xl",
          movementType === 'INBOUND' ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100" : "bg-rose-600 hover:bg-rose-700 shadow-rose-100"
        )}
      >
        {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : (
          <span className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6" />
            Execute {movementType} Entry
          </span>
        )}
      </Button>
    </form>
  );
}

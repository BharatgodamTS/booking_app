"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { 
  MoreVertical, 
  MapPin, 
  Maximize, 
  Box,
  ShieldCheck,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WarehouseTableProps {
  warehouses: any[];
}

export function WarehouseTable({ warehouses }: WarehouseTableProps) {
  if (warehouses.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center shadow-xl shadow-slate-200/50">
        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Box className="h-10 w-10 text-slate-200" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">No facilities found</h3>
        <p className="text-slate-400 max-w-sm mx-auto mb-8">You haven't registered any warehouses yet. Start by adding your first storage facility.</p>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-8 font-bold shadow-lg shadow-indigo-100">
          Get Started
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {warehouses.map((warehouse, index) => (
        <motion.div
          key={warehouse.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            {/* Facility Identity */}
            <div className="flex items-center gap-6 lg:min-w-[300px]">
              <div className="h-16 w-16 rounded-[1.25rem] bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200 group-hover:rotate-6 transition-transform duration-500">
                <Box className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{warehouse.name}</h3>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
                    Live
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400 font-bold">
                  <MapPin className="h-4 w-4 text-indigo-500" />
                  {warehouse.address}
                </div>
              </div>
            </div>

            {/* Capacity Engine */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Maximize className="h-3 w-3 text-indigo-500" />
                  Capacity Utilization
                </div>
                <span className="text-slate-900 font-black">{Math.round(((warehouse.totalCapacity - warehouse.availableCapacity) / warehouse.totalCapacity) * 100)}% Used</span>
              </div>
              <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((warehouse.totalCapacity - warehouse.availableCapacity) / warehouse.totalCapacity) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-400">{warehouse.availableCapacity.toLocaleString()} MT available</span>
                <span className="text-slate-900">Total: {warehouse.totalCapacity.toLocaleString()} MT</span>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex items-center justify-between lg:justify-end gap-10 border-t lg:border-none pt-6 lg:pt-0 border-slate-50">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pricing / MT</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{warehouse.pricing.toLocaleString()}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button className="bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 h-14 w-14 rounded-2xl border border-slate-100 transition-all group/btn">
                  <MoreVertical className="h-5 w-5" />
                </Button>
                <Button className="bg-slate-950 hover:bg-slate-900 text-white h-14 px-6 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all group/btn">
                  Manage <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

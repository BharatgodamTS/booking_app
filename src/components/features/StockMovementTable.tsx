"use client";

import { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Truck, 
  FileText, 
  Search,
  Filter,
  Download,
  Calendar,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface StockMovementTableProps {
  movements: any[];
}

export function StockMovementTable({ movements }: StockMovementTableProps) {
  const [filter, setFilter] = useState<'ALL' | 'INBOUND' | 'OUTBOUND'>('ALL');

  const filteredMovements = movements.filter(m => 
    filter === 'ALL' ? true : m.type === filter
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
      {/* Table Controls */}
      <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-xl w-fit">
          {['ALL', 'INBOUND', 'OUTBOUND'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={cn(
                "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                filter === t ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
            <input 
              placeholder="Search Truck / Bilty..."
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/10 outline-none w-64"
            />
          </div>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl">
            <Filter className="h-4 w-4 text-slate-400" />
          </Button>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl">
            <Download className="h-4 w-4 text-slate-400" />
          </Button>
        </div>
      </div>

      {/* Industrial Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Documentation</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics Details</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Commodity</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Net Weight</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {filteredMovements.map((m, i) => (
                <motion.tr 
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center",
                        m.type === 'INBOUND' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        {m.type === 'INBOUND' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                      </div>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", m.type === 'INBOUND' ? "text-emerald-600" : "text-rose-600")}>
                        {m.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900 leading-none">#{m.biltyNumber}</p>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        <FileText className="h-3 w-3" />
                        Bilty Receipt
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Truck className="h-3.5 w-3.5 text-indigo-500" />
                        <p className="text-sm font-black text-slate-900 tracking-tight">{m.truckNumber}</p>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.driverName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="outline" className="bg-white border-slate-100 text-slate-600 font-bold px-3 py-1 rounded-lg">
                      {m.commodity}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="space-y-1">
                      <p className="text-lg font-black text-slate-900 tracking-tighter">{m.weight} <span className="text-xs text-slate-400 font-bold uppercase">MT</span></p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(m.timestamp).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4 text-slate-400" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {filteredMovements.length === 0 && (
        <div className="p-20 text-center space-y-6">
          <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto border-2 border-dashed border-slate-100">
            <Calendar className="h-8 w-8 text-slate-200" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">No Activity Logged</h3>
            <p className="text-xs text-slate-400 font-bold">Start by recording an inbound or outbound shipment.</p>
          </div>
        </div>
      )}
    </div>
  );
}

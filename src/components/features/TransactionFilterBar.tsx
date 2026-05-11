"use client";

import { Search, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TransactionFilterBar() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="w-full md:w-64 space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client</label>
        <div className="relative group">
          <select className="w-full h-10 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold appearance-none outline-none focus:ring-2 focus:ring-orange-500/20 transition-all">
            <option>All Clients</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="w-full md:w-64 space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Warehouse</label>
        <div className="relative group">
          <select className="w-full h-10 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold appearance-none outline-none focus:ring-2 focus:ring-orange-500/20 transition-all">
            <option>All Warehouses</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="w-full md:flex-1 space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Search</label>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input 
            placeholder="Search transactions..."
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-end self-end h-10">
        <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-[11px] font-black uppercase tracking-widest h-10 px-6 rounded-lg gap-2 shadow-sm">
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}

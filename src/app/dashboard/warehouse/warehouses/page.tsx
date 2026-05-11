"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Sparkles,
  Loader2,
  LayoutGrid,
  List
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
import { WarehouseTiltCard } from "@/components/shared/WarehouseTiltCard";
import { getOwnerWarehouses } from "@/lib/actions/warehouse";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function WarehousesManagementPage() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchWarehouses = async () => {
    setIsLoading(true);
    const data = await getOwnerWarehouses();
    setWarehouses(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <div className="space-y-12 pb-20">
      {/* Bespoke Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-brand-charcoal/5 pb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-brand-orange">
            <div className="h-px w-8 bg-brand-orange" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node Management</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl font-serif font-black tracking-tighter text-brand-charcoal leading-none">
              Facility <span className="italic text-brand-orange">Directory</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-lg">
              Coordinate your storage network through a bespoke management layer. Monitor availability, pricing, and operational status in real-time.
            </p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-charcoal hover:bg-brand-charcoal/90 text-white h-16 px-10 rounded-[1.5rem] gap-3 font-bold shadow-2xl shadow-brand-charcoal/30 group transition-all duration-500 hover:scale-105">
              <Plus strokeWidth={2.5} className="h-5 w-5 group-hover:rotate-90 transition-transform" />
              Register New Node
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl bg-brand-cream border border-brand-charcoal/5 p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] rounded-[3rem] overflow-y-auto max-h-[90vh]">
            <DialogHeader className="mb-10 text-left">
              <div className="h-14 w-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-6">
                <Sparkles strokeWidth={1.5} className="h-7 w-7 text-brand-orange" />
              </div>
              <DialogTitle className="text-4xl font-serif font-black text-brand-charcoal tracking-tighter">New Node <span className="italic text-brand-orange">Protocol</span></DialogTitle>
              <DialogDescription className="text-slate-500 font-medium text-lg mt-2">
                Initialize a new storage facility into the elite BharatGodam network.
              </DialogDescription>
            </DialogHeader>
            <WarehouseForm onSuccess={() => {
              setIsDialogOpen(false);
              fetchWarehouses();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Bespoke Hub Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative w-full md:w-[450px] group">
          <Search strokeWidth={1.5} className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-hover:text-brand-orange transition-colors" />
          <input 
            placeholder="Search by strategic location or node name..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-medium focus:ring-4 focus:ring-brand-orange/5 focus:border-brand-orange/20 outline-none transition-all shadow-ambient"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="h-12 px-6 rounded-2xl gap-2 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-brand-charcoal hover:bg-white transition-all border border-transparent hover:border-slate-100">
            <Filter strokeWidth={1.5} className="h-4 w-4" /> Refine View
          </Button>
          <div className="flex items-center bg-white p-1.5 rounded-2xl shadow-ambient border border-slate-50">
            <button className="p-2.5 bg-brand-charcoal text-white rounded-[0.8rem] shadow-xl shadow-brand-charcoal/20 transition-all active:scale-95">
              <LayoutGrid strokeWidth={1.5} className="h-4 w-4" />
            </button>
            <button className="p-2.5 text-slate-400 hover:text-brand-charcoal transition-all">
              <List strokeWidth={1.5} className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bento-style Card Grid */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] w-full bg-white animate-pulse rounded-[2.5rem] border border-slate-100" />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {warehouses.map((w, i) => (
              <WarehouseTiltCard key={w.id} warehouse={w} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

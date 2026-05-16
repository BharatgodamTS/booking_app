"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Maximize, 
  Loader2,
  Calendar,
  Package,
  Truck,
  ArrowRight,
  ShieldCheck,
  Building2,
  ArrowLeft,
  CheckCircle2,
  Info,
  Radar,
  ArrowUpRight,
  ChevronRight
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
import { searchWarehouses, submitClientRequest } from "@/lib/actions/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function BookWarehousePage() {
  const [formData, setFormData] = useState({
    location: "",
    commodity: "",
    weight: "",
    startDate: "",
    endDate: ""
  });
  
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Step 2: Discovery Logic (The Scan)
  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Numeric conversion of weight requirement
    const weightNum = Number(formData.weight);
    
    // Console.log debugging script for search parameters
    console.log("🚀 [FRONTEND-SCAN-INIT]", {
      location: formData.location || "UNSPECIFIED",
      commodity: formData.commodity,
      weight: weightNum,
      operationalWindow: `${formData.startDate} to ${formData.endDate}`
    });

    setIsScanning(true);
    setHasScanned(false);
    
    // 1.5-second professional "Scanning" simulation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const results = await searchWarehouses(formData.location, weightNum);
      console.log(`✅ [SCAN-COMPLETE] Discovered ${results.length} Valid Nodes`);
      setWarehouses(results);
    } catch (error) {
      console.error("❌ [SCAN-FATAL-ERROR]", error);
      toast.error("Network synchronization failed.");
    } finally {
      setIsScanning(false);
      setHasScanned(true);
    }
  };

  // Step 4: The Handshake (Booking Request)
  const handleConfirmBooking = async () => {
    if (!selectedWarehouse) return;
    
    setIsSubmitting(true);
    const result = await submitClientRequest({
      warehouseId: selectedWarehouse.id,
      commodityType: formData.commodity,
      weight: parseFloat(formData.weight),
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate)
    });

    if (result.success) {
      toast.success("Logistics request transmitted to node owner");
      router.push("/dashboard/client/history");
    } else {
      toast.error(result.error || "Acquisition verification failed");
    }
    setIsSubmitting(false);
    setSelectedWarehouse(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header Area */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight italic">Scan <span className="text-slate-400 font-normal not-italic">Logistics Network</span></h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Terminal Acquisition Protocol</p>
        </div>
      </div>

      {/* STEP 1: LOGISTICS REQUIREMENTS FORM */}
      <Card className="p-6 border border-slate-200 shadow-xl rounded-2xl bg-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
          <Radar className="h-40 w-40 text-slate-900" />
        </div>
        
        <form onSubmit={handleScan} className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="h-3 w-3 text-orange-500" /> Target Location
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                <input 
                  required
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold uppercase outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all"
                  placeholder="CITY / STATE / CODE"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Truck className="h-3 w-3 text-orange-500" /> Commodity ID
              </label>
              <input 
                required
                value={formData.commodity}
                onChange={e => setFormData({...formData, commodity: e.target.value})}
                className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold uppercase outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all"
                placeholder="e.g. COAL, WHEAT"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Maximize className="h-3 w-3 text-orange-500" /> Net Tonnage (MT)
              </label>
              <input 
                required
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={e => setFormData({...formData, weight: e.target.value})}
                className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold uppercase outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all"
                placeholder="0.00 MT"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-3 w-3 text-orange-500" /> Operational Window
              </label>
              <div className="flex items-center gap-2">
                <input 
                  required
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full h-10 px-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:border-orange-500 transition-all"
                />
                <ArrowRight className="h-3 w-3 text-slate-300 shrink-0" />
                <input 
                  required
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                  className="w-full h-10 px-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:border-orange-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={isScanning}
              className="w-full md:w-auto h-12 px-10 bg-[#0f172a] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 group"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing Capacity Nodes...
                </>
              ) : (
                <>
                  <Radar className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Scan Logistics Network
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* STEP 3: DISCOVERY RESULTS REVEAL */}
      <AnimatePresence>
        {hasScanned && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 border-l-4 border-orange-500 pl-4 py-1">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Available Logistics Nodes Found</h2>
              <Badge className="bg-orange-600 text-white border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5">
                {warehouses.length} Nodes Online
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {warehouses.length === 0 ? (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-white/50">
                  <Building2 className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No Nodes Found Matching Specification</p>
                </div>
              ) : warehouses.map((w, i) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card 
                    onClick={() => setSelectedWarehouse(w)}
                    className="group cursor-pointer border border-slate-200 hover:border-orange-500 hover:shadow-2xl transition-all rounded-2xl overflow-hidden bg-white relative"
                  >
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-[#0f172a] group-hover:border-[#0f172a] transition-all">
                          <Building2 className="h-5 w-5 text-slate-400 group-hover:text-white" />
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[9px] font-black">
                          {w.availableCapacity.toLocaleString()} MT FREE
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight line-clamp-1 group-hover:text-orange-600 transition-colors">{w.name}</h3>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          <MapPin className="h-3 w-3" /> {w.address}
                        </div>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                        <div className="text-[10px] font-black text-slate-900 tracking-tighter">
                          ₹{w.pricing.toLocaleString()} <span className="text-[8px] font-bold text-slate-400 uppercase">/ MT</span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] font-black text-orange-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                          Review Node <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION DIALOG / SIDE DRAWER */}
      <Dialog open={!!selectedWarehouse} onOpenChange={() => setSelectedWarehouse(null)}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
          <div className="bg-[#0f172a] p-6 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="h-24 w-24" />
            </div>
            <DialogHeader className="relative z-10">
              <Badge className="w-fit bg-orange-600 text-white border-none font-black text-[9px] uppercase tracking-[0.2em] mb-4">Contract Authorization</Badge>
              <DialogTitle className="text-xl font-black uppercase tracking-tight leading-none mb-1">Review & Book Space</DialogTitle>
              <DialogDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Facility Terminal: {selectedWarehouse?.name}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6 bg-white">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Material Identification</p>
                <div className="flex items-center gap-2">
                  <Package className="h-3.5 w-3.5 text-indigo-600" />
                  <p className="text-[11px] font-black text-slate-900 uppercase">{formData.commodity}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Net Tonnage</p>
                <div className="flex items-center gap-2">
                  <Maximize className="h-3.5 w-3.5 text-indigo-600" />
                  <p className="text-[11px] font-black text-slate-900 uppercase">{formData.weight} MT</p>
                </div>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Operational Lifecycle</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">
                    {formData.startDate} <ArrowRight className="h-2.5 w-2.5 inline mx-1" /> {formData.endDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Estimated Value</p>
                <p className="text-lg font-black text-slate-900 tracking-tighter">
                  ₹{((parseFloat(formData.weight) || 0) * (selectedWarehouse?.pricing || 0)).toLocaleString()}
                </p>
              </div>
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <ArrowUpRight className="h-5 w-5 text-indigo-600" />
              </div>
            </div>

            <div className="pt-2">
              <Button 
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-orange-900/20 group"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    Confirm & Send Request <ShieldCheck className="h-4 w-4" />
                  </div>
                )}
              </Button>
              <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4 italic">
                Request subject to node owner authorization within 24 operational hours.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  Maximize, 
  Weight, 
  IndianRupee, 
  Calendar,
  Package,
  ShieldCheck,
  FileText,
  ImageIcon,
  Loader2,
  AlertCircle,
  Plus,
  X,
  Info
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { createWarehouse, updateWarehouse } from "@/lib/actions/warehouse";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WarehouseFormProps {
  initialData?: any;
  trigger?: React.ReactNode;
}

export default function WarehouseForm({ initialData, trigger }: WarehouseFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    address: initialData?.address || "",
    totalCapacity: initialData?.totalCapacity || "",
    availableCapacity: initialData?.availableCapacity || "",
    pricing: initialData?.pricing || "",
    storageType: initialData?.storageType || "Dry",
    availableFrom: initialData?.availableFrom ? new Date(initialData.availableFrom).toISOString().split('T')[0] : "",
    materialsAllowed: initialData?.materialsAllowed || "",
    wdraStatus: initialData?.wdraStatus || false,
    gstNumber: initialData?.gstNumber || "",
    features: initialData?.features || []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🛡️ CAPACITY VALIDATION LOGIC
    const totalCapNum = parseFloat(formData.totalCapacity.toString());
    const availCapNum = parseFloat(formData.availableCapacity.toString());
    
    if (availCapNum > totalCapNum) {
      toast.error("Available capacity cannot exceed total capacity.");
      return;
    }

    setIsLoading(true);

    const payload = {
      ...formData,
      totalCapacity: totalCapNum,
      availableCapacity: availCapNum,
      pricing: parseFloat(formData.pricing.toString()),
      area: 0, // Legacy area support reset
    };

    const result = isEdit 
      ? await updateWarehouse(initialData.id, payload as any)
      : await createWarehouse(payload as any);

    if (result.success) {
      toast.success(isEdit ? "Facility metrics synchronized" : "Tonnage specifications transmitted to Admin");
      setIsOpen(false);
      if (!isEdit) setFormData({
        name: "", address: "", totalCapacity: "", availableCapacity: "", pricing: "",
        storageType: "Dry", availableFrom: "", materialsAllowed: "",
        wdraStatus: false, gstNumber: "", features: []
      });
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#0f172a] hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest h-9 px-6 rounded-xl gap-2 shadow-lg shadow-slate-900/20">
            <Plus className="h-3.5 w-3.5" /> Register New Facility
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
        <div className="bg-[#0f172a] p-6 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Weight className="h-24 w-24" />
          </div>
          <DialogHeader className="relative z-10">
            <Badge className="w-fit bg-orange-600 text-white border-none font-black text-[9px] uppercase tracking-[0.2em] mb-4 italic">Facility Metrics Alignment</Badge>
            <DialogTitle className="text-xl font-black uppercase tracking-tight leading-none mb-1">
              {isEdit ? "Synchronize Tonnage Records" : "Register Capacity Node"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Prioritizing Weight-Based Operational Limits (Metric Tons)
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white max-h-[70vh] overflow-y-auto">
          {/* Section 1: Core Identity & Capacity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Capacity Specifications</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Facility Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                  <input name="name" required value={formData.name} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-600 transition-all" placeholder="e.g. BHARAT TERMINAL A1" />
                </div>
              </div>
              
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                  <input name="address" required value={formData.address} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-600 transition-all" placeholder="CITY, STATE" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Capacity (MT)</label>
                <div className="relative">
                  <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                  <input name="totalCapacity" type="number" step="0.01" required value={formData.totalCapacity} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-600 transition-all" placeholder="e.g. 5000" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Available Capacity (MT)</label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                  <input name="availableCapacity" type="number" step="0.01" required value={formData.availableCapacity} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-600 transition-all" placeholder="e.g. 1200" />
                </div>
              </div>

              <div className="md:col-span-2 flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <Info className="h-3 w-3 text-slate-400" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">All measurements are in Metric Tons (MT). Available capacity represents vacant space.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Storage Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-orange-500 pl-3">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Storage & Logistics</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Terminal Type</label>
                <select name="storageType" value={formData.storageType} onChange={handleChange} className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase outline-none focus:border-orange-500">
                  <option value="Dry">Dry Storage</option>
                  <option value="Cold Storage">Cold Storage</option>
                  <option value="Bonded">Bonded Warehouse</option>
                  <option value="Open">Open Yard</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Operational Pricing (₹ / MT)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                  <input name="pricing" type="number" required value={formData.pricing} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Available From</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                  <input name="availableFrom" type="date" required value={formData.availableFrom} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Materials Allowed</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                  <input name="materialsAllowed" required value={formData.materialsAllowed} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all" placeholder="e.g. GRAINS, STEEL, CHEMICALS" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Compliance & Legal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Compliance & Certification</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GST Identification Number</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                  <input name="gstNumber" required value={formData.gstNumber} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase outline-none focus:border-emerald-600 transition-all" placeholder="22AAAAA0000A1Z5" />
                </div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">WDRA Registration</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Registered with WDRA Authority</p>
                </div>
                <Switch 
                  checked={formData.wdraStatus}
                  onCheckedChange={(checked) => setFormData({...formData, wdraStatus: checked})}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-900/20 group transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  {isEdit ? "Update Tonnage Node" : "Transmit Capacity Request"} <ShieldCheck className="h-4 w-4" />
                </div>
              )}
            </Button>
            {isEdit && (
              <div className="flex items-center gap-2 justify-center bg-orange-50 p-2 rounded-lg">
                <AlertCircle className="h-3.5 w-3.5 text-orange-600" />
                <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">Edit will trigger a mandatory Admin re-verification gate</p>
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

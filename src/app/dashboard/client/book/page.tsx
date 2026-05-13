"use client";

import { useEffect, useState } from "react";
import { 
  Search, 
  MapPin, 
  IndianRupee, 
  Maximize, 
  Plus, 
  Loader2,
  Calendar,
  Package,
  Truck
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { searchWarehouses, submitClientRequest } from "@/lib/actions/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function BookWarehousePage() {
  const [query, setQuery] = useState("");
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const fetchWarehouses = async (q: string) => {
    setIsLoading(true);
    const data = await searchWarehouses(q);
    setWarehouses(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWarehouses("");
  }, []);

  const [formData, setFormData] = useState({
    commodity: "",
    weight: "",
    startDate: "",
    endDate: ""
  });

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast.success("Logistics request submitted for owner approval");
      router.push("/dashboard/client/history");
    } else {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Marketplace Search</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Discover verified storage facilities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Search and Results */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                fetchWarehouses(e.target.value);
              }}
              placeholder="Search by facility name or location..."
              className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              [1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-50 animate-pulse rounded-xl" />)
            ) : warehouses.length === 0 ? (
              <div className="p-10 text-center border border-dashed border-slate-200 rounded-xl">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No facilities found matching your criteria</p>
              </div>
            ) : warehouses.map(w => (
              <Card 
                key={w.id} 
                onClick={() => setSelectedWarehouse(w)}
                className={cn(
                  "p-4 cursor-pointer transition-all border-l-4 rounded-xl",
                  selectedWarehouse?.id === w.id ? "border-l-indigo-600 bg-indigo-50/10 shadow-md" : "border-l-transparent hover:bg-slate-50"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 leading-none">{w.name}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                      <MapPin className="h-3 w-3" />
                      {w.address}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-indigo-600">₹{w.pricing} / MT</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{w.availableCapacity} MT Free</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Side: Booking Form */}
        <div className="lg:col-span-5">
          <Card className="p-6 border border-slate-200 shadow-sm rounded-xl bg-white sticky top-6">
            {!selectedWarehouse ? (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-slate-300" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[180px]">
                  Select a facility from the marketplace to begin authorization
                </p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="border-b border-slate-50 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase">Acquisition Protocol</h3>
                  <p className="text-[9px] font-medium text-slate-400 mt-0.5">Facility: {selectedWarehouse.name}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Material Type</label>
                  <div className="relative">
                    <Package className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                    <input 
                      required
                      value={formData.commodity}
                      onChange={e => setFormData({...formData, commodity: e.target.value})}
                      className="w-full h-9 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none"
                      placeholder="e.g. Wheat, Steel, Fabric"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Weight (MT)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    max={selectedWarehouse.availableCapacity}
                    value={formData.weight}
                    onChange={e => setFormData({...formData, weight: e.target.value})}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none"
                    placeholder={`Max ${selectedWarehouse.availableCapacity} MT`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Start Date</label>
                    <input 
                      required
                      type="date"
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                      className="w-full h-9 px-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-medium outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">End Date</label>
                    <input 
                      required
                      type="date"
                      value={formData.endDate}
                      onChange={e => setFormData({...formData, endDate: e.target.value})}
                      className="w-full h-9 px-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-widest rounded-lg shadow-sm"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request Verification"}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

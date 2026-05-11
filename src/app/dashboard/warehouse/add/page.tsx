'use client';

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createWarehouse } from "@/lib/actions/warehouse";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Warehouse as WarehouseIcon, 
  MapPin, 
  Maximize, 
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  ClipboardList
} from "lucide-react";

// Client-side validation schema
const warehouseSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  address: z.string().min(10, "Full address is required"),
  totalCapacity: z.coerce.number().min(1, "Total capacity must be positive"),
  availableCapacity: z.coerce.number().min(0),
  pricing: z.coerce.number().min(0, "Pricing is required"),
  features: z.array(z.string()).min(1, "Select at least one feature"),
}).refine((data) => data.availableCapacity <= data.totalCapacity, {
  message: "Available capacity cannot exceed total capacity",
  path: ["availableCapacity"],
});

type WarehouseFormValues = z.infer<typeof warehouseSchema>;

export default function WarehouseManagementPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      features: [],
    }
  });

  const selectedFeatures = watch("features");

  const toggleFeature = (feature: string) => {
    const current = selectedFeatures;
    if (current.includes(feature)) {
      setValue("features", current.filter(f => f !== feature));
    } else {
      setValue("features", [...current, feature]);
    }
  };

  const onSubmit = async (data: WarehouseFormValues) => {
    try {
      const result = await createWarehouse(data);
      if (result.success) {
        toast.success("Warehouse registered successfully!");
        reset();
      } else {
        toast.error(result.error || "Failed to register warehouse");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Warehouse Management</h1>
        <p className="text-slate-500">Register and manage your storage facilities in one place.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Top Section: Registration Form */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Plus className="h-5 w-5 text-indigo-600" />
              Register New Warehouse
            </CardTitle>
            <CardDescription>Enter the technical and pricing details of your storage facility.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Warehouse Name</label>
                  <div className="relative">
                    <WarehouseIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      {...register("name")}
                      placeholder="e.g. Central Metro Storage"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>}
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Pricing (per month)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      {...register("pricing")}
                      type="number"
                      placeholder="5000"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  {errors.pricing && <p className="text-xs text-rose-500 font-medium">{errors.pricing.message}</p>}
                </div>

                {/* Address - Full width */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Full Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <textarea
                      {...register("address")}
                      rows={3}
                      placeholder="Detailed location including city, state, and pin code"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                    />
                  </div>
                  {errors.address && <p className="text-xs text-rose-500 font-medium">{errors.address.message}</p>}
                </div>

                {/* Total Capacity */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Total Capacity (sq. ft.)</label>
                  <div className="relative">
                    <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      {...register("totalCapacity")}
                      type="number"
                      placeholder="10000"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  {errors.totalCapacity && <p className="text-xs text-rose-500 font-medium">{errors.totalCapacity.message}</p>}
                </div>

                {/* Available Capacity */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Currently Available</label>
                  <div className="relative">
                    <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      {...register("availableCapacity")}
                      type="number"
                      placeholder="10000"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  {errors.availableCapacity && <p className="text-xs text-rose-500 font-medium">{errors.availableCapacity.message}</p>}
                </div>

                {/* Features Multi-select */}
                <div className="space-y-3 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Available Features</label>
                  <div className="flex flex-wrap gap-2">
                    {["Cold Storage", "CCTV", "24/7 Access", "Loading Dock", "Fire Safety"].map((feature) => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => toggleFeature(feature)}
                        className={cn(
                          "px-4 py-2 rounded-full text-xs font-medium border transition-all",
                          selectedFeatures.includes(feature)
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                            : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                        )}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                  {errors.features && <p className="text-xs text-rose-500 font-medium">{errors.features.message}</p>}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 px-8"
                >
                  {isSubmitting ? "Registering..." : "Add Warehouse"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Bottom Section: Inventory List */}
        <WarehouseList />
      </div>
    </div>
  );
}

// Helper component for the table
function WarehouseList() {
  // In a real app, this would be a server component or use SWR/React Query
  // For this demonstration, we'll assume it's integrated or use a placeholder
  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50/50">
        <CardTitle className="text-xl flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-slate-600" />
          Your Warehouse Inventory
        </CardTitle>
        <CardDescription>Overview of all storage facilities registered under your account.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-y border-slate-100 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3">Warehouse Details</th>
                <th className="px-6 py-3">Capacity (Avail / Total)</th>
                <th className="px-6 py-3">Pricing</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">Metro Hub A1</div>
                  <div className="text-xs text-slate-500 truncate max-w-[200px]">Sector 62, Noida, UP - 201301</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full w-[70%]" />
                    </div>
                    <span className="text-xs font-medium text-slate-700">7,000 / 10,000</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">₹8,500/mo</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Active
                  </span>
                </td>
              </tr>
              {/* Empty state placeholder if no data */}
              <tr className="h-32 text-center text-slate-400">
                <td colSpan={4}>Loading your inventory...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
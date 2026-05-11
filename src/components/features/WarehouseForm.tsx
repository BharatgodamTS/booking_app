"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { createWarehouse } from "@/lib/actions/warehouse";
import { Button } from "@/components/ui/button";
import { 
  Warehouse as WarehouseIcon, 
  MapPin, 
  Maximize, 
  IndianRupee,
  Shield,
  Snowflake,
  Clock,
  Loader2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

export function WarehouseForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
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

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ["name", "address", "pricing"];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data: WarehouseFormValues) => {
    setError(null);
    try {
      const result = await createWarehouse(data);
      if (result.success) {
        toast.success("Warehouse registered successfully!");
        reset();
        onSuccess();
      } else {
        setError(result.error || "Failed to register warehouse");
        toast.error(result.error || "Submission failed");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      toast.error("Critical error during submission");
    }
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="relative">
      {/* Stepper Progress */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500",
              step === s ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110" : 
              step > s ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
            )}>
              {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
            </div>
            {s === 1 && <div className={cn("h-1 w-12 rounded-full transition-all duration-500", step > 1 ? "bg-emerald-500" : "bg-slate-100")} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facility Name</label>
                  <motion.div variants={shakeVariants} animate={errors.name ? "shake" : ""}>
                    <div className="relative">
                      <WarehouseIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <input
                        {...register("name")}
                        placeholder="e.g. Central Silo A1"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </motion.div>
                  {errors.name && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing (MT / Month)</label>
                  <motion.div variants={shakeVariants} animate={errors.pricing ? "shake" : ""}>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <input
                        {...register("pricing")}
                        type="number"
                        placeholder="1500"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </motion.div>
                  {errors.pricing && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.pricing.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Location</label>
                  <motion.div variants={shakeVariants} animate={errors.address ? "shake" : ""}>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-300" />
                      <textarea
                        {...register("address")}
                        rows={3}
                        placeholder="Complete facility address..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium resize-none"
                      />
                    </div>
                  </motion.div>
                  {errors.address && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.address.message}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Weight Capacity (MT)</label>
                  <div className="relative">
                    <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input
                      {...register("totalCapacity")}
                      type="number"
                      placeholder="1000"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Availability (MT)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input
                      {...register("availableCapacity")}
                      type="number"
                      placeholder="1000"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Features</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: "CCTV", icon: Shield, label: "24/7 Monitoring", desc: "Full CCTV coverage" },
                    { id: "Cold Storage", icon: Snowflake, label: "Cold Chain", desc: "Climate controlled" },
                    { id: "24/7 Access", icon: Clock, label: "Unlimited Access", desc: "Night operations supported" },
                  ].map((feature) => {
                    const isSelected = selectedFeatures.includes(feature.id);
                    return (
                      <button
                        key={feature.id}
                        type="button"
                        onClick={() => toggleFeature(feature.id)}
                        className={cn(
                          "flex flex-1 min-w-[180px] items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left group",
                          isSelected
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100"
                            : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30"
                        )}
                      >
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                          isSelected ? "bg-white/20" : "bg-slate-50 group-hover:bg-white"
                        )}>
                          <feature.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold">{feature.label}</p>
                          <p className={cn("text-[9px] font-medium", isSelected ? "text-indigo-100" : "text-slate-400")}>{feature.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <Button 
              type="button" 
              variant="ghost" 
              onClick={prevStep}
              className="px-6 h-12 rounded-2xl gap-2 font-bold text-slate-400 hover:text-slate-900"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          ) : <div />}

          <div className="flex items-center gap-3">
            {step < 2 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 h-12 rounded-2xl gap-2 font-bold shadow-xl shadow-slate-200 active:scale-[0.98] transition-all"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-12 rounded-2xl gap-2 font-black shadow-xl shadow-indigo-200 active:scale-[0.98] transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Finalizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Confirm & Register
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Building2, 
  Briefcase, 
  FileText,
  Warehouse,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/actions/public";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SignupForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "CLIENT",
    // Phase 2: OWNER
    companyName: "",
    warehouseCount: "",
    // Phase 2: CLIENT
    city: "",
    businessType: "",
    gstNumber: "",
    requirements: "",
    // Security
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1 && (!formData.email || !formData.name)) {
      toast.error("Please fill in basic details");
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const result = await registerUser(formData);
    
    if (result.success) {
      setStep(3); // Show success/pending state
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  if (step === 3) {
    return (
      <Card className="p-8 text-center space-y-6 max-w-md mx-auto border-2 border-orange-500 shadow-2xl">
        <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="h-10 w-10 text-orange-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Registration Transmitted</h2>
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            Your industrial account is now in the <span className="text-orange-600">Verification Queue</span>. 
            An administrator will review your credentials within 24 operational hours.
          </p>
        </div>
        <Button 
          onClick={() => router.push("/auth/signin")}
          className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest h-11"
        >
          Return to Sign In
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8 px-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all",
              step >= i ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-900/20" : "bg-white border-slate-200 text-slate-400"
            )}>
              {i}
            </div>
            {i === 1 && <div className={cn("h-1 w-24 rounded-full transition-all", step > 1 ? "bg-orange-600" : "bg-slate-200")} />}
          </div>
        ))}
      </div>

      <Card className="p-8 border-slate-200 shadow-xl rounded-2xl bg-white relative overflow-hidden">
        <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6 relative z-10">
          
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Initial Validation</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Establish your network identity</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input name="name" required value={formData.name} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500" placeholder="e.g. ARJUN SHARMA" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Node</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500" placeholder="corp@domain.com" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Contact</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input name="phone" required value={formData.phone} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500" placeholder="+91 00000 00000" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input name="location" required value={formData.location} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500" placeholder="CITY / STATE" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Operational Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase outline-none focus:border-orange-500">
                  <option value="CLIENT">Logistics Client (Merchant)</option>
                  <option value="OWNER">Warehouse Owner (Operator)</option>
                </select>
              </div>

              <Button onClick={handleNext} className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 group">
                Proceed to Credentials <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Operational Details</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conditional verification based on role: {formData.role}</p>
              </div>

              {formData.role === "OWNER" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <input name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500" placeholder="e.g. BHARAT LOGISTICS PVT LTD" />
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Active Warehouses</label>
                    <div className="relative">
                      <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <input name="warehouseCount" type="number" required value={formData.warehouseCount} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500" placeholder="0" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered City</label>
                    <input name="city" required value={formData.city} onChange={handleChange} className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500" placeholder="e.g. INDORE" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Type</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <input name="businessType" required value={formData.businessType} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500" placeholder="e.g. WHOLESALER" />
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GST Identification Number (Optional)</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <input name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500" placeholder="22AAAAA0000A1Z5" />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500" placeholder="••••••••" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500" placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline" className="h-11 px-6 border-slate-200 text-slate-400 font-black text-xs uppercase tracking-widest rounded-xl">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1 h-11 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-orange-900/20">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Verification Request"}
                </Button>
              </div>
            </div>
          )}

        </form>
      </Card>
    </div>
  );
}

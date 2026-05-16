import SignupForm from "@/components/features/SignupForm";
import { Package } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 bg-orange-600 rounded-xl flex items-center justify-center shadow-2xl shadow-orange-900/40">
            <Package className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Bharat<span className="text-orange-600">Godam</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Industrial Logistics Network</p>
          </div>
        </div>

        <SignupForm />

        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Already a verified participant?{" "}
          <Link href="/auth/signin" className="text-orange-600 hover:underline">
            Authenticate Session
          </Link>
        </p>
      </div>
    </div>
  );
}

// 'use client';

// import { signIn } from "next-auth/react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { LayoutDashboard, Lock, Mail, Loader2, ShieldCheck, AlertCircle, Package } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { cn } from "@/lib/utils";

// const loginSchema = z.object({
//   email: z.string().email("Industrial email identity required"),
//   password: z.string().min(6, "Credentials must meet 6-char security minimum"),
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// export default function SignInPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Check for errors in URL (from NextAuth redirects)
//   useEffect(() => {
//     const errorParam = searchParams.get("error");
//     if (errorParam === "CredentialsSignin") {
//       setError("AUTHENTICATION_FAILED: Invalid credential pair.");
//     } else if (errorParam) {
//       setError(`SYSTEM_ERROR: ${errorParam}`);
//     }
//   }, [searchParams]);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: LoginFormValues) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       // 🛡️ CLEAN LOGIN PROTOCOL
//       const result = await signIn("credentials", {
//         email: data.email.toLowerCase(),
//         password: data.password,
//         redirect: false,
//       });

//       if (result?.ok) {
//         // Force session parity and redirect based on role
//         // NextAuth doesn't return the user in the result, so we fetch it or use the redirect callback logic
//         // For simplicity and speed, we refresh and let middleware/layout handle the specific landing
//         router.push("/dashboard"); // This will hit the proxy and redirect correctly
//         router.refresh();
//       } else if (result?.error) {
//         // Parse custom error messages from authorize()
//         if (result.error.includes("ACCOUNT_PENDING")) {
//           setError("PENDING_VERIFICATION: Your identity is currently being audited by Administration.");
//         } else if (result.error.includes("ACCOUNT_REJECTED")) {
//           setError("ACCESS_DENIED: Operational privileges have been revoked.");
//         } else {
//           setError("AUTHENTICATION_FAILED: Invalid identity or credential pair.");
//         }
//         setIsLoading(false);
//       }
//     } catch (err) {
//       setError("SYSTEM_TIMEOUT: Communication with Identity Registry failed.");
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden">
//       {/* Background Industrial Accents */}
//       <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
//       <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full opacity-50 blur-3xl" />
      
//       <Card className="w-full max-w-md shadow-2xl border-slate-200 rounded-3xl overflow-hidden bg-white relative z-10">
//         <CardHeader className="space-y-4 text-center pb-8 pt-10">
//           <div className="flex justify-center">
//             <div className="h-14 w-14 bg-[#0f172a] rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-900/20">
//               <Package className="h-8 w-8 text-white" />
//             </div>
//           </div>
//           <div className="space-y-1">
//             <CardTitle className="text-2xl font-black tracking-tight uppercase italic text-slate-900">
//               Bharat<span className="text-indigo-600">Godam</span>
//             </CardTitle>
//             <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//               Industrial Logistics Handshake
//             </CardDescription>
//           </div>
//         </CardHeader>
        
//         <CardContent className="pb-10 px-8">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             {error && (
//               <div className="rounded-2xl bg-rose-50 p-4 text-[11px] font-bold text-rose-600 border border-rose-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
//                 <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
//                 <span>{error}</span>
//               </div>
//             )}

//             <div className="space-y-1.5">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Node</label>
//               <div className="relative">
//                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
//                 <input
//                   {...register("email")}
//                   type="email"
//                   placeholder="corp@domain.com"
//                   className={cn(
//                     "w-full h-12 pl-12 pr-4 bg-slate-50 border rounded-2xl text-xs font-bold outline-none transition-all",
//                     errors.email ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-indigo-600"
//                   )}
//                   disabled={isLoading}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-[9px] text-rose-600 font-black uppercase tracking-tighter ml-1">{errors.email.message}</p>
//               )}
//             </div>

//             <div className="space-y-1.5">
//               <div className="flex items-center justify-between ml-1">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Key</label>
//                 <button type="button" className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Reset</button>
//               </div>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
//                 <input
//                   {...register("password")}
//                   type="password"
//                   placeholder="••••••••"
//                   className={cn(
//                     "w-full h-12 pl-12 pr-4 bg-slate-50 border rounded-2xl text-xs font-bold outline-none transition-all",
//                     errors.password ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-indigo-600"
//                   )}
//                   disabled={isLoading}
//                 />
//               </div>
//               {errors.password && (
//                 <p className="text-[9px] text-rose-600 font-black uppercase tracking-tighter ml-1">{errors.password.message}</p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full h-12 flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 text-xs font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-900/20 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 group"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                   <span>Synchronizing...</span>
//                 </>
//               ) : (
//                 <>
//                   <span>Authenticate Session</span>
//                   <ShieldCheck className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
//                 </>
//               )}
//             </button>
//           </form>
          
//           <div className="mt-8 text-center pt-6 border-t border-slate-50">
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//               Unverified Participant?{" "}
//               <a href="/auth/signup" className="text-indigo-600 font-black hover:underline">Request Onboarding</a>
//             </p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Loading Overlay */}
//       {isLoading && (
//         <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-500">
//           <div className="flex flex-col items-center gap-4">
//             <div className="h-16 w-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
//             <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Establishing Operational Link...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Mail, Loader2, ShieldCheck, AlertCircle, Package } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().email("Industrial email identity required"),
  password: z.string().min(6, "Credentials must meet 6-char security minimum"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get("error");

    if (errorParam === "CredentialsSignin") {
      setError("AUTHENTICATION_FAILED: Invalid credential pair.");
    } else if (errorParam) {
      setError(`SYSTEM_ERROR: ${errorParam}`);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else if (result?.error) {
        if (result.error.includes("ACCOUNT_PENDING")) {
          setError("PENDING_VERIFICATION: Your identity is currently being audited by Administration.");
        } else if (result.error.includes("ACCOUNT_REJECTED")) {
          setError("ACCESS_DENIED: Operational privileges have been revoked.");
        } else {
          setError("AUTHENTICATION_FAILED: Invalid identity or credential pair.");
        }

        setIsLoading(false);
      }
    } catch (err) {
      setError("SYSTEM_TIMEOUT: Communication with Identity Registry failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full opacity-50 blur-3xl" />

      <Card className="w-full max-w-md shadow-2xl border-slate-200 rounded-3xl overflow-hidden bg-white relative z-10">
        <CardHeader className="space-y-4 text-center pb-8 pt-10">
          <div className="flex justify-center">
            <div className="h-14 w-14 bg-[#0f172a] rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-900/20">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-black tracking-tight uppercase italic text-slate-900">
              Bharat<span className="text-indigo-600">Godam</span>
            </CardTitle>

            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Industrial Logistics Handshake
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pb-10 px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="rounded-2xl bg-rose-50 p-4 text-[11px] font-bold text-rose-600 border border-rose-100 flex items-start gap-3">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Email Node
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />

                <input
                  {...register("email")}
                  type="email"
                  placeholder="corp@domain.com"
                  className={cn(
                    "w-full h-12 pl-12 pr-4 bg-slate-50 border rounded-2xl text-xs font-bold outline-none transition-all",
                    errors.email
                      ? "border-rose-300 focus:border-rose-500"
                      : "border-slate-200 focus:border-indigo-600"
                  )}
                  disabled={isLoading}
                />
              </div>

              {errors.email && (
                <p className="text-[9px] text-rose-600 font-black uppercase tracking-tighter ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />

                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className={cn(
                    "w-full h-12 pl-12 pr-4 bg-slate-50 border rounded-2xl text-xs font-bold outline-none transition-all",
                    errors.password
                      ? "border-rose-300 focus:border-rose-500"
                      : "border-slate-200 focus:border-indigo-600"
                  )}
                  disabled={isLoading}
                />
              </div>

              {errors.password && (
                <p className="text-[9px] text-rose-600 font-black uppercase tracking-tighter ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 text-xs font-black text-white uppercase tracking-[0.2em]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Synchronizing...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ShieldCheck className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
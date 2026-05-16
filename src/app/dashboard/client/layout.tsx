import { ReactNode } from "react";
import ClientSidebar from "@/components/shared/ClientSidebar";
import { Globe, User, Bell } from "lucide-react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Persistent Navigation */}
      <ClientSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-[240px] min-h-screen flex flex-col">
        {/* Industrial Header */}
        <header className="h-12 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-indigo-600" />
            <h2 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Client Workspace | <span className="text-slate-400">Global Inventory Tracker</span></h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
              <Bell className="h-4 w-4 text-slate-400" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-orange-600 rounded-full border border-white" />
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
              <div className="h-5 w-5 bg-indigo-100 rounded-md flex items-center justify-center">
                <User className="h-3 w-3 text-indigo-600" />
              </div>
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">Verified Account</span>
            </div>
          </div>
        </header>

        {/* Workspace Canvas */}
        <div className="p-6 max-w-screen-2xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

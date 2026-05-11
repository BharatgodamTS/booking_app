"use client";

import { useEffect, useState } from "react";
import { 
  Command, 
  Search, 
  Warehouse, 
  ClipboardList, 
  BarChart3, 
  Settings, 
  User,
  Zap
} from "lucide-react";
import { 
  Dialog, 
  DialogContent 
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 border-none bg-transparent shadow-2xl overflow-hidden max-w-2xl top-[20%]">
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-slate-900/10 overflow-hidden">
          <div className="flex items-center px-6 py-4 border-b border-slate-100">
            <Search className="h-5 w-5 text-indigo-500 mr-3" />
            <input 
              placeholder="Search anything... (Try 'Bookings' or 'Reports')"
              className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-lg"
              autoFocus
            />
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500">ESC</span>
            </div>
          </div>

          <div className="p-4 space-y-6 max-h-[400px] overflow-y-auto">
            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Navigation</p>
              <div className="space-y-1">
                <CommandItem 
                  icon={Warehouse} 
                  label="Warehouses" 
                  shortcut="G W" 
                  onClick={() => runCommand(() => router.push("/dashboard/warehouse/warehouses"))}
                />
                <CommandItem 
                  icon={ClipboardList} 
                  label="Bookings" 
                  shortcut="G B" 
                  onClick={() => runCommand(() => router.push("/dashboard/warehouse/bookings"))}
                />
                <CommandItem 
                  icon={BarChart3} 
                  label="Reports" 
                  shortcut="G R" 
                  onClick={() => runCommand(() => router.push("/dashboard/warehouse/reports"))}
                />
              </div>
            </div>

            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Quick Actions</p>
              <div className="space-y-1">
                <CommandItem 
                  icon={Zap} 
                  label="Add New Warehouse" 
                  color="emerald"
                  onClick={() => runCommand(() => router.push("/dashboard/warehouse/warehouses?add=true"))}
                />
                <CommandItem 
                  icon={User} 
                  label="Switch Profile" 
                  onClick={() => runCommand(() => router.push("/dashboard"))}
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] text-slate-400 font-medium">Use arrow keys to navigate</p>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-indigo-500 animate-pulse" />
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Powered by Antigravity</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CommandItem({ icon: Icon, label, shortcut, color = "indigo", onClick }: any) {
  const colorClasses: any = {
    indigo: "text-indigo-500 group-hover:bg-indigo-50",
    emerald: "text-emerald-500 group-hover:bg-emerald-50",
  };

  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl group hover:bg-slate-50 transition-all duration-200 text-left"
    >
      <div className="flex items-center gap-3">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-premium", colorClasses[color])}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="font-bold text-slate-700 group-hover:text-slate-900">{label}</span>
      </div>
      {shortcut && (
        <span className="text-[10px] font-bold text-slate-300 group-hover:text-slate-400 tracking-widest">{shortcut}</span>
      )}
    </button>
  );
}

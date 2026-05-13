"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Home, 
  Boxes, 
  Users, 
  Download, 
  Upload, 
  FileText, 
  FileEdit, 
  BookUser, 
  IndianRupee,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard/warehouse", icon: LayoutDashboard },
  { name: "Warehouses", href: "/dashboard/warehouse/warehouses", icon: Home },
  { name: "Bookings", href: "/dashboard/warehouse/bookings", icon: Download },
  { name: "Reports", href: "/dashboard/warehouse/reports", icon: FileText },
];

export default function WarehouseSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0f172a] text-white rounded-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-60 bg-[#0f172a] text-slate-300 flex flex-col transition-transform lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Branding */}
        <div className="p-4 border-b border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-black text-lg">B</span>
            </div>
            <div>
              <h1 className="text-xs font-black text-white tracking-tighter leading-none uppercase">BNS Master</h1>
              <p className="text-[9px] font-bold text-slate-500 uppercase mt-0.5 tracking-widest">Enterprise ERP</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2 text-[12px] font-bold transition-all group",
                  isActive 
                    ? "bg-[#f97316] text-white" 
                    : "hover:bg-slate-800/50 hover:text-white"
                )}
              >
                <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} strokeWidth={1.5} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-2 border-t border-slate-800/50">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="flex items-center gap-2.5 px-3 py-2 w-full text-[11px] font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

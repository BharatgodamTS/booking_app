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
  { name: "Dashboard", href: "/dashboard/warehouse/dashboard", icon: LayoutDashboard },
  { name: "Warehouse Master", href: "/dashboard/warehouse/warehouses", icon: Home },
  { name: "Commodity Master", href: "/dashboard/warehouse/commodities", icon: Boxes },
  { name: "Client Master", href: "/dashboard/warehouse/clients", icon: Users },
  { name: "Inward Transaction", href: "/dashboard/warehouse/inward", icon: Download },
  { name: "Outward Transaction", href: "/dashboard/warehouse/outward", icon: Upload },
  { name: "Transactions Report", href: "/dashboard/warehouse/reports", icon: FileText },
  { name: "Client Invoices", href: "/dashboard/warehouse/invoices", icon: FileEdit },
  { name: "Client Ledger", href: "/dashboard/warehouse/ledger", icon: BookUser },
  { name: "Revenue Split", href: "/dashboard/warehouse/revenue", icon: IndianRupee },
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
        "fixed inset-y-0 left-0 z-40 w-64 bg-[#0f172a] text-slate-300 flex flex-col transition-transform lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Branding */}
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-black text-xl">B</span>
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-tighter leading-none">BNS WAREHOUSE</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Master Control</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-[13px] font-bold transition-all group",
                  isActive 
                    ? "bg-[#f97316] text-white shadow-lg shadow-orange-500/20" 
                    : "hover:bg-slate-800/50 hover:text-white"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 px-4 py-3 w-full text-[13px] font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

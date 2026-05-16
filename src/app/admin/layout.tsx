"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  Users, 
  Warehouse, 
  ShieldCheck, 
  LayoutDashboard,
  LogOut, 
  Menu,
  User as UserIcon,
  ChevronRight,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Verification", href: "/admin/warehouses", icon: ShieldCheck },
  { label: "Approvals", href: "/admin/approvals", icon: UserIcon },
  { label: "Master Bookings", href: "/admin/bookings", icon: ClipboardList },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full bg-slate-950 text-white w-64 border-r border-slate-800">
      <div className="p-8">
        <div className="flex items-center gap-3 font-bold text-xl">
          <div className="h-8 w-8 bg-rose-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span>Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-200",
                isActive 
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-500")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-900">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-rose-400 hover:text-rose-300 hover:bg-rose-900/10 rounded-xl"
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        >
          <LogOut className="h-4 w-4" />
          Exit Admin Mode
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden md:flex flex-col fixed inset-y-0 z-50">
        <NavContent />
      </aside>

      <div className="flex-1 flex flex-col md:pl-64">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-between h-20 px-8">
            <div className="flex items-center gap-4">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5 text-slate-500" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 border-none">
                  <NavContent />
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Core System</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-900">
                  {pathname.split("/").pop() || "Control"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-slate-900">System Admin</span>
                <span className="text-[10px] text-emerald-600 font-bold tracking-tighter">GOD MODE ACTIVE</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

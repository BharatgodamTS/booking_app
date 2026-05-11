"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumStatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "indigo" | "emerald" | "amber" | "rose";
  className?: string;
}

export function PremiumStatCard({
  title,
  value,
  subValue,
  icon: Icon,
  trend,
  color = "indigo",
  className,
}: PremiumStatCardProps) {
  const colorMap = {
    indigo: "from-indigo-500/10 to-transparent text-indigo-600 border-indigo-100",
    emerald: "from-emerald-500/10 to-transparent text-emerald-600 border-emerald-100",
    amber: "from-amber-500/10 to-transparent text-amber-600 border-amber-100",
    rose: "from-rose-500/10 to-transparent text-rose-600 border-rose-100",
  };

  const glowMap = {
    indigo: "group-hover:shadow-indigo-500/10",
    emerald: "group-hover:shadow-emerald-500/10",
    amber: "group-hover:shadow-amber-500/10",
    rose: "group-hover:shadow-rose-500/10",
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className={cn(
        "group relative bg-white rounded-[2.5rem] p-8 border border-slate-100/80 shadow-2xl shadow-slate-200/30 transition-all duration-500 overflow-hidden",
        glowMap[color],
        className
      )}
    >
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

      {/* Decorative Glow Background */}
      <div className={cn(
        "absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-all duration-700 blur-[80px]",
        colorMap[color]
      )} />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className={cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center transition-premium group-hover:rotate-6",
            userColorClasses(color)
          )}>
            <Icon className="h-7 w-7" />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold",
              trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            )}>
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
            {subValue && <span className="text-sm font-bold text-slate-400">{subValue}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function userColorClasses(color: string) {
  switch (color) {
    case "indigo": return "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white shadow-lg shadow-indigo-100";
    case "emerald": return "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white shadow-lg shadow-emerald-100";
    case "amber": return "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white shadow-lg shadow-amber-100";
    case "rose": return "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white shadow-lg shadow-rose-100";
    default: return "bg-slate-50 text-slate-600 group-hover:bg-slate-900 group-hover:text-white shadow-lg shadow-slate-100";
  }
}

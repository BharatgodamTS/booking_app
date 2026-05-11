"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, Maximize, Box, ArrowRight, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WarehouseTiltCardProps {
  warehouse: any;
  index: number;
}

export function WarehouseTiltCard({ warehouse, index }: WarehouseTiltCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative group cursor-pointer"
    >
      <div 
        style={{ transform: "translateZ(50px)" }}
        className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-ambient group-hover:shadow-premium transition-all duration-700 flex flex-col h-full overflow-hidden"
      >
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        
        {/* Asymmetrical Badge */}
        <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-2">
          <Badge className="bg-brand-orange text-white border-none font-sans font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-brand-orange/20">
            {warehouse.status || 'Verified'}
          </Badge>
          <span className="text-[10px] font-black text-slate-300 tracking-tighter">REF: {warehouse.id.slice(-6).toUpperCase()}</span>
        </div>

        <div className="flex-1 space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-brand-cream border border-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-all duration-500 shadow-inner">
              <Box strokeWidth={1.5} className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-black text-brand-charcoal group-hover:text-brand-orange transition-colors tracking-tight leading-none mb-2">{warehouse.name}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-400 font-medium italic">
                <MapPin strokeWidth={1.5} className="h-4 w-4 text-brand-orange" />
                {warehouse.address}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 border-t border-slate-50 pt-8">
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Availability</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-brand-charcoal tracking-tighter">{warehouse.availableCapacity}</span>
                <span className="text-xs font-bold text-slate-400 tracking-tight">MT</span>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(warehouse.availableCapacity / warehouse.totalCapacity) * 100}%` }}
                  className="h-full bg-brand-orange rounded-full"
                />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Premium Rate</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-brand-charcoal tracking-tighter">₹{warehouse.pricing}</span>
                <span className="text-xs font-bold text-slate-400 tracking-tight">/ MT</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-50 relative z-10">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 brand-loader shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active System</span>
          </div>
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-brand-orange font-bold text-sm"
          >
            Manage Facility <ArrowRight strokeWidth={1.5} className="h-4 w-4" />
          </motion.div>
        </div>

        {/* Decorative Corner Accent */}
        <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-brand-orange/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
    </motion.div>
  );
}

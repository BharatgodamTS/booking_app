"use client";

import { useEffect, useState } from "react";
import { 
  Search, 
  MapPin, 
  Warehouse, 
  Star, 
  ShieldCheck,
  TrendingUp,
  Package,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublicWarehouses } from "@/lib/actions/public";
import { motion } from "framer-motion";

export default function ClientMarketplace() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWarehouses = async () => {
      const data = await getPublicWarehouses();
      setWarehouses(data);
      setIsLoading(false);
    };
    fetchWarehouses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Explore Storage</h1>
          <p className="text-slate-500">Find verified, secure warehouses for your commodities across India.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            placeholder="Search by city or warehouse name..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-[400px] bg-slate-50 animate-pulse rounded-3xl border border-slate-100" />
          ))
        ) : warehouses.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <Warehouse className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400">No verified warehouses available at the moment.</p>
          </div>
        ) : (
          warehouses.map((w) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={w.id}
            >
              <Card className="border-none shadow-xl shadow-slate-100 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500">
                <div className="h-48 bg-slate-900 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
                  <Badge className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-indigo-600 border-none font-bold">
                    {w.totalCapacity} MT Total
                  </Badge>
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="flex items-center gap-1 text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">
                      <ShieldCheck className="h-3 w-3" /> Verified Secure
                    </div>
                    <CardTitle className="text-xl font-bold">{w.name}</CardTitle>
                  </div>
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <MapPin className="h-4 w-4 text-indigo-500" />
                      {w.address}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-amber-500" />
                      <span className="text-sm font-bold">4.8</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available</p>
                      <p className="text-lg font-bold text-slate-900">{w.availableCapacity} MT</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price / MT</p>
                      <p className="text-lg font-bold text-slate-900">₹{w.pricing}</p>
                    </div>
                  </div>

                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-14 font-bold shadow-lg shadow-indigo-100 group-hover:scale-[1.02] transition-transform">
                    Check Availability
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
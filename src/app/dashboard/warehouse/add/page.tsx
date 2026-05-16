'use client';

import { 
  Plus, 
  Warehouse as WarehouseIcon, 
  ClipboardList,
  ArrowRight
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WarehouseForm from "@/components/features/WarehouseForm";
import Link from "next/link";

export default function WarehouseManagementPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-black text-slate-900 tracking-tight italic">Facility <span className="text-slate-400 font-normal not-italic">Registry</span></h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Expansion Hub</p>
        </div>
        <Link href="/dashboard/warehouse">
          <Button variant="outline" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 rounded-xl gap-2">
            Command Center <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Top Section: Registration Hub */}
        <Card className="border-slate-200 shadow-sm bg-slate-50/50 rounded-3xl overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100">
            <CardTitle className="text-xl flex items-center gap-2 uppercase tracking-tight font-black italic">
              <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/20">
                <Plus className="h-5 w-5 text-white" />
              </div>
              Expansion <span className="text-indigo-600">Terminal</span>
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Add high-capacity storage nodes to the BharatGodam network.</CardDescription>
          </CardHeader>
          <CardContent className="p-12 text-center space-y-6">
            <div className="max-w-md mx-auto space-y-4">
              <div className="h-20 w-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto border border-slate-200 shadow-sm">
                <WarehouseIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Facility Registration Protocol</h3>
                <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">Capture full industrial metadata including WDRA status and GST credentials for administrative verification.</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <WarehouseForm 
                trigger={
                  <Button className="bg-[#0f172a] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-[0.2em] h-14 px-12 rounded-2xl shadow-2xl shadow-slate-900/40 transition-all active:scale-95">
                    Launch Registration Wizard
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Bottom Section: Network Inventory */}
        <Card className="border-slate-200 shadow-sm overflow-hidden rounded-3xl">
          <CardHeader className="bg-slate-900 text-white border-b border-slate-800">
            <CardTitle className="text-xl flex items-center gap-2 uppercase tracking-tight font-black italic">
              <ClipboardList className="h-5 w-5 text-indigo-400" />
              Operational <span className="text-indigo-400 font-normal not-italic">Nodes</span>
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live status of your industrial storage inventory.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-20 text-center space-y-3 bg-slate-50/50">
               <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic">
                 Node data synchronized with Command Center
               </div>
               <Link href="/dashboard/warehouse">
                  <Button variant="link" className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                    Manage all nodes in Command Center
                  </Button>
               </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  UserPlus,
  Calendar,
  Warehouse as WarehouseIcon,
  Phone,
  Package,
  Loader2,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getOwnerBookings, updateBookingStatus, createManualBooking } from "@/lib/actions/booking";
import { getOwnerWarehouses } from "@/lib/actions/warehouse";


export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const [bData, wData] = await Promise.all([
      getOwnerBookings(),
      getOwnerWarehouses()
    ]);
    setBookings(bData);
    setWarehouses(wData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const res = await updateBookingStatus(id, status);
    if (res.success) {
      toast.success(`Booking ${status.toLowerCase()} successfully`);
      fetchData();
    } else {
      toast.error(res.error || "Action failed");
    }
  };

  const [formData, setFormData] = useState({
    warehouseId: "",
    clientName: "",
    clientContact: "",
    weight: "",
    commodityType: "",
    startDate: "",
    endDate: ""
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createManualBooking({
      ...formData,
      weight: Number(formData.weight)
    });

    if (res.success) {
      toast.success("Manual booking registered!");
      setFormData({
        warehouseId: "", clientName: "", clientContact: "",
        weight: "", commodityType: "", startDate: "", endDate: ""
      });
      fetchData();
    } else {
      toast.error(res.error || "Registration failed");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Booking Operations</h1>
        <p className="text-slate-500">Manage incoming weight-based requests (MT) and register walk-ins.</p>
      </div>

      {/* Incoming Requests Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold uppercase tracking-wider text-xs">
          <ClipboardList className="h-4 w-4" />
          Pending Requests
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2].map(i => <div key={i} className="h-24 w-full bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />)}
          </div>
        ) : bookings.filter(b => b.status === 'PENDING').length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <p className="text-slate-400 text-sm">No pending requests at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.filter(b => b.status === 'PENDING').map((booking) => (
              <Card key={booking.id} className="border-slate-100 shadow-sm overflow-hidden rounded-2xl group hover:border-indigo-100 transition-all">
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="flex-1 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
                          <Package className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{booking.client?.name || "Platform Client"}</h3>
                          <p className="text-xs text-slate-500">{booking.warehouse.name}</p>
                        </div>
                      </div>
                      <Badge variant="warning">PENDING</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Weight</p>
                        <p className="text-sm font-semibold">{booking.weight} MT</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Commodity</p>
                        <p className="text-sm font-semibold truncate max-w-[150px]">{booking.commodityType || "Not Specified"}</p>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Duration</p>
                        <p className="text-sm font-semibold flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-4 md:p-6 border-t md:border-t-0 md:border-l border-slate-100 flex flex-row md:flex-col justify-center gap-3">
                    <Button
                      onClick={() => handleStatusUpdate(booking.id, 'APPROVED')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-6 gap-2 flex-1"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                      variant="ghost"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl h-10 px-6 gap-2 flex-1"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Manual Entry Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold uppercase tracking-wider text-xs">
          <UserPlus className="h-4 w-4" />
          Walk-In Registration
        </div>

        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-900 text-white p-8">
            <CardTitle>Manual Booking Form (Weight-Based)</CardTitle>
            <CardDescription className="text-slate-400">Register local clients and specify commodity weight in Metric Tons (MT).</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Target Warehouse</label>
                <select
                  required
                  value={formData.warehouseId}
                  onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                >
                  <option value="">Select Warehouse...</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.availableCapacity} MT available)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Client Name</label>
                <input
                  required
                  placeholder="Akshay Vadher"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Contact Info</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    required
                    placeholder="+91 98765 43210"
                    value={formData.clientContact}
                    onChange={(e) => setFormData({ ...formData, clientContact: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Commodity Name / Type</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    required
                    placeholder="Wheat, rice"
                    value={formData.commodityType}
                    onChange={(e) => setFormData({ ...formData, commodityType: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Weight (MT)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  placeholder="10.5"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-1" />

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Start Date</label>
                <input
                  required
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">End Date</label>
                <input
                  required
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>

              <div className="md:col-span-3 pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-10 rounded-2xl shadow-xl shadow-indigo-100 font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Entry...
                    </>
                  ) : (
                    "Confirm Manual Booking"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Plus,
  Loader2,
  Trash2,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getAllUsers, createNewUser } from "@/lib/actions/admin";

export default function AdminUserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "OWNER" as any
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createNewUser(formData);
    
    if (res.success) {
      toast.success("User created successfully!");
      setIsDialogOpen(false);
      setFormData({ name: "", email: "", password: "", role: "OWNER" });
      fetchUsers();
    } else {
      toast.error(res.error || "Failed to create user");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-rose-600 uppercase tracking-widest">
            <ShieldCheck className="h-3 w-3" />
            System Control
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Identity Management</h1>
          <p className="text-slate-500">Oversee system access and manage multi-role user accounts.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-950 hover:bg-slate-900 text-white shadow-xl shadow-slate-200 gap-2 h-11 px-6 rounded-xl transition-all active:scale-[0.98]">
              <UserPlus className="h-4 w-4" />
              Create New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white p-8 rounded-3xl border-none shadow-2xl">
            <DialogHeader className="mb-6 text-left">
              <DialogTitle className="text-2xl font-bold text-slate-900">Add New Identity</DialogTitle>
              <DialogDescription className="text-slate-500">
                Register a new Admin, Client, or Warehouse Owner manually.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input 
                  required
                  placeholder="Enter name..."
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/10 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input 
                  required
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/10 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Access Password</label>
                <input 
                  required
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/10 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Role</label>
                <select 
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/10 outline-none"
                >
                  <option value="OWNER">Warehouse Owner</option>
                  <option value="CLIENT">End Client / Booker</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-2xl font-bold shadow-lg shadow-slate-100"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm & Create User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <Users className="h-6 w-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Active Users</p>
            <p className="text-2xl font-bold text-slate-900">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identity</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              [1, 2, 3].map(i => <tr key={i} className="animate-pulse h-16 bg-slate-50/20" />)
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <span className="font-bold text-slate-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-slate-300" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      className={
                        user.role === 'ADMIN' ? "bg-rose-50 text-rose-600 border-rose-100" :
                        user.role === 'OWNER' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                        "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }
                      variant="outline"
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 italic">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-rose-600 rounded-xl">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

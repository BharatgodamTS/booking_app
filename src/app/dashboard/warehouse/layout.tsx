import WarehouseSidebar from "@/components/shared/WarehouseSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function WarehouseDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      <WarehouseSidebar />
      <main className="flex-1 lg:ml-60 p-4 lg:p-6">
        <div className="max-w-screen-2xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

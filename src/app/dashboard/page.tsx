import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRootPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const role = session.user.role;

  if (role === "ADMIN") {
    redirect("/admin/users");
  } else if (role === "OWNER" || role === "WAREHOUSE_OWNER") {
    redirect("/dashboard/warehouse/dashboard");
  } else if (role === "CLIENT") {
    redirect("/dashboard/client");
  } else {
    redirect("/unauthorized");
  }

  return null;
}

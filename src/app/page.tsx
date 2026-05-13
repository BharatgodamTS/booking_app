import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const role = session.user.role;

  if (role === "ADMIN") redirect("/admin/users");
  if (role === "OWNER" || role === "WAREHOUSE_OWNER")    redirect("/dashboard/warehouse");
  if (role === "CLIENT") redirect("/dashboard/client");

  // Fallback to the smart dashboard redirector if no roles match
  redirect("/dashboard");

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
    </div>
  );
}

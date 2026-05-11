import { redirect } from "next/navigation";

export default function WarehouseRootRedirect() {
  redirect("/dashboard/warehouse/dashboard");
}

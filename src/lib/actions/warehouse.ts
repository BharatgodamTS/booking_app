'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createWarehouse(data: {
  name: string;
  address: string;
  totalCapacity: number;
  availableCapacity: number;
  pricing: number;
  features: string[];
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    if (session.user.role !== "OWNER" && session.user.role !== "WAREHOUSE_OWNER" && session.user.role !== "ADMIN") {
      return { success: false, error: "Forbidden. Only owners can register warehouses." };
    }

    // [SELF-REPAIR] If using mock session, ensure DB record exists to prevent P2003 error
    if (session.user.id === "mock-id-123") {
      await prisma.user.upsert({
        where: { id: "mock-id-123" },
        update: { role: "OWNER" },
        create: {
          id: "mock-id-123",
          email: session.user.email || "test@bharatgodam.com",
          name: session.user.name || "Test Owner",
          password: "password123",
          role: "OWNER",
        },
      });
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        name: data.name,
        address: data.address,
        totalCapacity: data.totalCapacity,
        availableCapacity: data.availableCapacity,
        pricing: data.pricing,
        features: data.features.join(","),
        ownerId: session.user.id,
      },
    });

    revalidatePath('/dashboard/warehouse');
    revalidatePath('/dashboard/warehouse/warehouses');

    return { success: true, data: warehouse };
  } catch (error) {
    console.error("[CREATE_WAREHOUSE_ERROR]", error);
    return { success: false, error: "Failed to create warehouse record." };
  }
}

export async function getOwnerWarehouses() {
  try {
    console.log("🔍 [LOGISTICS] Fetching owner warehouses...");
    const session = await getServerSession(authOptions);
    console.log("👤 [LOGISTICS] Session retrieved for role:", session?.user?.role);

    if (!session?.user?.id) {
      console.warn("⚠️ [LOGISTICS] No user ID found in session.");
      return [];
    }

    const warehouses = await prisma.warehouse.findMany({
      where: {
        ownerId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log(`✅ [LOGISTICS] Successfully retrieved ${warehouses.length} warehouses.`);

    return warehouses.map(w => ({
      ...w,
      features: w.features ? w.features.split(",") : []
    }));
  } catch (error) {
    console.error("❌ [GET_WAREHOUSES_ERROR]", error);
    return [];
  }
}

export async function getDashboardStats() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { totalTransactions: 0, currentInventory: 0, activeWarehouses: 0, pendingRequests: 0 };
    }

    const [warehouses, bookings] = await Promise.all([
      prisma.warehouse.findMany({
        where: { ownerId: session.user.id }
      }),
      prisma.booking.findMany({
        where: { warehouse: { ownerId: session.user.id } }
      })
    ]);

    const activeWarehouses = warehouses.filter(w => w.status === 'APPROVED').length;
    const pendingRequests = bookings.filter(b => b.status === 'PENDING').length;
    const totalTransactions = bookings.length;
    const currentInventory = bookings
      .filter(b => b.status === 'APPROVED')
      .reduce((sum, b) => sum + (b.weight || 0), 0);

    return {
      totalTransactions,
      currentInventory,
      activeWarehouses,
      pendingRequests
    };
  } catch (error) {
    console.error("[GET_LOGISTICS_STATS_ERROR]", error);
    return { totalTransactions: 0, currentInventory: 0, activeWarehouses: 0, pendingRequests: 0 };
  }
}

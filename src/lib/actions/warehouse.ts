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
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
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

    return warehouses.map(w => ({
      ...w,
      features: w.features ? w.features.split(",") : []
    }));
  } catch (error) {
    console.error("[GET_WAREHOUSES_ERROR]", error);
    return [];
  }
}

export async function getDashboardStats() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { totalCount: 0, totalCapacity: 0, avgOccupancy: 0, totalMonthlyRevenue: 0 };
    }

    const warehouses = await prisma.warehouse.findMany({
      where: {
        ownerId: session.user.id,
      },
    });

    const totalCount = warehouses.length;
    const totalCapacity = warehouses.reduce((sum, w) => sum + w.totalCapacity, 0);
    const totalMonthlyRevenue = warehouses.reduce((sum, w) => sum + w.pricing, 0);
    
    let totalOccupancyRate = 0;
    if (totalCount > 0) {
      totalOccupancyRate = warehouses.reduce((sum, w) => {
        const occupied = w.totalCapacity - w.availableCapacity;
        return sum + (occupied / w.totalCapacity);
      }, 0) / totalCount;
    }

    return {
      totalCount,
      totalCapacity, // Now in MT
      avgOccupancy: Math.round(totalOccupancyRate * 100),
      totalMonthlyRevenue
    };
  } catch (error) {
    console.error("[GET_STATS_ERROR]", error);
    return { totalCount: 0, totalCapacity: 0, avgOccupancy: 0, totalMonthlyRevenue: 0 };
  }
}
